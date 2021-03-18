const {Sequelize, DataTypes} = require('sequelize');
const db = require ('./index.js');


module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define('questions', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   unique: true,
    // },
    product_id: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    body: DataTypes.STRING,
    date_written: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    asker_name: DataTypes.STRING,
    asker_email: DataTypes.STRING,
    reported: {
      type: DataTypes.STRING
    },
    helpful: {
      type: DataTypes.STRING
    },
  });

  Questions.associate = (models) => {
    Questions.hasMany(models.Answers, {
      through: 'answers',
      foreignKey: 'question_id',
    });
  };
  return Questions;
};
// module.exports = questions;