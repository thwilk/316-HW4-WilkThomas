const { User, Playlist } = require('../../models/postgres/association');

const createPlaylist = async (userId, body) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    const songs = body.songs
    const name = body.name

    const playlist = await Playlist.create({
        name,
        songs: songs || [],
        userId: user.id
    });

    return playlist;
};

const deletePlaylist = async (playlistId, userId) => {
    const playlist = await Playlist.findByPk(userId);
    if (!playlist) throw new Error('Playlist not found');

    if (playlist.userId !== playlistId) throw new Error('Forbidden');

    await playlist.destroy();
    return true;
};

const getPlaylistById = async (playlistId, userId) => {
    const playlist = await Playlist.findByPk(userId);
    if (!playlist) throw new Error('Playlist not found');

    if (playlist.userId !== playlistId) throw new Error('Forbidden');

    return playlist;
};

const getPlaylistPairs = async (userId) => {
    const user = await User.findByPk(userId, { include: Playlist });
    if (!user) throw new Error('User not found');

    return user.Playlists.map(pl => ({ _id: pl.id, name: pl.name }));
};

const getPlaylists = async () => {
    const playlists = await Playlist.findAll();
    return playlists;
};

const updatePlaylist = async (playlistId, userId, body) => {
    const playlist = await Playlist.findByPk(userId);
    if (!playlist) throw new Error('Playlist not found');

    if (playlist.userId !== playlistId) throw new Error('Forbidden');

    playlist.name = body.name;
    playlist.songs = body.songs || [];
    await playlist.save();

    return playlist;
};

module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist
};
