
const formatPlaylist = (playlist) => {
    if (!playlist) return null;

    return {
        _id: playlist._id || playlist.id,         
        name: playlist.name,
        songs: playlist.songs || [],
        userId: playlist.userId || playlist.ownerEmail || null
    };
};

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
