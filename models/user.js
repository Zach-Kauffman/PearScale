const { ObjectId } = require('mongodb');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');

/*
 * Schema describing required/optional fields of a photo object.
 */
const UserSchema = {
  name: { required: true },
  email: {required: true },
  password: { required: true },
  admin: { required: false }

};
exports.UserSchema = UserSchema;

async function checkForDuplicateEmail(email) {
  const db = getDBReference();
  const collection = db.collection('users');
  const duplicate = await collection.find({email: email}).toArray();
  console.log("Duplicate email:", duplicate.length > 0);
  return duplicate;
}
exports.checkForDuplicateEmail = checkForDuplicateEmail;

async function insertNewUser(user) {
  const db = getDBReference();
  const collection = db.collection('users');
  const isDupe = await checkForDuplicateEmail(user.email);
  if(isDupe.length > 0) {
    return false;
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
async function updateUser(user, id) {
    user = extractValidFields(user, UserSchema);
    const db = getDBReference();
    const collection = db.collection('users');
    if (!ObjectId.isValid(id)) {
      return null;
    } else {
      const results = await collection
        .updateOne(
          { _id: new ObjectId(id) }, 
          { $set: 
            { name: user.name, email: user.email, password: user.password, admin: user.admin}
          },
          { upsert: true}
        );
      return (results.modifiedCount === 1);
    }
}
exports.updateUser = updateUser;

/*
 *  Deletes a user 
*/
async function deleteUser(id) {
    const db = getDBReference();
    var collection = db.collection('users');
    if (!ObjectId.isValid(id)) {
      return null;
    } else {
        const userId = new ObjectId(id);
        //first we delete the user from the 'users' collection
        await collection
            .deleteOne({ _id: userId })
        collection = db.collection('pears.files');

        //pears are stored in pears.chunks (image binary) and pears.files (metadata)
        //we must delete them from both of these collections
        const userPears = await collection.find({'metadata.userid': id}).toArray();
        for (const pear of userPears) {
          await db.collection('pears.chunks').deleteOne({ '_id': pear._id });
        }
        await collection
            .deleteMany({ 'metadata.userid': id })
        
        //lastly we delete all reviews the user posted
        collection = db.collection('reviews');
        await collection
            .deleteMany({ userid: id })
      return;
    }
}
exports.deleteUser = deleteUser;

