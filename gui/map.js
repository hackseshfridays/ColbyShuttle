const {getShuttleLocation} = require('../api/colbyshuttle');
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

// start values for the latitude and longitude
let lat = 0;
let lon = 0;

// update the location of the first running bus (hardcoded) every second
const seconds = 1000;
setInterval(async () => {
  const resp = await getShuttleLocation();
  const {Latitude, Longitude} = resp[0];
  lat = Latitude;
  lon = Longitude;
}, 1 * seconds)

// CORS copy pasta, the tastiest type of pasta
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// spit out the data in the right format for mapbox
app.get('/', (req, res) => res.json({
  geometry: {type: 'Point', coordinates: [lon, lat]},
  type: 'Feature',
  properties: []
}))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))