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
  client.query(`select ans.id, ans.body, ans.date_written, ans.answerer_name, ans.helpful, (array_agg(ph.url)) FROM answerphotos ph LEFT JOIN answers ans on ans.id = ph.answer_id where ans.question_id=${params.question_id} GROUP BY ans.id, ph.id;`, (err, data) => {
                    if (err) {
                      console.log(err);
                      callback(err, null);
                      return
                    }
                    callback(null, data);
                  });

  // select ph.id, ph.url, array_agg(ph.url) FROM answerphotos ph INNER JOIN answers ans on ans.id = ph.answer_id where ans.question_id=${params.questionID} GROUP BY ph.id, ph.url;
  // client.query(`select * from answers where question_id=${params.questionID};`, (err, data) => {
  //   if (err) {
  //     console.log(err);
  //     callback(err, null);
  //     return;
  //   }
  //   /*
  //     Now we have to structure our output object so that it is the same as the route.

  //     This is going to involve chaining a request to teh photos table

  //   */

  //   // let formattedData = {
  //   //   question: params.questionID,
  //   //   page: params.page,
  //   //   count: params.count,

  //   // };
  //   // data.rows contains all of our data.
  //   callback(null, data);
  // });
};


module.exports = {
  getAnswers,
};

'select ,'