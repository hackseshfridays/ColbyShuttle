const axios = require('axios');
const BASE_URL = 'https://colbyshuttle.ridesystems.net/Services/JSONPRelay.svc';

// returns the location of the shuttle with some other useful information such
// as speed and direction
const getShuttleLocation = async () => {
  const resp = await axios.get(BASE_URL + '/GetMapVehiclePoints');
  return resp.data;
};

// returns estimates for stop location arrival in seconds with stop order
// NOTE: it does not account for a shuttle that decides to start skipping stops
const getMapStopEstimates = async () => {
  const resp = await axios.get(BASE_URL + '/GetMapStopEstimates')
  return resp.data;
};

module.exports = {
  getShuttleLocation,
  getMapStopEstimates,
}