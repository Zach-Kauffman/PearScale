const fs = require('fs');
const { ObjectId, GridFSBucket } = require('mongodb');

const { getDBReference } = require('../lib/mongo');

const PhotoSchema = {
  title: { required: true },
  desciption: { required: false }
};
exports.PhotoSchema = PhotoSchema;


const insertNewPhoto = async (photo) => new Promise((resolve, reject) => {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, { bucketName: 'photos'});
  const metadata = {
    contentType: photo.contentType,
    businessid: photo.businessid,
    caption: photo.caption
  };
  const uploadStream = bucket.openUploadStream(photo.filename,
    { metadata: metadata });
  fs.createReadStream(photo.path).pipe(uploadStream)
      .on('error', (err) => {
        reject(err);
      })
      .on('finish', (result) => {
        resolve(result._id);
      });
});
exports.insertNewPhoto = insertNewPhoto;


exports.saveImageInfo = async function (image) {
  const db = getDBReference();
  const collection = db.collection('images');
  const result = await collection.insertOne(image);
  return result.insertedId;
};

exports.saveImageFile = function (image) {
  return new Promise((resolve, reject) => {
    const db = getDBReference();
    const bucket = new GridFSBucket(db, { bucketName: 'images' });
    const metadata = {
      contentType: image.contentType,
      userId: image.userId
    };
    const uploadStream = bucket.openUploadStream(
      image.filename,
      { metadata: metadata }
    );
    fs.createReadStream(image.path).pipe(uploadStream)
      .on('error', (err) => {
        reject(err);
      })
      .on('finish', (result) => {
        resolve(result._id);
      });
      /*
       * Remove file from fs.
       */
  });
};

/*
 * Executes a DB query to insert a new photo into the database.  Returns
 * a Promise that resolves to the ID of the newly-created photo entry.
 */
const insertNewPhoto = async (photo) => new Promise((resolve, reject) => {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, { bucketName: 'photos'});
  const metadata = {
    contentType: photo.contentType,
    businessid: photo.businessid,
    caption: photo.caption
  };
  const uploadStream = bucket.openUploadStream(photo.filename, { metadata: metadata });
  fs.createReadStream(photo.path).pipe(uploadStream)
      .on('error', (err) => {
        reject(err);
      })
      .on('finish', (result) => {
        resolve(result._id);
      });
});
exports.insertNewPhoto = insertNewPhoto;

exports.getImageDownloadStreamByFilename = function(filename) {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, { bucketName: 'images' });
  return bucket.openDownloadStreamByName(filename);
};

exports.getImageInfoById = async function (id) {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, { bucketName: 'images' });

  if (!ObjectId.isValid(id)) {
    return null;
  } else {

    const results = await bucket.find({ _id: new ObjectId(id) })
      .toArray();
    return results[0];
  }
};