
const dotenv = require('dotenv')
dotenv.config();


let dbconnection;
let store;
let auth;
const dbType = process.env.CURRENT_DB;

if (dbType === 'mongo') {
    dbconnection = require('./mongo/index');
    store = require('./mongo/storedb');
    auth = require('./mongo/authdb');
} else if (dbType === 'postgres') {
    dbconnection = require('./postgres/index');
    store = require('./postgres/storedb');
    auth = require('./postgres/authdb');
} else {
    throw new Error(`Unsupported DB_TYPE: ${dbType}`);
}

module.exports = {
    dbconnection,
    auth,
    store

};