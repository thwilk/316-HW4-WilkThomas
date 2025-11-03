const { User, Playlist } = require('../../models/postgres/association'); 
const { formatPlaylist, response } = require('../responseFormat');
const auth = require('../../auth');

const createPlaylist = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ success: false, errorMessage: 'UNAUTHORIZED' });

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

        return res.status(201).json({ playlist: formatPlaylist(playlist) });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ success: false, errorMessage: 'Playlist not created' });
    }
};

const deletePlaylist = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ success: false, errorMessage: 'UNAUTHORIZED' });

    const playlistId = parseInt(req.params.id, 10);
    if (!playlistId) return res.status(400).json({ success: false, error: 'Playlist ID is required and must be an integer' });

    try {
        const playlist = await Playlist.findByPk(playlistId);
        if (!playlist) return res.status(404).json({ success: false, errorMessage: 'Playlist not found' });

        if (playlist.userId !== userId) return res.status(403).json({ success: false, errorMessage: 'Forbidden: not your playlist' });

        await playlist.destroy();
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err });
    }
};

const getPlaylistById = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ success: false, errorMessage: 'UNAUTHORIZED' });

    const playlistId = parseInt(req.params.id, 10);

    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    console.log("\n\n"+req.params.id+"\n\n");
    if (!playlistId) return res.status(400).json({ success: false, error: 'Playlist ID is required and must be an integer' });

    try {
        const playlist = await Playlist.findByPk(playlistId);
        if (!playlist) return res.status(404).json({ success: false, errorMessage: 'Playlist not found' });

        if (playlist.userId !== userId) return res.status(403).json({ success: false, errorMessage: 'Forbidden: not your playlist' });
        console.log("wer got it ");
        return res.status(200).json({ success: true, playlist: formatPlaylist(playlist)});
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err });
    }
};

const getPlaylistPairs = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ success: false, errorMessage: 'UNAUTHORIZED' });

    try {
        const user = await User.findByPk(userId, { include: Playlist });
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        // Convert to id-name pairs like Mongo version
        const pairs = user.Playlists.map(pl => ({ _id: pl.id, name: pl.name }));
        return res.status(200).json({ success: true, idNamePairs: pairs });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err });
    }
};

const getPlaylists = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ success: false, errorMessage: 'UNAUTHORIZED' });

    try {
        const playlists = await Playlist.findAll();
        if (!playlists.length) return res.status(404).json({ success: false, error: 'Playlists not found' });

        const cor = playlists.map(playlist => formatPlaylist(playlist));
        return res.status(200).json({ success: true, data: cor });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err });
    }
};

const updatePlaylist = async (req, res) => {

    console.log("\n\n{UPDATE]");
    const userId = auth.verifyUser(req);
    if (!userId) return res.status(401).json({ success: false, errorMessage: 'UNAUTHORIZED' });

    const playlistId = parseInt(req.params.id, 10);
    if (!playlistId) return res.status(400).json({ success: false, error: 'Playlist ID is required and must be an integer' });

    const { playlist: playlistData } = req.body;
    if (!playlistData) return res.status(400).json({ success: false, error: 'You must provide a playlist object' });

    try {
        const playlist = await Playlist.findByPk(playlistId);
        if (!playlist) return res.status(404).json({ success: false, errorMessage: 'Playlist not found' });

        if (playlist.userId !== userId) return res.status(403).json({ success: false, errorMessage: 'Forbidden: not your playlist' });

        playlist.name = playlistData.name;
        playlist.songs = playlistData.songs || [];
        await playlist.save();

        return res.status(200).json({ success: true, id: playlist.id, playlist: formatPlaylist(playlist), message: 'Playlist updated' });
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
