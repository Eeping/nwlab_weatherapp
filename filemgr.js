const {MongoClient} = require('mongodb'); //referencing {},
const fs = MongoClient; //assign to fs

const database = 'mongodb://localhost:27017';

const saveData = (newdata) => {
  //define function
  //create promise
  return new Promise((resolve, reject) => {
    //connect to mongo server
    MongoClient.connect(database, {useNewUrlParser: true}, (err, client) => {
      if (err) {
        reject ('unable to connect to MongoDB'); //promise - reject, anytime error, reject
      }

      console.log('connected to MongoDB');
      //function to create database
      const db = client.db('WeatherApp');

    //insert one document
      db.collection('weatherCollection').insertOne(newdata, (err, result) => {
        if (err){
          reject ('unable to insert');
        }
        resolve (result); //promise only return one value, promises -> reject, resolve
      });

      client.close();
    });
  });
};

//display data
const getAllData = () => {
  return new Promise((resolve, reject) => {
    //connect to mongo server
    MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true}, (err, client) => {
      if (err) {
        reject('unable to connect to MongoDB');
      }

      console.log('connected to MongoDB');
      //function to create database
      const db = client.db('WeatherApp');

    //then() - promise
    db.collection('weatherCollection').find().toArray().then( (docs) => {
      resolve(docs); //converty JSON to string - JSON.stringify(docs)
    }, (err) => {
        reject('Unable to fetch docs');
    });

      client.close();
    });
  });
};

//delete data
const deleteAll = () => {
  return new Promise((resolve, reject) => {
    //connect to mongo server
    MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true}, (err, client) => {
      if (err) {
        reject('unable to connect to MongoDB');
      }

      console.log('connected to MongoDB');
      //function to create database
      const db = client.db('WeatherApp');

    //then() - promise
    db.collection('weatherCollection').remove({}).then( (result) => {
      resolve(result); //convert JSON to string - JSON.stringify(docs)
    }, (err) => {
        reject('Unable to delete');
    });

      client.close();
    });
  });
};


//export function
module.exports = {
  saveData,
  getAllData,
  deleteAll,
}
