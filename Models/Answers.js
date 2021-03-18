const {Sequelize, DataTypes} = require('sequelize');
const db = require('./index');

// const questions = db.define('questions', {

// });

const Answers = db.define("answers" ,{
  // id: {
  //   type: DataTypes.INTEGER
  // },
  // question_id: {
  //   type: DataTypes.INTEGER,
  //   unique: true,
  // },
  body: DataTypes.STRING,
  date_written: {
    type: DataTypes.DATE
  },
  answerer_name: {
    type: DataTypes.STRING
  },
  answerer_email: {
    type: DataTypes.STRING
  },
  reported: {
    type: DataTypes.STRING
  },
  helpful: {
    type: DataTypes.STRING
  },
});
//postgresqltutorial for
Answers.associate = (models) => {
  Answers.hasMany(models.AnswersPhotos, {
    through: 'answersPhotos',
    foreignKey: 'answer_id',
  });
  Answers.belongsTo(models.Questions, {
    through: 'questions',
    onDelete: 'CASCADE',
    foreignKey: {
      allowNull: false
    }
  });
};

module.exports = Answers;


//module.exports = questions;