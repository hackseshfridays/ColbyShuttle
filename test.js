const axios = require('axios');
const BASE_URL = 'https://colbyshuttle.ridesystems.net/Services/JSONPRelay.svc';
const {speak} = require('./speak');

const data = {};

const getShuttleLocation =
    async () => {
  const resp = await axios.get(BASE_URL + '/GetMapVehiclePoints');
  return resp.data;
}

const getShuttleRoute =
    async () => {
  const resp = await axios.get(BASE_URL + '/GetRoutes');
  return resp.data;
}

const getEstimates =
    async () => {
  const resp = await axios.get(BASE_URL + '/GetMapStopEstimates')
  return resp.data;
}

let isArriving = {};
const seconds = 1000;

const initialize =
    async () => {
  const resp2 = await getShuttleLocation();

  resp2.forEach(x => {
    data[x.VehicleID] =
    {
      groundSpeed: x.GroundSpeed, routeID: x.RouteID, name: x.Name,
          direction: x.Heading, stops: [], lat: x.Latitude, lon: x.Longitude,
          arriving: false, ticks: 0,
    }
  });
  const resp = await getEstimates();
  resp.forEach(x => {
    x.RouteStops.forEach(y => {
      y.Estimates.forEach(z => {data[z.VehicleID].stops.push({
                            name: y.Description,
                            order: y.StopOrder,
                            secondsUntilStop: z.SecondsToStop,
                          })});
    });
  })
}

const update =
    async () => {
  const resp2 = await getShuttleLocation();

  resp2.forEach(x => {
    data[x.VehicleID] =
    {
      groundSpeed: x.GroundSpeed, routeID: x.RouteID, name: x.Name,
          direction: x.Heading, stops: [], lat: x.Latitude, lon: x.Longitude,
          arriving: data[x.VehicleID].arriving, ticks: data[x.VehicleID].ticks,
    }
  });
  const resp = await getEstimates();
  resp.forEach(x => {
    x.RouteStops.forEach(y => {
      y.Estimates.forEach(z => {data[z.VehicleID].stops.push({
                            name: y.Description,
                            order: y.StopOrder,
                            secondsUntilStop: z.SecondsToStop,
                          })});
    });
  })
}

initialize();

setInterval(async () => {
  await update();
  try {
    Object.keys(data).forEach(busID => {
      const nextStop = data[busID].stops.sort(
          (a, b) => a.secondsUntilStop - b.secondsUntilStop)[0];
      console.log(nextStop)
      console.log(data[busID])
      if (data[busID].groundSpeed == 0 && nextStop.secondsUntilStop < 20 &&
          data[busID].arriving == false) {
        data[busID].arriving = true
        data[busID].ticks = 0
        const words = `Bus id ${busID} has arrived at ${nextStop.name}.`;
        speak(words);
      }
      else if (
          data[busID].groundSpeed > 0 && nextStop.secondsUntilStop > 20 &&
          data[busID].arriving == true) {
        data[busID].arriving = false
        data[busID].ticks = 0
        const words = `Bus id ${busID} has just departed for ${nextStop.name}.`;
        speak(words);
      }
      else if (data[busID].arriving == false) {
        let copy = data[busID];
        copy.ticks++;
        data[busID].ticks + 1;
        if (data[busID].ticks > 11) {
          const minutes = nextStop.secondsUntilStop / 60;
          const words = `Bus id ${busID} is on its way to ${
              nextStop.name}. It will arrive in ${Math.round(minutes)} minutes`;
          speak(words);
          data[busID].ticks = 0
        }
      }
    });
  } catch (error) {
    console.log(error)
  }
}, 5 * seconds)