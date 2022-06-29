const express = require('express');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const app = express();
const dotenv = require('dotenv');
const questionRouter = require('./routes/questionRoutes');
require('express-async-errors');

dotenv.config({ path: './config.env' });

app.use('/question', questionRouter);

module.exports = app;
