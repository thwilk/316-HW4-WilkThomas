const Playlist = require('../../models/mongo/playlist-model')
const User = require('../../models/mongo/user-model');
const { formatPlaylist, response } = require('../responseFormat');
const auth = require('../../auth')
const storedb = require("../../db/mongo/storedb") 
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => { //
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }

    const body = req.body;
    const userId = req.userId;

    console.log("createPlaylist body: " + JSON.stringify(body));

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }
    
    const playlist = new Playlist(body);

    if (!playlist) 
        return res.status(400).json({ success: false, error: err })
    


    if(storedb.createPlaylist(userId, body))
        return res.status(201).json({playlist: formatPlaylist(playlist)});
    else
        return res.status(400).json({errorMessage: 'Couldnt Create Playlist'});
}
deletePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }

    const id = req.params.id;
    const userId = req.userId;

    if(storedb.deletePlaylist(id, userId))
        return res.status(200).json({success: true});
    else
        return res.status(400).json({success: false, errorMessage: "Backend Error"});

}
getPlaylistById = async (req, res) => {
    if (!auth.verifyUser(req)) {
        return res.status(400).json({ errorMessage: 'UNAUTHORIZED' });
    }

    const playlistId = req.params.id;
    const userId = req.userId;

    console.log("Find Playlist with id:", playlistId);

    const playlist = await storedb.getPlaylistById(playlistId, userId);

    if (!playlist) {
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));


    await Playlist.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        console.log("Found list: " + JSON.stringify(list));

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                if (user._id == req.userId) {
                    console.log("correct user!");
                    return res.status(200).json({ success: true, playlist: formatPlaylist(list) })
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(list);
    }).catch(err => console.log(err))
}
getPlaylistPairs = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("getPlaylistPairs");

    const userId = req.userId;
    const pairs = await storedb.getPlaylistPairs(userId)

    if(pairs)
        return res.status(200).json({ success: true, idNamePairs: pairs })
    else 
        return res.status(400).json({ success: false, error: "Database Error" })
}
getPlaylists = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }

    const playlists = storedb.getPlaylists();

    if(playlists){
        const cor = playlists.map(playlist => formatPlaylist(playlist));
        return res.status(200).json({ success: true, data: cor })
    }
    else 
        return res.status(400).json({ success: false, error: "Database Error" })

}
updatePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            success: false,
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body
    const zid = req.params.id
    const userId = req.userId

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }


    const call = storedb.updatePlaylist(zid, userId, body);

    if(call){
        return res.status(200).json({
            success: true,
            id: call,
            message: 'Playlist updated!',
        })
    } 
    else 
        return res.status(400).json({ success: false, error: "Database Error" })

}
module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist
}