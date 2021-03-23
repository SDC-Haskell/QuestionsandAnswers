const pg = require('pg');

// const cs = 'postgres://postgres:user@localhost:myPassword/';

const client = new pg.Client({
  user: 'postgres',
  password: 'myPassword',
  host: 'localhost',
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
                  callback(null, dataObj);
                  // for (let product of dataObj.results) {
                  //   client.query()
                  // }
                });
};

const getAnswers = (params, callback) => {
  client.query(`select ans.id, ans.body, ans.date_written, ans.answerer_name, ans.helpful, (array_agg(myObj))
  FROM (SELECT ph.answer_id, json_object_agg(ph.id, ph.url) AS myObj FROM answerphotos ph left join answers ans on ans.id = ph.answer_id where ans.question_id=${params.question_id} GROUP BY ph.id) ph
  LEFT JOIN answers ans on ans.id = ph.answer_id where ans.question_id=${params.question_id}
  GROUP BY ans.id;`, (err, data) => {
                    if (err) {
                      console.log(err);
                      callback(err, null);
                      return;
                    }
                    callback(null, data);
                  });

/*
  old Query:
  `select ans.id, ans.body, ans.date_written,
              ans.answerer_name, ans.helpful, (array_agg(ph.url))
              FROM answerphotos ph LEFT JOIN answers ans
              on ans.id = ph.answer_id where ans.question_id=${params.question_id}
              GROUP BY ans.id, ph.id;`
*/

/*
  new Query:
  `select ans.id, ans.body, ans.date_written, ans.answerer_name, ans.helpful, (array_agg(myObj))
                FROM (SELECT ph.answer_id, json_object_agg(ph.id, ph.url) AS myObj FROM answerphotos ph left join answers ans on ans.id = ph.answer_id where ans.question_id=279 GROUP BY ph.id) ph
                LEFT JOIN answers ans on ans.id = ph.answer_id where ans.question_id=${params.question_id}
                GROUP BY ans.id;`
*/
};


/*
  select q.id, q.product_id, q.body, q.date_written, q.asker_name, q.helpful, q.reported, json_agg(json_build_object(thereAreBillionsofStars)) from (select ans.id, ans.question_id, ans.body, ans.date_written, ans.answerer_name, ans.helpful, (array_agg(myObj)) FROM (SELECT ph.answer_id, json_object_agg(ph.id, ph.url) AS myObj FROM answerphotos ph left join answers ans on ans.id = ph.answer_id where ans.question_id=287 GROUP BY ph.id) ph LEFT JOIN answers ans on ans.id = ph.answer_id where ans.question_id=287 GROUP BY ans.id) as thereAreBillionsofStars left join questions q on q.id = thereAreBillionsofStars.question_id where q.product_id=287 group by q.id;


  select q.id, q.product_id, q.body, q.date_written, q.asker_name, q.helpful, q.reported, json_build_object(v) from (select ans.id, ans.question_id, ans.body, ans.date_written, ans.answerer_name, ans.helpful, (array_agg(myObj)) AS v FROM (SELECT ph.answer_id, json_object_agg(ph.id, ph.url) AS myObj FROM answerphotos ph left join answers ans on ans.id = ph.answer_id where ans.question_id=287 GROUP BY ph.id) ph LEFT JOIN answers ans on ans.id = ph.answer_id where ans.question_id=287 GROUP BY ans.id) v left join questions q on q.id = v.question_id where q.product_id=287 group by q.id, v.question_id;


  select q.id, q.product_id, q.body, q.date_written, q.asker_name, q.helpful, q.reported, json_agg(q) from (select ans.id, ans.question_id, ans.body, ans.date_written, ans.answerer_name, ans.helpful, (array_agg(myObj)) as q FROM (SELECT ph.answer_id, json_object_agg(ph.id, ph.url) AS myObj FROM answerphotos ph left join answers ans on ans.id = ph.answer_id where ans.question_id=q.id GROUP BY ph.id) ph LEFT JOIN answers ans on ans.id = ph.answer_id where ans.question_id=q.id GROUP BY ans.id) as v left join questions q on q.id = v.question_id where q.product_id=287 group by q.id, v.question_id;

  select q.id, q.product_id, q.body, q.date_written, q.asker_name, q.helpful, q.reported, json_agg(q) from (select ans.id, ans.question_id, ans.body, ans.date_written, ans.answerer_name, ans.helpful, (array_agg(myObj)) as q FROM (SELECT ph.answer_id, json_object_agg(ph.id, ph.url) AS myObj FROM answerphotos ph left join answers ans on ans.id = ph.answer_id where ans.question_id=q.id GROUP BY ph.id) ph LEFT JOIN answers ans on ans.id = ph.answer_id where ans.question_id=q.id GROUP BY ans.id) as v left join questions q on q.id = v.question_id where q.product_id=278 group by q.id, v.question_id;

  select q.id, q.product_id, q.body, q.date_written, q.asker_name, q.helpful, q.reported, json_agg(q) from (select ans.id, ans.question_id, ans.body, ans.date_written, ans.answerer_name, ans.helpful, (array_agg(myObj)) as q FROM (SELECT ph.answer_id, json_object_agg(ph.id, ph.url) AS myObj FROM answerphotos ph left join answers ans on ans.id = ph.answer_id where ans.question_id=q.id GROUP BY ph.id) ph LEFT JOIN answers ans on ans.id = ph.answer_id where ans.question_id=q.id GROUP BY ans.id) as v left join questions q on q.id = v.question_id where q.product_id=278 group by q.id, v.question_id;
*/
/*
 currently we have
 1. body
 2. name
 3. product_id
 4. email
*/
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
  // console.log(req.body);
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
                  for (const url in req.body.photos) {
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
/*
  select * from questions where product_id=279;
*/
/*
 SELECT setval('questions_id_seq', (SELECT MAX(id) FROM questions)+1);
 insert into questions (product_id, body, date_written, asker_name, asker_email, reported, helpful) values (279, 'How many licks does it take to get to the center of a tootsie pop?', '2021-03-17', 'theGorrglyboose', 'mooMaster9000@hotmail.com', 0, 0);


 UPDATE questions set helpful=helpful+1 where id=279;
*/
module.exports = {
  getQuestions,
  getAnswers,
  addQuestion,
  addAnswer,
  markQuestionHelpful,
  reportQuestion,
  reportAnswer,
  markAnswerHelpful
};
