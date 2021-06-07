/*
 * Business schema and data accessor methods;
 */

const { ObjectId } = require('mongodb');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');
const { getPhotosByBusinessId } = require('./photo');

/*
 * Schema describing required/optional fields of a business object.
 */
const BusinessSchema = {
  name: { required: true },
  address: { required: true },
  city: { required: true },
  state: { required: true },
  zip: { required: true },
  category: { required: true },
  subcategory: { required: true },
  website: { required: false },
  email: { required: false },
  ownerid: { required: true }
};
exports.BusinessSchema = BusinessSchema;

/*
 * Executes a DB query to return a single page of businesses.  Returns a
 * Promise that resolves to an array containing the fetched page of businesses.
 */
async function getBusinessesPage(page) {
  const db = getDBReference();
  const collection = db.collection('businesses');
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
    businesses: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count
  };
}
exports.getBusinessesPage = getBusinessesPage;

/*
 * Executes a DB query to insert a new business into the database.  Returns
 * a Promise that resolves to the ID of the newly-created business entry.
 */
async function insertNewBusiness(business) {
  business = extractValidFields(business, BusinessSchema);
  const db = getDBReference();
  const collection = db.collection('businesses');
  const result = await collection.insertOne(business);
  return result.insertedId;
}
exports.insertNewBusiness = insertNewBusiness;

/*
 * Executes a DB query to fetch information about a single specified
 * business based on its ID.  Does not fetch photo data for the
 * business.  Returns a Promise that resolves to an object containing
 * information about the requested business.  If no business with the
 * specified ID exists, the returned Promise will resolve to null.
 */
async function getBusinessById(id) {
  const db = getDBReference();
  const collection = db.collection('businesses');
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
 * specified business based on its ID, including photo data for
 * the business.  Returns a Promise that resolves to an object containing
 * information about the requested business.  If no business with the
 * specified ID exists, the returned Promise will resolve to null.
 */
async function getBusinessDetailsById(id) {
  /*
   * Execute three sequential queries to get all of the info about the
   * specified business, including its photos.
   */
  const business = await getBusinessById(id);
  if (business) {
    business.photos = await getPhotosByBusinessId(id);
  }
  return business;
}
exports.getBusinessDetailsById = getBusinessDetailsById;
