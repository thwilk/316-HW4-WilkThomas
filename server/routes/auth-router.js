const express = require('express')
const router = express.Router()
const { auth } = require('../controllers/index.js')

router.post('/register', auth.registerUser)
router.post('/login', auth.loginUser)
router.get('/logout', auth.logoutUser)
router.get('/loggedIn', auth.getLoggedIn)

module.exports = router