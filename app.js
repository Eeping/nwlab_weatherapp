const yargs = require('yargs'); //import yargs
const axios = require('axios'); //import axios

//argv stores what user input
const argv = yargs
  .options('address')
  .argv;

const addr = argv.address;

const locationReq = `https://maps.googleapis.com/maps/api/geocode/json?address=${addr}&key=AIzaSyBo54sDKP0LPhJBhmX7FsUPBRZYsC4YczI`;

axios.get(locationReq).then((response) => {
  console.log(response.data.results[0].formatted_address);
  const lat = response.data.results[0].geometry.location.lat;
  const lng = response.data.results[0].geometry.location.lng;
  const weatherReq = `https://api.darksky.net/forecast/0cb776b7d2a10fb22584264f299b4661/${lat},${lng}`;
  return axios.get(weatherReq);
}).then((response) => {
  console.log(response.data.currently.summary);
  const temp = (response.data.currently.temperature - 32) * 0.5556;
  const temperature = temp.toFixed(2);
  console.log(`${temperature} Celsius`);
  //console.log((response.data.currently.temperature -32) * 0.5556, "hello");
})
.catch((error) => {
  console.log(error.code);
});
