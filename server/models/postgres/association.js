const User = require('./user-schema');
const Playlist = require('./playlist-schema');

User.hasMany(Playlist, { foreignKey: 'userId' });
Playlist.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Playlist };
