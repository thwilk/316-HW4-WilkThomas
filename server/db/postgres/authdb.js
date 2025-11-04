const User  = require('../../models/postgres/user-schema');
const bcrypt = require('bcryptjs');

const findUserById = async (id) => {
    return await User.findByPk(id);
};

const findUserByEmail = async (email) => {
    return await User.findOne({ where: { email } });
};

const createUser = async ({ firstName, lastName, email, password }) => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({ firstName, lastName, email, passwordHash });
    return newUser;
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
