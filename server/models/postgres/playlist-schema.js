const { Sequelize, DataTypes } = require('sequelize');
const conn = require('../../db/postgres/index.js');

const Playlist = conn.define('Playlist', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },    
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    songs: { 
        type: DataTypes.JSONB, 
        defaultValue: [] 
    },
    userId: {               
        type: DataTypes.INTEGER,
        references: {
            model: 'Users', 
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    }
});

module.exports = Playlist;
