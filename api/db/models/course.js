'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Sequelize.Model {}
  Course.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false, // disallow null
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false, // disallow null
    },
    estimatedTime: {
      type: Sequelize.STRING,
      allowNull: true // disallow null
    },
    materialsNeeded: {
      type: Sequelize.STRING,
      allowNull: true // disallow null
    },

  }, { sequelize });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: 'Owner', // alias
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };

  return Course;
};
