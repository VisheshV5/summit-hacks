const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  question: { type: String },
  answer: { type: String },
  gameId: { type: Schema.Types.ObjectId, ref: "Quiz" },
  options: [String],
  percentageCorrect: { type: Number },
  isCorrect: { type: Boolean },
  questionType: {
    type: Schema.Types.ObjectId,
    ref: "GameType",
  },
  userAnswer: { type: String },
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
