const { ObjectId } = require('mongodb');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');
const { getReviewsBySliceId } = require('./review');

/*
 * Schema describing required/optional fields of a slice object.
 */
const SliceSchema = {
  title: { required: true },
  description: { required: true },
  userid: { required: true },
};
exports.SliceSchema = SliceSchema;

/*
 * Executes a DB query to return a single page of slices.  Returns a
 * Promise that resolves to an array containing the fetched page of slices.
 */
async function getSlicesPage(page) {
  const db = getDBReference();
  const collection = db.collection('slices');
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
    slices: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count
  };
}
exports.getSlicesPage = getSlicesPage;

/*
 * Executes a DB query to insert a new slice into the database.  Returns
 * a Promise that resolves to the ID of the newly-created slice entry.
 */
async function insertNewSlice(slice) {
    const db = getDBReference();
    const collection = db.collection('slices');
    const result = await collection.insertOne({
      title: slice.title,
      description: slice.description,
      userid: slice.userid

    });
    return result.insertedId;

    
}
exports.insertNewSlice = insertNewSlice;

/*
 * Executes a DB query to fetch information about a single specified
 * slice based on its ID.  Does not fetch photo data for the
 * slice.  Returns a Promise that resolves to an object containing
 * information about the requested slice.  If no slice with the
 * specified ID exists, the returned Promise will resolve to null.
 */
async function getSliceByName(slicename) {
  const db = getDBReference();
  const collection = db.collection('slices');
  const results = await collection
      .find({ "title": slicename })
      .toArray();
  console.log(results);
    return results[0];
}
exports.getSliceByName = getSliceByName;

/*
 * Executes a DB query to fetch detailed information about a single
 * specified slice based on its ID, including photo data for
 * the slice.  Returns a Promise that resolves to an object containing
 * information about the requested slice.  If no slice with the
 * specified ID exists, the returned Promise will resolve to null.
 */
async function getSliceDetailsByName(id) {
  /*
   * Execute three sequential queries to get all of the info about the
   * specified slice, including its photos.
   */
  const slice = await getSliceByName(id);
  if (slice) {
    slice.reviews = await getReviewsBySliceId(id);
  }
  return slice;
}
exports.getSliceDetailsByName = getSliceDetailsByName;
/*
 * Deletes a slice given its id
 */
async function deleteSlice(slice) {
    const db = getDBReference();
    var collection = db.collection('slices');

    const results = await collection
        .deleteOne({ title: slice});

    collection = db.collection('pears.files');
    //pears are stored in pears.chunks (image binary) and pears.files (metadata)
    //we must delete them from both of these collections
    const slicePears = await collection.find({'metadata.slice': slice}).toArray();
    for (const pear of slicePears) {
      const pearId = new ObjectId(pear._id);
      await db.collection('pears.chunks').deleteOne({ 'files_id': pearId });
    }
    await collection
        .deleteMany({ 'metadata.slice': slice });


    return (results.deletedCount > 0);
    
}
exports.deleteSlice = deleteSlice;