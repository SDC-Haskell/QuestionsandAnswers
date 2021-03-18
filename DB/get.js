const pg = require('pg');

// const cs = 'postgres://postgres:user@localhost:myPassword/';

const client = new pg.Client({
  user: 'postgres',
  password: 'myPassword',
  host: 'localhost',
  database: 'qanda',
});

client.connect();

const getAnswers = (questionID, callback) => {
  client.query(`select * from answers where question_id=${questionID};`, (err, data) => {
    if (err) {
      console.log(err);
      callback(err, null);
      return;
    }
    /*
      Now we have to structure our output object so that it is the same as the route.

      This is going to involve chaining a request to teh photos table


    */
    // data.rows contains all of our data.
    callback(null, data);
  });
};


module.exports = {
  getAnswers,
};