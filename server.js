const express = require('express');
const server = express();
const hbs = require('hbs');
const axios = require('axios'); //web client, connect API with another server
const bodyParser = require('body-parser');
const filemgr = require('./filemgr'); //put./ because it is in current directory

const port = process.env.PORT || 3000; //see environment variable call port, allow flexi port based on environment

server.use(bodyParser.urlencoded({extended:true}));

server.set('view engine','hbs'); //set server to use hbs as views engine
hbs.registerPartials(__dirname + '/views/partials'); //directory code shared by all pages

var weatherdata;

//item is array of JSON object
hbs.registerHelper('list', (items, options) => {
  items = weatherdata;
  var out = "<tr><th>Address</th><th>Summary</th><th>Temperature</th></tr>";

  const length = items.length;
  for(var i = 0; i<length; i++) {
    out = out + options.fn(items[i]); //append string to existing string
  }
  return out;
});

server.get(`/`,(req,res) => {
  res.render('main.hbs');
});

//route to main
server.get(`/main`,(req,res) => {
  res.render('main.hbs');
});

server.get(`/result`,(req,res) => {
  res.render('result.hbs');
});

server.get(`/historical`, (req,res) => {
  filemgr.getAllData().then((result) => {
    weatherdata = result;
    res.render('historical.hbs');
  }).catch((errorMessage) => {
    console.log(errorMessage);
  });
});

server.post(`/delete`, (req,res) => {
  filemgr.deleteAll().then((result) => {
    weatherdata = result;
    res.render('historical.hbs');
  }).catch((errorMessage) => {
    console.log(errorMessage);
  });
});

server.post(`/form`, (req,res) => {
  res.render('form.hbs');
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

    console.log(response.data.currently.summary);
    const temp = (response.data.currently.temperature - 32) * 0.5556;
    const temperature = temp.toFixed(2);
    //console.log(`${temperature} Celsius`);
    const tempStr = `${temperature} Celsius`;
    //console.log((response.data.currently.temperature -32) * 0.5556, "hello");

    const weatherresult = {
     address: addr,
     summary: response.data.currently.summary,
     temperature: tempStr,
   };
//structure for promise, then() catch()
//callback function is function that you want to run
filemgr.saveData(weatherresult).then((result) => {
  res.render('result.hbs', weatherresult);

}).catch((errorMessage) => {
  console.log(errorMessage);
});

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



server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
}); //specified port 3000
