const express = require('express');
const server = express();
const hbs = require('hbs');
const axios = require('axios'); //web client, connect API with another server
const bodyParser = require('body-parser');

server.use(bodyParser.urlencoded({extended:true}));

server.set('view engine','hbs'); //set server to use hbs as views engine
hbs.registerPartials(__dirname + '/views/partials'); //directory code shared by all pages

server.get(`/`,(req,res) => {
  res.render('main.hbs');
});

server.post(`/getweather`, (req, res) => {
  const addr = req.body.address;

  const locationReq = `https://maps.googleapis.com/maps/api/geocode/json?address=${addr}&key=AIzaSyBo54sDKP0LPhJBhmX7FsUPBRZYsC4YczI`;

  axios.get(locationReq).then((response) => {
    console.log(response.data.results[0].formatted_address);
    const lat = response.data.results[0].geometry.location.lat;
    const lng = response.data.results[0].geometry.location.lng;
    const weatherReq = `https://api.darksky.net/forecast/0cb776b7d2a10fb22584264f299b4661/${lat},${lng}`;
    return axios.get(weatherReq);
  }).then((response) => {
    res.send(
      {
        address: addr,
        summary: response.data.currently.summary,
        temperature: (response.data.currently.temperature - 32) * 0.5556,
      }
    );

    console.log(response.data.currently.summary);
    const temp = (response.data.currently.temperature - 32) * 0.5556;
    const temperature = temp.toFixed(2);
    console.log(`${temperature} Celsius`);
    //console.log((response.data.currently.temperature -32) * 0.5556, "hello");
  })
  .catch((error) => {
    console.log(error.code);
  });
});

server.get(`/form`, (req, res) => {
  res.render('form.hbs');
    //currentdate: new Date().toDateString(),
    //currentdate: new Date().toTimeString(),
});



server.listen(3000, () => {
  console.log("Server listening on port 3000");
}); //specified port 3000
