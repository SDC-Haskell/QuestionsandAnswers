const Sequelize = require('sequelize');
const db = require ('./index.js');

// const questions = db.define('answersPhotos', {
//   // id: {
//   //   type: Sequelize.INTEGER
//   // },
//   // answer_id: {
//   //   type: Sequelize.INTEGER
//   // },
//   url: {
//     type: Sequelize.STRING
//   },
// });

module.exports = (sequelize, DataTypes) => {
  const AnswersPhotos = db.define('answersPhotos' ,{
    // id: {
    //   type: DataTypes.INTEGER
    // },
    // answer_id: {
    //   type: DataTypes.INTEGER,
    //   unique: true,
    // },
    url: DataTypes.STRING,
  });

  //A.hasOne(B);

  AnswersPhotos.associate = (models) => {
    AnswersPhotos.belongsTo(models.Answers, {
      through: 'answers',
      foreignKey: 'answer_id',
    });
  };
  return AnswersPhotos;
};


// module.exports = questions;