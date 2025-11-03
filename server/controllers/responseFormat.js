// utils/responseFormatter.js

// formats a playlist so mongo + postgres return identical json structure
const formatPlaylist = (playlist) => {
    if (!playlist) return null;

    return {
        _id: playlist._id || playlist.id,         // mongo _id or postgres id
        name: playlist.name,
        songs: playlist.songs || [],
        userId: playlist.userId || playlist.ownerEmail || null
    };
};

// standard api success + error response shapes
const response = {
    success: (data = {}) => ({
        success: true,
        ...data
    }),
    error: (message, extra = {}) => ({
        success: false,
        errorMessage: message,
        ...extra
    })
};

module.exports = {
    formatPlaylist,
    response
};
