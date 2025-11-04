
const Playlist = require('../../models/mongo/playlist-model')
const User = require('../../models/mongo/user-model');


const createPlaylist = async (userId, body) => {
    const playlist = new Playlist(body);

    User.findOne({ _id: userId }, (err, user) => {
        console.log("user found: " + JSON.stringify(user));
        user.playlists.push(playlist._id);
        user
            .save()
            .then(() => {
                playlist
                    .save()
                    .then(() => {
                        return true;
                    })
                    .catch(error => {
                        return false;
                    })
            });
    })
};

const deletePlaylist = async (playlistid, userId) => {
    Playlist.findById({ _id: playlistid }, (err, playlist) => {
        if (err) {
            return false;
        }
        async function asyncFindUser(list) {
            User.findOne({ email: list.ownerEmail }, (err, user) => {


                if (user._id == userId) {
                    console.log("correct user!");
                    Playlist.findOneAndDelete({ _id: playlistid }, () => {
                        return true;
                    }).catch(err => console.log(err))
                }
                else {
                    console.log("incorrect user!");
                    return false
                }
            });
        }
        asyncFindUser(playlist);
    })
}

const getPlaylistById = async (playlistId, userId) => {
    try {
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) return null;

        const user = await User.findOne({ email: playlist.ownerEmail });
        if (!user) return null;

        // check if playlist belongs to this user
        if (user._id.toString() !== userId.toString()) {
            return null;
        }

        return playlist;
    } catch (err) {
        console.error("DB error:", err);
        return null;
    }
};

const getPlaylistPairs = async (userId) => {
    try {
        const user = await User.findById(userId); 

        if (!user) return false;

        const playlists = await Playlist.find({ ownerEmail: user.email });

        if (!playlists) return false;

        const pairs = playlists.map(list => ({
            _id: list._id,
            name: list.name
        }));

        return pairs;
    } catch (err) {
        console.error(err);
        return false;
    }
};

const getPlaylists = async () => {
    try {
        await Playlist.find({}, (err, playlists) => {
            if(!err && playlists.length)
                return false

            return playlists;
        })
    } catch (err) {
        console.error(err);
        return false;
    }
}

const updatePlaylist = async (id, userId, body) => {
    try { 
    Playlist.findOne({ _id: id }, (err, playlist) => {

        if (err) 
            return false
        


        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {

                if (user._id == userId) {


                    list.name = body.playlist.name;
                    list.songs = body.playlist.songs;
                    list
                        .save()
                        .then(() => {
                            return list._id;
                        })
                        .catch(error => {
                            return false
                        })
                }
                else {
                    console.log("incorrect user!");
                    return false;
                }
            });
        }
        asyncFindUser(playlist);
    })

    }
    catch (err) {
        console.log(err);
        return false
    }
}


module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist
}