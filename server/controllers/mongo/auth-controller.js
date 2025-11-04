// server/controllers/mongo/store-controller.js
const auth = require('../../auth');
const userService = require('../../db/mongo/authdb');

const getLoggedIn = async (req, res) => {
    try {
        const userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(200).json({ loggedIn: false, user: null });
        }

        const loggedInUser = await userService.findUserById(userId);
        if (!loggedInUser) {
            return res.status(400).json({ loggedIn: false, user: null });
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
        res.status(500).json({ error: "Server error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ errorMessage: "Please enter all required fields." });
        }

        const existingUser = await userService.findUserByEmail(email);
        if (!existingUser) {
            return res.status(401).json({ errorMessage: "Wrong email or password." });
        }

        const passwordCorrect = await userService.verifyPassword(existingUser, password);
        if (!passwordCorrect) {
            return res.status(401).json({ errorMessage: "Wrong email or password." });
        }

        const token = auth.signToken(existingUser._id);
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: true })
            .status(200).json({
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
    res.cookie("token", "", { httpOnly: true, expires: new Date(0), secure: true, sameSite: "none" }).send();
};

const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, passwordVerify } = req.body;

        if (!firstName || !lastName || !email || !password || !passwordVerify) {
            return res.status(400).json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res.status(400).json({ errorMessage: "Password must be at least 8 characters." });
        }
        if (password !== passwordVerify) {
            return res.status(400).json({ errorMessage: "Passwords do not match." });
        }

        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ errorMessage: "Email already exists." });
        }

        const savedUser = await userService.createUser({ firstName, lastName, email, password });
        const token = auth.signToken(savedUser._id);

        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
            .status(200).json({
                success: true,
                user: {
                    firstName: savedUser.firstName,
                    lastName: savedUser.lastName,
                    email: savedUser.email
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
