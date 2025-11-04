const { User, Playlist } = require('../../models/postgres/association');

const createPlaylistForUser = async (userId, { name, songs }) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    const playlist = await Playlist.create({
        name,
        songs: songs || [],
        userId: user.id
    });

    return playlist;
};

const deletePlaylistById = async (userId, playlistId) => {
    const playlist = await Playlist.findByPk(playlistId);
    if (!playlist) throw new Error('Playlist not found');

    if (playlist.userId !== userId) throw new Error('Forbidden');

    await playlist.destroy();
    return true;
};

const getPlaylistByIdForUser = async (userId, playlistId) => {
    const playlist = await Playlist.findByPk(playlistId);
    if (!playlist) throw new Error('Playlist not found');

    if (playlist.userId !== userId) throw new Error('Forbidden');

    return playlist;
};

const getPlaylistPairsForUser = async (userId) => {
    const user = await User.findByPk(userId, { include: Playlist });
    if (!user) throw new Error('User not found');

    return user.Playlists.map(pl => ({ _id: pl.id, name: pl.name }));
};

const getAllPlaylists = async () => {
    const playlists = await Playlist.findAll();
    return playlists;
};

const updatePlaylistById = async (userId, playlistId, playlistData) => {
    const playlist = await Playlist.findByPk(playlistId);
    if (!playlist) throw new Error('Playlist not found');

    if (playlist.userId !== userId) throw new Error('Forbidden');

    playlist.name = playlistData.name;
    playlist.songs = playlistData.songs || [];
    await playlist.save();

    return playlist;
};

module.exports = {
    createPlaylistForUser,
    deletePlaylistById,
    getPlaylistByIdForUser,
    getPlaylistPairsForUser,
    getAllPlaylists,
    updatePlaylistById
};
