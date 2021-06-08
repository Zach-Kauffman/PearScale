const { ObjectId } = require('mongodb');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');

/*
 * Schema describing required/optional fields of a photo object.
 */
const ReviewSchema = {
  pearid: { required: true },
  text: { required: false },
  rating: { required: true },
  userid: { required: true }
};
exports.ReviewSchema = ReviewSchema;

/*
 * Creates new Review
 * Uhh I this needs to link to pears somehow
 */
async function insertNewReview(review) {
    review = extractValidFields(review, ReviewSchema);
    const db = getDBReference();
    const collection = db.collection('reviews');
    const result = await collection.insertOne(review);
    return result.insertedId;
}
exports.insertNewReview = insertNewReview;

/*
 * Executes a MySQL query to verfy whether a given user has already reviewed
 * a specified business.  Returns a Promise that resolves to true if the
 * specified user has already reviewed the specified business or false
 * otherwise.
 */
async function hasUserReviewedPear(userid, pearid) {
  const db = getDBReference();
  const collection = db.collection('reviews');
  const reviews = await collection
    .find({'pearid': pearid, 'userid': userid})
    .toArray();
  //Check if owner is in the list of reviews on a pair
  return (reviews.length > 0);
}
exports.hasUserReviewedPear = hasUserReviewedPear;
/*
 * Updates a pear
 */
async function updateReview(review, id) {
    review = extractValidFields(review, ReviewSchema);
    const db = getDBReference();
    const collection = db.collection('reviews');
    
    if (!ObjectId.isValid(id)) {
      return null;
    } else {
      const results = await collection
      .updateOne(
        { _id: new ObjectId(id) }, 
          { $set: 
            { text: review.text, rating: review.rating }
          },
          { upsert: true}
        );
        console.log("results", results.modifiedCount, results.matchedCount);
      return (results.modifiedCount > 0);
    }
}
exports.updateReview = updateReview;

async function getReviewById(id) {
  const db = getDBReference();
  const collection = db.collection('reviews');
  if (!ObjectId.isValid(id)) {
    return [];
  } else {
    const results = await collection
      .find({ _id: new ObjectId(id) })
      .toArray();
    return results;
  }
}
exports.getReviewById = getReviewById;

/*
 * Returns all reviews attatched to a pare 
 * given an id
 */
async function getReviewsByPearId(id) {
  const db = getDBReference();
  const collection = db.collection('reviews');
  if (!ObjectId.isValid(id)) {
    return [];
  } else {
    const results = await collection
      .find({ pearid: new ObjectId(id) })
      .toArray();
    return results;
  }
}
exports.getReviewsByPearId = getReviewsByPearId;


async function getReviewsByUserId(id) {
  const db = getDBReference();
  const collection = db.collection('reviews');
  if (!ObjectId.isValid(id)) {
    return [];
  } else {
    const results = await collection
      .find({ userid: id })
      .toArray();
    return results;
  }
}
exports.getReviewsByUserId = getReviewsByUserId;

/*
 * Deletes a review
 */
async function deleteReview(id) {
    const db = getDBReference();
    const collection = db.collection('reviews');
    if (!ObjectId.isValid(id)) {
      return;
    } else {
      const results = await collection
        .deleteOne({ _id: new ObjectId(id)});
      console.log(results);
      return (results.deletedCount > 0);
    }
  }
  exports.deleteReview = deleteReview;