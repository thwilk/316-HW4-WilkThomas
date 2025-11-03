const dotenv = require('dotenv')

dotenv.config()

const db = process.env.CURRENT_DB;
let controllers;

if(db == "mongo"){
    controllers = {
        auth: require('./mongo/auth-controller'),
        store: require('./mongo/store-controller')
    }
}
else if(db == "postgres") {
    controllers = {
        auth: require('./postgres/auth-controller'),
        store: require('./postgres/store-controller')
    }
} 
else {
    throw new Error(`Unsupported CURRENT_DB: ${db}`);
}

module.exports = controllers;
