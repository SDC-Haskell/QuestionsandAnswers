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
                FROM (SELECT ph.answer_id, json_object_agg(ph.id, ph.url) AS myObj FROM answerphotos ph left join answers ans on ans.id = ph.answer_id where ans.question_id=279 GROUP BY ph.id) ph
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
`select ans.id, ans.body, ans.date_written,
ans.answerer_name, ans.helpful, (array_agg(ph.url))
FROM answerphotos ph LEFT JOIN answers ans
on ans.id = ph.answer_id where ans.question_id=${params.question_id}
GROUP BY ans.id, ph.id;`
/*

*/

/*
  new Query:
  `select ans.id, ans.body, ans.date_written, ans.answerer_name, ans.helpful, (array_agg(myObj))
                FROM (SELECT ph.answer_id, json_object_agg(ph.id, ph.url) AS myObj FROM answerphotos ph left join answers ans on ans.id = ph.answer_id GROUP BY ph.id) ph
                LEFT JOIN answers ans on ans.id = ph.answer_id where ans.question_id=279
                GROUP BY ans.id;`
  */

 /*
    `select ans.id, ans.body, ans.date_written, ans.answerer_name, ans.helpful, (array_agg(myObj))
                FROM (SELECT ph.answer_id, json_object_agg(ph.id, ph.url) AS myObj FROM answerphotos ph left join answers ans on ans.id = ph.answer_id where ans.question_id=279 GROUP BY ph.id) ph
                LEFT JOIN answers ans on ans.id = ph.answer_id where ans.question_id=279
                GROUP BY ans.id;`
 */
 /*
   select ans.id, ans.body, ans.date_written, ans.answerer_name, ans.helpful, (array_agg(myObj))
    FROM (SELECT ph.answer_id, json_object_agg(ph.id, ph.url) AS myObj FROM answerphotos ph GROUP BY ph.id) ph
                LEFT JOIN answers ans on ans.id = ph.answer_id where ans.question_id=279
                GROUP BY ans.id;
 */
};




module.exports = {
  getAnswers,
};
