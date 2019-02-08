const axios = require('axios');
const BASE_URL = 'https://colbyshuttle.ridesystems.net/Services/JSONPRelay.svc';
const {speak} = require('./speak');

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

let isArriving = false;
const seconds = 1000;
setInterval(async () => {
  try {
    const data = {};
    const resp2 = await getShuttleLocation();

    resp2.forEach(x => {
      data[x.VehicleID] =
      {
        groundSpeed: x.GroundSpeed, routeID: x.RouteID, name: x.Name,
            direction: x.Heading, stops: [],
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

    if (!isArriving) {
      Object.keys(data).forEach(busID => {
        const nextStop = data[busID].stops.sort(
            (a, b) => a.secondsUntilStop > b.secondsUntilStop)[0];
        if (data[busID].groundSpeed == 0 && nextStop.secondsUntilStop < 20) {
          isArriving = true;
          speak(`Bus id ${busID} has arrived at ${nextStop.name}.`)
        }
      });
    }
    else {
      if (data[busID].groundSpeed > 0 && nextStop.secondsUntilStop > 20) {
        isArriving = false;
      }
    }



    Object.keys(data).forEach(busID => {
      console.log('BUS ID: ' + busID + ' stops:')
      data[busID]
          .stops.sort((a, b) => a.secondsUntilStop > b.secondsUntilStop)
          .forEach(x => console.log(x));
      console.log('Speed: ' + data[busID].groundSpeed);
      console.log();
    });
  } catch (error) {
  }
}, 5 * seconds)