const { Sequelize } = require('sequelize'),
pg = require ('pg');

//Figure out how to do this part.
module.exports = new Sequelize('qanda', 'postgres', 'myPassword', {
  host: 'localhost',
  dialect: 'postgres',
  operatorAliases: false
});

// host: 'localhost',
//   dialect: 'postgres',
//   operatorAliases: false

//   // pool: {
//   //   max: 5,
//   //   min: 0,
//   //   acquire: 30000,
//   //   idle: 10000
//   // }
// }

