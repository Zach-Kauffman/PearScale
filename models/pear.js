/*
 * Pear schema and data accessor methods;
 */

const { ObjectId } = require('mongodb');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');
const { getReviewsByPearId } = require('./review');

/*
 * Schema describing required/optional fields of a pear object.
 */
const PearSchema = {
  title: { required: true },
  image: { required: true },
  description: { required: false },
  ownerid: {required: true},
  sliceid: {required: true}
};
exports.PearSchema = PearSchema;

/*
 * Executes a DB query to return a single page of pears.  Returns a
 * Promise that resolves to an array containing the fetched page of pears.
 */
async function getPearsPage(page) {
  const db = getDBReference();
  const collection = db.collection('pears');
  const count = await collection.countDocuments();

  /*
   * Compute last page number and make sure page is within allowed bounds.
   * Compute offset into collection.
   */
  const pageSize = 10;
  const lastPage = Math.ceil(count / pageSize);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;
  const offset = (page - 1) * pageSize;

  const results = await collection.find({})
    .sort({ _id: 1 })
    .skip(offset)
    .limit(pageSize)
    .toArray();

  return {
    pears: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count
  };
}
exports.getPearsPage = getPearsPage;

/*
 * Executes a DB query to insert a new pear into the database.  Returns
 * a Promise that resolves to the ID of the newly-created pear entry.
 */
async function insertNewPear(pear) {
  pear = extractValidFields(pear, PearSchema);
  const db = getDBReference();
  const collection = db.collection('pears');
  const result = await collection.insertOne(pear);
  return result.insertedId;
}
exports.insertNewPear = insertNewPear;

/*
 * Updates a pear
 */
async function updatePear(pear) {
  pear = extractValidFields(pear, PearSchema);
  const db = getDBReference();
  const collection = db.collection('pears');
  
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .updateOne({ _id: new ObjectId(id) }, pear)
      .toArray();
    return results[0];
  }
}
exports.updatePear = updatePear;


/*
 * Gets all pears
 */
async function getAllPears() {
  const db = getDBReference();
  const collection = db.collection('pears');
  if (!ObjectId.isValid(id)) {
    return [];
  } else {
    const results = await collection
      .find()
      .toArray()
      .pretty();
    return results[0];
  }
}
exports.getAllPears = getAllPears;
/*
 * Executes a DB query to fetch information about a single specified
 * pear based on its ID.  Does not fetch photo data for the
 * pear.  Returns a Promise that resolves to an object containing
 * information about the requested pear.  If no pear with the
 * specified ID exists, the returned Promise will resolve to null.
 */
async function getPearById(id) {
  const db = getDBReference();
  const collection = db.collection('pears');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .find({ _id: new ObjectId(id) })
      .toArray();
    return results[0];
  }
}

/*
 * Executes a DB query to fetch detailed information about a single
 * specified pear based on its ID, including photo data for
 * the pear.  Returns a Promise that resolves to an object containing
 * information about the requested pear.  If no pear with the
 * specified ID exists, the returned Promise will resolve to null.
 */
async function getPearDetailsById(id) {
  /*
   * Execute three sequential queries to get all of the info about the
   * specified pear, including its photos.
   */
  const pear = await getPearById(id);
  if (pear) {
    pear.reviews = await getReviewsByPearId(id);
  }
  return pear;
}
exports.getPearDetailsById = getPearDetailsById;


/*
 * Deletes a pear given its id
 */
async function deletePear(id) {
  const db = getDBReference();
  const collection = db.collection('slices');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
    .deleteOne({ _id: new ObjectId(id)})
    return;
  }
}
exports.deletePear = deletePear;