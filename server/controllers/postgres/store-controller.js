// controllers/postgres/playlist-controller.js
const { User, Playlist } = require('../../models/postgres/association'); 
const auth = require('../../auth');

const createPlaylist = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ errorMessage: 'UNAUTHORIZED' });

    const { name, songs } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'You must provide a Playlist name' });

    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        const playlist = await Playlist.create({
            name,
            songs: songs || [],
            userId: user.id 
        });

        return res.status(201).json({ playlist });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ success: false, errorMessage: 'Playlist not created' });
    }
};

const deletePlaylist = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ errorMessage: 'UNAUTHORIZED' });

    try {
        const playlist = await Playlist.findByPk(req.params.id);
        if (!playlist) return res.status(404).json({ errorMessage: 'Playlist not found' });

        if (playlist.UserId !== userId) return res.status(403).json({ errorMessage: 'Forbidden: not your playlist' });

        await playlist.destroy();
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err });
    }
};

const getPlaylistById = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ errorMessage: 'UNAUTHORIZED' });

    try {
        const playlist = await Playlist.findByPk(req.params.id);
        if (!playlist) return res.status(404).json({ errorMessage: 'Playlist not found' });

        if (playlist.UserId !== userId) return res.status(403).json({ errorMessage: 'Forbidden: not your playlist' });

        return res.status(200).json({ playlist });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err });
    }
};

const getPlaylistPairs = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ errorMessage: 'UNAUTHORIZED' });

    try {
        const user = await User.findByPk(userId, { include: Playlist });
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        const pairs = user.Playlists.map(pl => ({ id: pl.id, name: pl.name }));
        return res.status(200).json({ success: true, idNamePairs: pairs });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err });
    }
};

const getPlaylists = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ errorMessage: 'UNAUTHORIZED' });

    try {
        const playlists = await Playlist.findAll();
        if (!playlists.length) return res.status(404).json({ success: false, error: 'Playlists not found' });

        return res.status(200).json({ success: true, data: playlists });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err });
    }
};

const updatePlaylist = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ errorMessage: 'UNAUTHORIZED' });

    try {
        const playlist = await Playlist.findByPk(req.params.id);
        if (!playlist) return res.status(404).json({ errorMessage: 'Playlist not found' });

        if (playlist.UserId !== userId) return res.status(403).json({ errorMessage: 'Forbidden: not your playlist' });

        const { playlist: playlistData } = req.body;
        if (!playlistData) return res.status(400).json({ success: false, error: 'You must provide a playlist object' });

        playlist.name = playlistData.name;
        playlist.songs = playlistData.songs || [];
        await playlist.save();

        return res.status(200).json({ success: true, id: playlist.id, message: 'Playlist updated' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err });
    }
};

module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist
};
