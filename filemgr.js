const {MongoClient} = require('mongodb'); //referencing {},

//connect to mongo server
// MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true}, (err, client) => {
//   if (err) {
//     return console.log('unable to connect to MongoDB');
//   }
//
//   console.log('connected to MongoDB');
//   //function to create database
//   const db = client.db('WeatherApp');
//
// //insert one document
//   db.collection('weatherCollection').insertOne({
//     address: 'Inti College',
//     summary: 'Cool and Windy',
//     temperature: '22 C',
//   }, (err, result) => {
//     if (err){
//       return console.log('unable to insert');
//     }
//     console.log(result);
//   });
//
//   client.close();
// });

//connect to mongo server
MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true}, (err, client) => {
  if (err) {
    return console.log('unable to connect to MongoDB');
  }

  console.log('connected to MongoDB');
  //function to create database
  const db = client.db('WeatherApp');

//then() - promise
db.collection('weatherCollection').find().toArray().then( (docs) => {
  console.log(JSON.stringify(docs)); //converty JSON to string
}, (err) => {
    console.log('Unable to fetch docs');
});

  client.close();
});
