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

(async () => {
  const resp = await getShuttleRoute();
  console.log(resp)

  const resp2 = await getShuttleLocation();
  console.log(resp2)
})();