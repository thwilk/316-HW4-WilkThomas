const { DataTypes } = require('sequelize');

const conn = require('../../db/postgres/index.js');

const User = conn.define(
    'User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          lastName: {
            type: DataTypes.STRING,
            allowNull: false, 
          },
          email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
              isEmail: true, 
            },
          },
        passwordHash: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        }   
    }
);


module.exports = User;