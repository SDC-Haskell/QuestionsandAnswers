const pg = require('pg');

// postgres:user@localhost:myPassword/';

const client = new pg.Client({
  user: 'ubuntu',
  password: 'myPassword',
  host: '54.153.9.229',
  database: 'qanda',
});

client.connect();

const getQuestions = (product_id, callback) => {
  console.log(product_id);
  client.query(`select * from questions where product_id=${product_id};`, (err, data) => {
                  if (err) {
                    callback(err, null);
                    return;
                  }
                  let dataObj = {
                    [product_id]: product_id,
                    results: data.rows,
                  }
                  //callback(null, dataObj);
                  for (let product of dataObj.results) {
                    console.log('question id: ' + product);
                    client.query(`select ans.id, ans.body, ans.date_written, ans.answerer_name, ans.helpful, (array_agg(myObj))
                    FROM (SELECT ph.answer_id, json_object_agg(ph.id, ph.url) AS myObj FROM answerphotos ph left join answers ans on ans.id = ph.answer_id where ans.question_id=${product.id} GROUP BY ph.id) ph
                    LEFT JOIN answers ans on ans.id = ph.answer_id where ans.question_id=${product.id}
                    GROUP BY ans.id;`, (err, data) => {
                      if (err) {
                        callback(err, null);
                        return;
                      }
                      console.log('made it: ' + data);
                      // product.answers = data.rows[0];
                      product.answers = {};
                      for (let answer of data.rows) {
                        console.log('l');
                        product.answers[answer.id] = {
                            id: answer.id,
                            body: answer.body,
                            date: answer.date_written,
                            answrer_name: answer.answerer_name,
                            helpfullness: answer.helpful,
                            photos: answer.array_agg,
                        };
                      }
                      if (dataObj.results.indexOf(product) === dataObj.results.length - 1) {
                        callback(null, dataObj);
                      }
                    });
                  }
                });
};

const getAnswers = (params, callback) => {
  console.log('hello from query');
  client.query(`select ans.id, ans.body, ans.date_written, ans.answerer_name, ans.helpful, (array_agg(myObj))
  FROM (SELECT ph.answer_id, json_object_agg(ph.id, ph.url) AS myObj
  FROM answerphotos ph left join answers ans on ans.id = ph.answer_id where ans.question_id=${params.question_id} GROUP BY ph.id) ph
  LEFT JOIN answers ans on ans.id = ph.answer_id where ans.question_id=${params.question_id}
  GROUP BY ans.id;`, (err, data) => {
                    if (err) {
                      console.log(err);
                      callback(err, null);
                      return;
                    }
                    // console.log(data.rows);
                    let returnObj = {
                      question: params.question_id,
                      page: params.page,
                      count: params.count,
                      results: data.rows,
                    };
                    console.log('return Obj: ' + returnObj.results);
                    for (let i = 0; i < returnObj.results.length; i++) {
                      console.log('looping');
                      returnObj.results[i] = {
                        answer_id: returnObj.results[i].id,
                        body: returnObj.results[i].body,
                        date: returnObj.results[i].date,
                        answerer_name: returnObj.results[i].answerer_name,
                        helpfulness: returnObj.results[i].helpful,
                        photos: returnObj.results[i].array_agg,
                      };
                    };
                    callback(null, returnObj);
                  });
};
const addQuestion = (body, callback) => {
  let date = new Date(Date.now());
  date = date.toISOString();
  dateTime = date.split('T');
  client.query(`SELECT setval('questions_id_seq', (SELECT MAX(id) FROM questions)+1);
                insert into questions
                (product_id, body, date_written,
                  asker_name, asker_email, reported, helpful)
                values (${body.product_id}, '${body.body}',
                '${dateTime[0]}', '${body.name}', '${body.email}', 0, 0);`,
                (err, data) => {
                  if(err) {
                    console.log(err);
                    callback(err, null);
                    return;
                  }
                  callback(null, 'Successful Post');
                });
};

const addAnswer = (req, callback) => {
  let date = new Date(Date.now());
  date = date.toISOString();
  dateTime = date.split('T');
  console.log(req.body);
  client.query(`SELECT setval('answers_id_seq',
                (SELECT MAX(id) FROM answers)+1);
                INSERT INTO answers (question_id, body, date_written,
                  answerer_name, answerer_email, reported, helpful)
                values (${req.params.question_id}, '${req.body.body}',
                '${dateTime[0]}', '${req.body.name}', '${req.body.email}', 0, 0);`, (err, data) => {
                  if (err) {
                    console.log(err + 'firsterr');
                    callback(err, null);
                    return;
                  }
                  let answerID = data[0].rows[0].setval - 1;
                  console.log(answerID);
                  if (req.body.photos === undefined) {
                    callback(null, 'successful no photos post');
                    return;
                  }
                  for (const url of req.body.photos) {
                    client.query(`SELECT setval
                                  ('answerphotos_id_seq',
                                  (SELECT MAX(id) FROM answerphotos)+1);
                                  insert into answerphotos (answer_id, url)
                                  values (${answerID}, ${url})`,
                                  (err, data) => {
                                    if(err) {
                                      console.log(err);
                                      callback(err, null);
                                      return;
                                    }
                                  });
                                  callback(null, 'postedPhotos');
                  }
                });

};

const markQuestionHelpful = (questionID, callback) => {
  console.log(questionID);
  client.query(`UPDATE questions
                set helpful = helpful + 1
                where id=${questionID};`,
                (err, data) => {
                  if (err) {
                    callback(err, null);
                    return;
                }
                callback(null, data);
                });
};

const reportQuestion = (questionID, callback) => {
  console.log(questionID);
  client.query(`UPDATE questions
                set reported = reported + 1
                where id=${questionID};`,
                (err, data) => {
                  if (err) {
                    callback(err, null);
                    return;
                }
                callback(null, data);
                });
};

const markAnswerHelpful = (questionID, callback) => {
  console.log(questionID);
  client.query(`UPDATE answers
                set helpful = helpful + 1
                where id=${questionID};`,
                (err, data) => {
                  if (err) {
                    callback(err, null);
                    return;
                }
                callback(null, data);
                });
};

const reportAnswer = (questionID, callback) => {
  console.log(questionID);
  client.query(`UPDATE answers
                set reported = reported + 1
                where id=${questionID};`,
                (err, data) => {
                  if (err) {
                    callback(err, null);
                    return;
                }
                callback(null, data);
                });
};

module.exports = {
  getQuestions,
  getAnswers,
  addQuestion,
  addAnswer,
  markQuestionHelpful,
  reportQuestion,
  reportAnswer,
  markAnswerHelpful,
};
