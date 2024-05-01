const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quizAttemptSchema = new Schema({
  user: { type: String, required: true },
  quiz: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  questions: [
    {
      question: { type: Schema.Types.ObjectId, ref: "Question" },
      userAnswer: { type: String },
    },
  ],
  score: { type: Number, default: 0 },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);
module.exports = QuizAttempt;
