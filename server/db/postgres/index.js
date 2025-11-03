const { Sequelize } = require('sequelize');

const dotenv = require('dotenv')
dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRES_DB_CONNECT);


sequelize.authenticate()
    .then(() => console.log('psql connected'))
    .catch(err => console.error('psql error:', err));


module.exports = sequelize;