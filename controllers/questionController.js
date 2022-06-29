const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const dotenv = require('dotenv');
const AppError = require('../utils/appError');
const crypto = require('crypto');
const sharp = require('sharp');

dotenv.config({ path: './config.env' });

aws.config.update({
  secretAcesssKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.REGION,
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else cb(new AppError('Please Upload an Image', 400), false);
};

const s3 = new aws.S3();
const BUCKET = process.env.BUCKET;

const upload = multer({
  fileFilter: multerFilter,
  ContentType: 'image/jpeg',
  limits: { fileSize: 10000000 },
  storage: multerS3({
    bucket: BUCKET,
    s3,
    acl: 'public-read',
    key: (req, file, cb) => {
      const secretName = crypto.randomBytes(10).toString('hex');
      const format = file.originalname.split('.')[1];
      console.log(file);
      cb(null, secretName + '.' + format);
    },
  }),
});

// exports.resizeUserPhoto = async (req, res, next) => {
//   if (!req.file) return next();

//   console.log(req.file);
//   // req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

//   req.file = await sharp(req.file)
//     .resize(500, 500)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toBuffer();

//   //   .toFile(`public/img/users/${req.file.filename}`);

//   next();
// };

exports.uploadQuestion = upload.array('photo', 2);

exports.createQuestion = async function (req, res, next) {
  let files = [];
  await req.files.forEach((el) => {
    files.push(el.location);
  });
  res.send(files);
};

exports.getAllPhoto = async (req, res, next) => {
  let files = await s3.listObjectsV2({ Bucket: BUCKET });
  let fileNames = files.Contents.map((item) => item.Key);
  res.status(200).json({
    status: 'success',
    data: fileNames,
  });
};

exports.getPhoto = async (req, res, next) => {
  const fileName = req.params.filename;
  const file = await s3.getObject({ Bucket: BUCKET, Key: fileName });
  res.status(200).json({
    status: 'success',
    data: file,
  });
};

exports.deletePhoto = async (req, res, next) => {
  const fileName = req.params.filename;
  await s3.getObject({ Bucket: BUCKET, Key: fileName });
  res.status(200).json({
    status: 'success',
    text: 'file deleted successfuly',
  });
};
