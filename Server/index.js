const express = require('express');
const xpressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('../DB/index.js');
// const { Sequelize } = require('sequelize');

let authenticate = async function() {

  // db.query('CREATE DATABASE QandA', function(err) {
  //   var sequelize = new Sequelize(post)
  // })
  try {
    await db.authenticate();
    console.log('Connection was established successfully');
  } catch (error) {
    console.log('Failure to connect to database: ' + error);
  }
}
authenticate();

const PORT = process.env.PORT || 5000;

const app = express();


app.get('/', (req, res) => res.send('Hello there'));

// Testing our database



app.listen(PORT, console.log(`Listening on port ${PORT}`))