'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false, // disallow null
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false, // disallow null
    },
    emailAddress: {
      type: Sequelize.STRING,
      allowNull: false // disallow null
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false // disallow null
    },

  }, { sequelize });

  User.associate = (models) => {
    User.hasMany(models.Course, {
      as: 'Owner', // alias
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };

  return User;
};
