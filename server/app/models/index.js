const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.quiz = require("./quiz/quiz.model");

db.question = require("./quiz/question.model");

db.quizAtttempt = require("./quiz/quizAttempt.model");

module.exports = db;
