// server/controllers/postgres/store-controller.js
const { formatPlaylist } = require('../responseFormat');
const auth = require('../../auth');
const storedb = require('../../db/postgres/storedb');

const createPlaylist = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ success: false, errorMessage: 'UNAUTHORIZED' });

    const { name, songs } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'You must provide a Playlist name' });

    try {
        const playlist = await storedb.createPlaylist(userId, { name, songs });
        return res.status(201).json({ playlist: formatPlaylist(playlist) });
    } catch (err) {
        console.error(err);
        const message = err.message === 'Forbidden' ? 'Forbidden' : 'Playlist not created';
        return res.status(400).json({ success: false, errorMessage: message });
    }
};

const deletePlaylist = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ success: false, errorMessage: 'UNAUTHORIZED' });

    const playlistId = parseInt(req.params.id, 10);
    if (!playlistId) return res.status(400).json({ success: false, error: 'Playlist ID required' });

    try {
        await storedb.deletePlaylist(userId, playlistId);
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        const status = err.message === 'Forbidden' ? 403 : 404;
        return res.status(status).json({ success: false, errorMessage: err.message });
    }
};

const getPlaylistById = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ success: false, errorMessage: 'UNAUTHORIZED' });

    const playlistId = parseInt(req.params.id, 10);
    if (!playlistId) return res.status(400).json({ success: false, error: 'Playlist ID required' });

    try {
        const playlist = await storedb.getPlaylistById(userId, playlistId);
        return res.status(200).json({ success: true, playlist: formatPlaylist(playlist) });
    } catch (err) {
        console.error(err);
        const status = err.message === 'Forbidden' ? 403 : 404;
        return res.status(status).json({ success: false, errorMessage: err.message });
    }
};

const getPlaylistPairs = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ success: false, errorMessage: 'UNAUTHORIZED' });

    try {
        const pairs = await storedb.getPlaylistPairs(userId);
        return res.status(200).json({ success: true, idNamePairs: pairs });
    } catch (err) {
        console.error(err);
        return res.status(404).json({ success: false, errorMessage: err.message });
    }
};

const getPlaylists = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ success: false, errorMessage: 'UNAUTHORIZED' });

    try {
        const playlists = await storedb.getPlaylists();
        const data = playlists.map(pl => formatPlaylist(pl));
        return res.status(200).json({ success: true, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err });
    }
};

const updatePlaylist = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ success: false, errorMessage: 'UNAUTHORIZED' });

    const playlistId = parseInt(req.params.id, 10);
    const { playlist: playlistData } = req.body;

    if (!playlistId || !playlistData) return res.status(400).json({ success: false, error: 'Playlist ID and playlist data required' });

    try {
        const playlist = await storedb.updatePlaylist(userId, playlistId, playlistData);
        return res.status(200).json({
            success: true,
            id: playlist.id,
            playlist: formatPlaylist(playlist),
            message: 'Playlist updated'
        });
    } catch (err) {
        console.error(err);
        const status = err.message === 'Forbidden' ? 403 : 404;
        return res.status(status).json({ success: false, error: err.message });
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
