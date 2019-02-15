const {getShuttleLocation, getMapStopEstimates} =
    require('../api/colbyshuttle');
const {speak} = require('./speak');

// Global Constants
const SECONDS = 1000;

// intialize the data for the data object, different from update in that all the
// data is set for the first time
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
  const resp = await getMapStopEstimates();
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

// update fields, maintaining persistent data points and overriding those that
// need updated
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
  const resp = await getMapStopEstimates();
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

// keep a god object of sorts to persist state between shuttle updates
const data = {};

// initialize before starting timer
initialize();

// update the state of the buses every five seconds
setInterval(async () => {
  await update();
  try {
    Object.keys(data).forEach(busID => {
      const nextStop = data[busID].stops.sort(
          (a, b) => a.secondsUntilStop - b.secondsUntilStop)[0];

      // STATE 1: bus has arrived
      if (data[busID].groundSpeed == 0 && nextStop.secondsUntilStop < 20 &&
          data[busID].arriving == false) {
        data[busID].arriving = true
        data[busID].ticks = 0
        const words = `Bus id ${busID} has arrived at ${nextStop.name}.`;
        speak(words);
      }

      // STATE 2: bus has departed
      else if (
          data[busID].groundSpeed > 0 && nextStop.secondsUntilStop > 20 &&
          data[busID].arriving == true) {
        data[busID].arriving = false
        data[busID].ticks = 0
        const words = `Bus id ${busID} has just departed for ${nextStop.name}.`;
        speak(words);
      }

      // STATE 3: between departure and arrival, en route
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
    console.error(error)
  }
}, 5 * SECONDS)