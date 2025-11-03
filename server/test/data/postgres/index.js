const dotenv = require('dotenv').config({ path: __dirname + '/../../../.env' });
const sequelize = require('../../../db/postgres/index');
const { User, Playlist } = require('../../../models/postgres/association');
const testData = require('../example-db-data-psql.json');

async function clearTable(model, tableName) {
    try {
        await model.destroy({ where: {}, truncate: true, cascade: true });
        console.log(tableName + " cleared");
    } catch (err) {
        console.log(err);
    }
}

async function fillTable(model, tableName, data) {
    try {
        await model.bulkCreate(data);
        console.log(tableName + " filled");
    } catch (err) {
        console.log(err);
    }
}

async function resetPostgres() {
    console.log("Resetting the Postgres DB");


    await clearTable(Playlist, "Playlist");
    await clearTable(User, "User");


    await fillTable(User, "User", testData.users);

    await fillTable(Playlist, "Playlist", testData.playlists);

    console.log("Database reset complete");
}


sequelize.sync({ force: true }) 
    .then(() => resetPostgres())
    .catch(e => console.error('Sequelize sync error', e));
