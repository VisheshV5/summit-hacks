const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quizSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  gametype: { type: Schema.Types.ObjectId, ref: "GameType", required: true },
  questions: [
    {
      question: { type: String },
      answer: { type: String },
      options: [String],
      isCorrect: { type: Boolean, default: false },
      userAnswer: { type: String },
    },
  ],
  explanations: [
    {
      question: String,
      explanation: String,
    },
  ],
  gradeLevel: { type: String },
  score: { type: Number },
  timeTaken: { type: Number, default: 0 },
  image: {
    public_id: { type: String },
    url: { type: String },
  },
  user: { type: String },
});

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
