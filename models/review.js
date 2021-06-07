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
  ownerid: { required: true }
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
 * Updates a pear
 */
async function updateReview(review) {
    review = extractValidFields(review, ReviewSchema);
    const db = getDBReference();
    const collection = db.collection('reviews');
    
    if (!ObjectId.isValid(id)) {
      return null;
    } else {
      const results = await collection
        .updateOne({ _id: new ObjectId(id) }, review)
        .toArray();
      return results[0];
    }
}
exports.updateReview = updateReview;
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

/*
 * Deletes a review
 */
async function deleteReview(id) {
    const db = getDBReference();
    const collection = db.collection('reviews');
    if (!ObjectId.isValid(id)) {
      return null;
    } else {
      const results = await collection
        .deleteOne({ _id: new ObjectId(id)})
      return;
    }
  }
  exports.deleteReview = deleteReview;