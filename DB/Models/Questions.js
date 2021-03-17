const Sequelize = require('sequelize');
const db = require ('../index.js');

const questions = db.define('questions', {
  title: {
    type: Sequelize.STRING
  },
  title: {
    type: Sequelize.STRING
  },
  title: {
    type: Sequelize.STRING
  },
  title: {
    type: Sequelize.STRING
  },
  title: {
    type: Sequelize.STRING
  },
})

module.exports = questions