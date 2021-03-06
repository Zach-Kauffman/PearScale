const fs = require('fs');
const { ObjectId, GridFSBucket } = require('mongodb');

const { getDBReference } = require('../lib/mongo');

const PhotoSchema = {
  title: { required: true },
  desciption: { required: false }
};
exports.PhotoSchema = PhotoSchema;

const acceptedFileTypes = {
  'image/jpeg': 'jpg',
  'image/png': 'png'
}
exports.acceptedFileTypes = acceptedFileTypes;

const insertNewPear = async (image) => new Promise((resolve, reject) => {
    const db = getDBReference();
    const bucket = new GridFSBucket(db, { bucketName: 'pears' });
    const metadata = {
      contentType: image.contentType,
      title: image.title,
      description: image.description,
      userid: image.userid,
      slice: image.slice
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
});
exports.insertNewPear = insertNewPear;

exports.getImageDownloadStreamByFilename = function(filename) {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, { bucketName: 'pears' });
  return bucket.openDownloadStreamByName(filename);
};

exports.getDownloadStreamById = function (id) {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, { bucketName: 'pears' });
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    return bucket.openDownloadStream(new ObjectId(id));
  }
};

exports.getImageInfoById = async function (id) {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, { bucketName: 'pears' });

  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await bucket.find({ _id: new ObjectId(id) })
      .toArray();
    return results[0];
  }
};