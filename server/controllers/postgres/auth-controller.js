const auth = require('../../auth');
const User = require('../../models/postgres/user-schema'); 
const bcrypt = require('bcryptjs');

const getLoggedIn = async (req, res) => {
    try {
        const userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(200).json({
                loggedIn: false,
                user: null,
                errorMessage: "?"
            });
        }

        const loggedInUser = await User.findByPk(userId);
        if (!loggedInUser) {
            return res.status(404).json({ loggedIn: false, user: null, errorMessage: "User not found" });
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
        res.status(500).json({ success: false });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ errorMessage: "Please enter all required fields." });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            return res.status(401).json({ errorMessage: "Wrong email or password provided." });
        }

        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) {
            return res.status(401).json({ errorMessage: "Wrong email or password provided." });
        }

        const token = auth.signToken(existingUser.id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                email: existingUser.email
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
};

const logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).send();
};

const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, passwordVerify } = req.body;

        if (!firstName || !lastName || !email || !password || !passwordVerify) {
            return res.status(400).json({ errorMessage: "Please enter all required fields." });
        }

        if (password.length < 8) {
            return res.status(400).json({ errorMessage: "Please enter a password of at least 8 characters." });
        }

        if (password !== passwordVerify) {
            return res.status(400).json({ errorMessage: "Please enter the same password twice." });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, errorMessage: "An account with this email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await User.create({ firstName, lastName, email, passwordHash });

        const token = auth.signToken(newUser.id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
};

module.exports = {
    getLoggedIn,
    loginUser,
    logoutUser,
    registerUser
};
