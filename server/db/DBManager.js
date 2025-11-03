
const dotenv = require('dotenv')
dotenv.config();


let db;
const dbType = process.env.CURRENT_DB;

if (dbType === 'mongo') {
    db = require('./mongo/index');
} else if (dbType === 'postgres') {
    db = require('./postgres/index');
} else {
    throw new Error(`Unsupported DB_TYPE: ${dbType}`);
}

module.exports = db;