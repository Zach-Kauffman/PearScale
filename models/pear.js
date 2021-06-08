const fs = require('fs');
const { ObjectId, GridFSBucket } = require('mongodb');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');
const { getReviewsByPearId } = require('./review');

/*
 * Schema describing required/optional fields of a pear object.
 */
const PearSchema = {
  title: { required: true },
  description: { required: false },
  userid: { required: false }
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
// const insertNewPear = async (pear) =>  new Promise((resolve, reject) => {
//   const db = getDBReference();
//   const bucket = new GridFSBucket(db, { bucketName: 'pears'});
//   const metadata = {
//     slice: pear.slice,
//     title: pear.title,
//     userid: pear.userid,
//     contentType: pear.contentType,
//     description: pear.description,
//   }
//   const uploadStream = bucket.openUploadStream(pear.filename, { metadata: metadata });
//   fs.createReadStream(pear.path).pipe(uploadStream)
//       .on('error', (err) => {
//         reject(err);
//       })
//       .on('finish', (result) => {
//         resolve(result._id);
//       });
// });
// exports.insertNewPear = insertNewPear;

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

//Gets all pears attatched to slicename //TODOGregory
async function getPearsBySlicename(slicename) {
  const db = getDBReference();
  // const collection = db.collection('images');
  const bucket = new GridFSBucket(db, { bucketName: 'pears' });
  const results = await bucket
    .find({ "metadata.slice": slicename })
    .toArray();
  return results;
}
exports.getPearsBySlicename = getPearsBySlicename;

//Gets all pears attatched to slicename //TODOGregory
async function getPearsByUserId(id) {
  const db = getDBReference();
  const collection = db.collection('pears.files')
  const bucket = new GridFSBucket(db, { bucketName: 'pears.files' });
  const results = await collection
    .find({ "metadata.userid": id })
    .toArray();
  console.log(results);
  return results;
}
exports.getPearsByUserId = getPearsByUserId;


/*
 * Executes a DB query to fetch information about a single specified
 * pear based on its ID.  Does not fetch photo data for the
 * pear.  Returns a Promise that resolves to an object containing
 * information about the requested pear.  If no pear with the
 * specified ID exists, the returned Promise will resolve to null.
 */
async function getPearById(id) {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, { bucketName: 'pears' });
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await bucket.find({ _id: new ObjectId(id) }).toArray();
    return {
      ...results[0],
      reviews: await getReviewsByPearId(id),
    }
  }

}
exports.getPearById = getPearById;
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