const pg = require('pg');

// const cs = 'postgres://postgres:user@localhost:myPassword/';

const client = new pg.Client({
  user: 'postgres',
  password: 'myPassword',
  host: 'localhost',
  database: 'qanda',
});

client.connect();

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
  client.query(`SELECT setval('answers_id_seq',
                (SELECT MAX(id) FROM answers)+1);
                INSERT INTO answers (question_id, body, date_written,
                  answerer_name, answerer_email, reported, helpful)
                values (${req.params.question_id}, '${req.body.body}',
                '${dateTime[0]}', '${req.body.name}', '${req.body.email}', 0, 0);
              `);

};
/*
  select * from questions where product_id=279;
*/
/*
 SELECT setval('questions_id_seq', (SELECT MAX(id) FROM questions)+1);
 insert into questions (product_id, body, date_written, asker_name, asker_email, reported, helpful) values (279, 'How many licks does it take to get to the center of a tootsie pop?', '2021-03-17', 'theGorrglyboose', 'mooMaster9000@hotmail.com', 0, 0);
*/
module.exports = {
  getAnswers,
  addQuestion,
  addAnswer,
};
