// server/db/mongo/userService.js
const User = require('../../models/mongo/user-model');
const bcrypt = require('bcryptjs');

const findUserById = async (id) => {
    return await User.findById(id);
};

const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

const createUser = async ({ firstName, lastName, email, password }) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ firstName, lastName, email, passwordHash });
    return await newUser.save();
};

const verifyPassword = async (user, password) => {
    return await bcrypt.compare(password, user.passwordHash);
};

module.exports = {
    findUserById,
    findUserByEmail,
    createUser,
    verifyPassword
};
