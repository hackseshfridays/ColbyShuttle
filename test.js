const axios = require('axios');
const BASE_URL = 'https://colbyshuttle.ridesystems.net/Services/JSONPRelay.svc';


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

const seconds = 1000;
setInterval(async () => {
  const resp2 = await getShuttleLocation();
  console.log(resp2)
}, 5 * seconds)