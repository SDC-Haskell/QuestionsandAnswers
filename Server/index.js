const express = require('express');
const xpressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const db = require('../DB/get.js');
const path = require('path');
// const loader = require('../loaderio-89a175b4131c64a107c303c2c8e5b969.txt')


const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.get('/', (req, res) => res.send('Hello there'));

app.get('/qa/questions', ((req,res) => {

  db.getQuestions(req.query.product_id, (err, data) => {
    if (err) {
      // console.log(err);
      res.send(err);
      return;
    }
    res.send(data);
  });
}));

app.get('/loaderio-89a175b4131c64a107c303c2c8e5b969', (req, res) => {
  res.send('loaderio-89a175b4131c64a107c303c2c8e5b969');
  });
/*
  QuestionID's for testing:
  60042 - 60048
*/
app.get('/qa/questions/:question_id/answers', ((req,res) => {
  /*
    Currently we haven't handled the query params for this route

    You have the option for page and count the same way you do above
  */
  // console.log('Yolo');
  db.getAnswers(req.params, (err, data) => {
    if(err) {
      // refactor this to send a 404 later.
      res.send(err);
      return;
    }
    res.send(data);
  });
  // console.log(req.params.question_id);
}));

app.post('/qa/questions', ((req, res) => {
  db.addQuestion(req.body, (err, data) => {
    if(err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.send(data);
  });
}));
app.post('/qa/questions/:question_id/answers', ((req, res) => {
  db.addAnswer(req, (err, data) => {
    if (err) {
      res.send(err);
      return;
    }
    res.send(data);
  });
  /*
    body.body(text)
    body.name
    body.email
    body.photos
    req.params.blah

    (we're just going to send teh entire request to our function)
  */
}));


app.put('/qa/questions/:question_id/helpful', ((req, res) => {
  db.markQuestionHelpful(req.params.question_id, (err, data) => {
    if (err) {
      res.send(err);
      return;
    }
    res.send(data);
  });
}));

app.put('/qa/questions/:question_id/report', ((req, res) => {
  db.reportQuestion(req.params.question_id, (err, data) => {
    if (err) {
      res.send(err);
      return;
    }
    res.send(data);
  });
}));

app.put('/qa/answers/:answer_id/helpful', ((req, res) => {
  db.markAnswerHelpful(req.params.question_id, (err, data) => {
    if (err) {
      res.send(err);
      return;
    }
    res.send(data);
  });
}));

app.put('/qa/answers/:answer_id/report', ((req, res) => {
  db.reportAnswer(req.params.question_id, (err, data) => {
    if (err) {
      res.send(err);
      return;
    }
    res.send(data);
  });
}));
// sudo kill -9 `sudo lsof -t -i:5000`

//models.sequelize.sync().then(() => {
app.listen(PORT, console.log(`Listening on port ${PORT}`));
//});
