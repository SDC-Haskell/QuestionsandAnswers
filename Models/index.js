const { Sequelize } = require('sequelize'),
  pg = require ('pg');
const answers = require('./Answers');
const questions = require('./Questions');
const answerPics = require('./AnswersPhotos')

//Figure out how to do this part.
module.exports = new Sequelize('qanda', 'postgres', 'myPassword', {
  host: 'localhost',
  dialect: 'postgres',
  operatorAliases: false,
});

const models = {
  Answers: answers,
  Questions: questions,
  AnswersPhotos: answerPics,
};

console.log(models.Answers.associate(models));

Object.keys(models).forEach((modelName) => {
  console.log('actually looping');
  console.log('out here: ' + modelName);
  models[modelName].associate(models);
  // if (models[modelName].associate) {

  // }
});
models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
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

