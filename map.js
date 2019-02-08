const axios = require('axios');
const BASE_URL = 'https://colbyshuttle.ridesystems.net/Services/JSONPRelay.svc';
const {speak} = require('./speak');

const getShuttleLocation =
    async () => {
  const resp = await axios.get(BASE_URL + '/GetMapVehiclePoints');
  return resp.data;
}

let lat = 0;
let lon = 0;

let isArriving = false;
const seconds = 1000;
setInterval(async () => {
  const resp = await getShuttleLocation();
  const {Latitude, Longitude} = resp[0];
  lat = Latitude;
  lon = Longitude;
}, 1 * seconds)

const express = require('express')
const app = express()
const port = 3000


app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => res.send({
  geometry:
      {type: 'Point', coordinates: [lat, lon], type: 'Feature', properties: []}

}))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))