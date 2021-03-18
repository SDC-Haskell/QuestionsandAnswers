const express = require('express');
const xpressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
//const models = require('../Models');
// const { Sequelize } = require('sequelize');

// let authenticate = async function() {

//   // db.query('CREATE DATABASE QandA', function(err) {
//   //   var sequelize = new Sequelize(post)
//   // })
//   try {
//     await models.sequelize.authenticate();
//     console.log('Connection was established successfully');
//   } catch (error) {
//     console.log('Failure to connect to database: ' + error);
//   }
// }
// authenticate();

const PORT = process.env.PORT || 5000;

const app = express();


app.get('/', (req, res) => res.send('Hello there'));

app.get('/qa/questions', ((req,res) => {
  /*
    Gets a specific product ID from the database and returns
    the questions object containing all of the answers for each question (and photos)

    The number of questions (and pages of questions) returned are specified by the page and count query params

    This is going to require multiple layers of queries

    current productid = 17072
  */
  console.log(req.query);

  res.send(req.query.product_id);

}));

app.get('/qa/questions/:question_id/answers', ((req,res) => {
  console.log(req.params);
  res.send(req.params);
}));

// Testing our database
// sudo kill -9 `sudo lsof -t -i:5000`

//models.sequelize.sync().then(() => {
app.listen(PORT, console.log(`Listening on port ${PORT}`));
//});
