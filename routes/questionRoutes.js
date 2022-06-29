const express = require('express');
const questionController = require('../controllers/questionController');

const router = express.Router();

router.post(
  '/upload',
  questionController.uploadQuestion,
  questionController.createQuestion
);

module.exports = router;
