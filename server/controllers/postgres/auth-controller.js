const auth = require('../../auth');
const authdb = require('../../db/postgres/authdb');

const getLoggedIn = async (req, res) => {
    try {
        const userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(200).json({ loggedIn: false, user: null, errorMessage: '?' });
        }

        const loggedInUser = await authdb.findUserById(userId);
        if (!loggedInUser) {
            return res.status(404).json({ loggedIn: false, user: null, errorMessage: 'User not found' });
        }

        return res.status(200).json({
            loggedIn: true,
            user: {
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                email: loggedInUser.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ errorMessage: 'Please enter all required fields.' });

        const user = await authdb.findUserByEmail(email);
        if (!user) return res.status(401).json({ errorMessage: 'Wrong email or password provided.' });

        const passwordCorrect = await authdb.verifyPassword(user, password);
        if (!passwordCorrect) return res.status(401).json({ errorMessage: 'Wrong email or password provided.' });

        const token = auth.signToken(user.id);
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' })
           .status(200)
           .json({ success: true, user: { firstName: user.firstName, lastName: user.lastName, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

const logoutUser = async (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0), secure: true, sameSite: 'none' }).send();
};

const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, passwordVerify } = req.body;

        if (!firstName || !lastName || !email || !password || !passwordVerify) {
            return res.status(400).json({ errorMessage: 'Please enter all required fields.' });
        }
        if (password.length < 8) return res.status(400).json({ errorMessage: 'Password must be at least 8 characters.' });
        if (password !== passwordVerify) return res.status(400).json({ errorMessage: 'Passwords do not match.' });

        const existingUser = await authdb.findUserByEmail(email);
        if (existingUser) return res.status(400).json({ success: false, errorMessage: 'Account already exists.' });

        const newUser = await authdb.createUser({ firstName, lastName, email, password });

        const token = auth.signToken(newUser.id);
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' })
           .status(200)
           .json({ success: true, user: { firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = {
    getLoggedIn,
    loginUser,
    logoutUser,
    registerUser
};
