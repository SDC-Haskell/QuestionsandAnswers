const express = require('express');
const xpressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const db = require('../DB/get.js');
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

app.use(express.json());

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

/*
  QuestionID's for testing:
  60042 - 60048
*/
app.get('/qa/questions/:question_id/answers', ((req,res) => {
  /*
    Currently we haven't handled the query params for this route

    You have the option for page and count the same way you do above
  */
  db.getAnswers(req.params, (err, data) => {
    if(err) {
      // refactor this to send a 404 later.
      res.send(err);
      return;
    }
    res.send(data);
  });
  console.log(req.params.question_id);
  // res.send(req.params);
}));

app.post('/qa/questions', ((req, res) => {
  //console.log(req);
  res.send(req.body);
}));

// sudo kill -9 `sudo lsof -t -i:5000`

//models.sequelize.sync().then(() => {
app.listen(PORT, console.log(`Listening on port ${PORT}`));
//});
