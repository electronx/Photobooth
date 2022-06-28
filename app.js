const express = require('express');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const app = express();
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

aws.config.update({
  secretAcesssKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.REGION,
});

const s3 = new aws.S3();
const BUCKET = process.env.BUCKET;

const upload = multer({
  storage: multerS3({
    bucket: BUCKET,
    s3,
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

app.post('/upload', upload.single('photo'), async function (req, res, next) {
  res.send('Successfully uploaded ' + req.file.location + ' location!');
});

app.get('/list', async (req, res) => {
  let files = await s3.listObjectsV2({ Bucket: BUCKET });
  let fileNames = files.Contents.map((item) => item.Key);
  res.status(200).json({
    status: 'success',
    data: fileNames,
  });
});

app.get('/download/:filename', async (req, res) => {
  const fileName = req.params.filename;
  const file = await s3.getObject({ Bucket: BUCKET, Key: fileName });
  res.status(200).json({
    status: 'success',
    data: file,
  });
});

app.delete('/delete/:filename', async (req, res) => {
  const fileName = req.params.filename;
  await s3.getObject({ Bucket: BUCKET, Key: fileName });
  res.status(200).json({
    status: 'success',
    text: 'file deleted successfuly',
  });
});

// aws.config.update({
//   secretAccessKey: process.env.ACCESS_SECRET,
//   accessKeyId: process.env.ACCESS_KEY,
//   region: process.env.REGION,
//   AWS_SDK_LOAD_CONFIG: 1,
// });
// const BUCKET = process.env.BUCKET;
// const s3 = new aws.S3();

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     acl: 'public-read',
//     bucket: BUCKET,
//     key: function (req, file, cb) {
//       console.log(file);
//       cb(null, file.originalname);
//     },
//   }),
// });

// app.post('/upload', upload.single('file'), async function (req, res, next) {
//   res.send('Successfully uploaded ' + req.file.location + ' location!');
// });

// app.get('/list', async (req, res) => {
//   let r = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
//   let x = r.Contents.map((item) => item.Key);
//   res.send(x);
// });

// app.get('/download/:filename', async (req, res) => {
//   const filename = req.params.filename;
//   let x = await s3.getObject({ Bucket: BUCKET, Key: filename }).promise();
//   res.send(x.Body);
// });

// app.delete('/delete/:filename', async (req, res) => {
//   const filename = req.params.filename;
//   await s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise();
//   res.send('File Deleted Successfully');
// });

module.exports = app;
