/*
 * User schema and data accessor methods.
 */

const bcrypt = require('bcryptjs');

const mysqlPool = require('../lib/mysqlPool');
const {extractValidFields} = require('../lib/validation');

/*
 * Schema describing required/optional fields of a user object.
 */
const UserSchema = {
    name: {required: true},
    email: {required: true},
    password: {required: true},
    admin: {required: false}
};
exports.UserSchema = UserSchema;

/*
 * Executes a MySQL query to insert a new user into the database.  Returns
 * a Promise that resolves to the ID of the newly-created user entry.
 */
const insertNewUser = async (user) => {
    user = extractValidFields(user, UserSchema);
    user.password = await bcrypt.hash(user.password, 8);
    const [result] = await mysqlPool.query('INSERT INTO users SET ?', user);
    return result.insertId;
}
exports.insertNewUser = insertNewUser;

/*
 * Executes a MySQL query to fetch a single specified user based on its ID.
 * Returns a Promise that resolves to an object containing the requested
 * user.  If no user with the specified ID exists, the returned Promise
 * will resolve to null.
 */
const getUserById = async (id) => {
    const [results] = await mysqlPool.query('SELECT * FROM users WHERE id = ?', [id]);
    return results[0];
}
exports.getUserById = getUserById;

const getUserByEmail = async (email) => {
    const [results] = await mysqlPool.query('SELECT * FROM users WHERE email = ?', [email]);
    return results[0];
}
exports.getUserByEmail = getUserByEmail;


const validateUser = async (email, password) => {
    const user = await getUserByEmail(email, true);
    const check = await bcrypt.compare(password, user.password);
    console.log('USER:', user);
    console.log('check:', check);
    return (check) ? user : undefined;
}
exports.validateUser = validateUser;
