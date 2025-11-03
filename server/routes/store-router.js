/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const { store } = require('../controllers/index.js')

const router = express.Router()
const auth = require('../auth')

router.post('/playlist', auth.verify, store.createPlaylist)
router.delete('/playlist/:id', auth.verify, store.deletePlaylist)
router.get('/playlist/:id', auth.verify, store.getPlaylistById)
router.get('/playlistpairs', auth.verify, store.getPlaylistPairs)
router.get('/playlists', auth.verify, store.getPlaylists)
router.put('/playlist/:id', auth.verify, store.updatePlaylist)

module.exports = router