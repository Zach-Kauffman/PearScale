const { ObjectId } = require('mongodb');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');

/*
 * Schema describing required/optional fields of a photo object.
 */
const UserSchema = {
  name: { required: true },
  email: {required: true },
  password: { required: true }

};
exports.UserSchema = UserSchema;

async function insertNewUser(user) {
  const db = getDBReference();
  const collection = db.collection('users');
  const duplicate = await collection.find({email: user.email}).toArray();
  if (duplicate.length > 0) {
    return false
  }
  const results = await collection.insertOne(user);
  return results.insertedId;
}
exports.insertNewUser = insertNewUser;

async function getAllUsers(id) {
    const db = getDBReference();
    const collection = db.collection('users');
    if (!ObjectId.isValid(id)) {
      return [];
    } else {
      const results = await collection
        .find()
        .toArray();
      return results;
    }
}
exports.getAllUsers = getAllUsers;

async function validateUserByEmail(email, password) {
  const db = getDBReference();
  const collection = db.collection('users');
  const results = await collection
    .find({email: email, password: password})
    .toArray();
  if (results.length == 0) {
    return false;
  }
  return results;
}
exports.validateUserByEmail = validateUserByEmail;

async function getUserByEmail(email) {
  const db = getDBReference();
  const collection = db.collection('users');
  const results = await collection
  .find({ email: email })
  .toArray();
  return results;
}
exports.getUserByEmail = getUserByEmail;

async function getUserById(id) {
    const db = getDBReference();
    const collection = db.collection('users');
    if (!ObjectId.isValid(id)) {
        return [];
    } else {
        const results = await collection
        .find({ _id: new ObjectId(id) })
        .toArray();
        return results;
    }
}
exports.getUserById = getUserById;

/*
 * Updates a user
 */
async function updateUser(user) {
    user = extractValidFields(user, UserSchema);
    const db = getDBReference();
    const collection = db.collection('users');
    
    if (!ObjectId.isValid(id)) {
      return null;
    } else {
      const results = await collection
        .updateOne({ _id: new ObjectId(id) }, user)
        .toArray();
      return results[0];
    }
}
exports.updateUser = updateUser;

/*
 *  Deletes a user 
*/
async function deleteUser(id) {
    const db = getDBReference();
    var collection = db.collection('user');
    if (!ObjectId.isValid(id)) {
      return null;
    } else {
        const userId = new ObjectId(id);
        await collection
            .deleteOne({ _id: new ObjectId(id)})
        collection = db.collection('pears');
        await collection
            .deleteOne({ userid: new ObjectId(id)}) //Check
        collection = db.collection('reviews');
        await collection
            .deleteOne({ _id: new ObjectId(id)})
      return;
    }
}
exports.deleteUser = deleteUser;

