const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name must be provided'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  sex: {
    type: String,
    required: [true, 'sex must be provided'],
  },
});

const Question = new questionSchema('Question', questionSchema);

module.exports = Question;
