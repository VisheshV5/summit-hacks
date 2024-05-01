import {
  CheckCircleOutlineRounded,
  HighlightOffOutlined,
  KeyboardArrowUp,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Divider,
  Fade,
  Grid,
  IconButton,
  ListItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import {
  Clock,
  FileQuestion,
  History,
  Home,
  SearchCheck,
  SearchX,
  Target,
  Trophy,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { setCurrentQuiz } from "../../actions/quiz";
import { getQuizById } from "../../services/quiz.service";
import ExplanationModal from "./ExplanationModal";

const Quiz = () => {
  const dispatch = useDispatch();
  const { currentQuiz } = useSelector((state) => state.quiz);
  const { quizId } = useParams();

  const [loading, setLoading] = useState(true);
  const [explLoading, setExplLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [clickedButtonIndex, setClickedButtonIndex] = useState(null);
  const [zoomOut, setZoomOut] = useState(false);
  const [questionOpenStates, setQuestionOpenStates] = useState({});
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [isExplanationModalOpen, setIsExplanationModalOpen] = useState(false);
  const [explanations, setExplanations] = useState([]);
  const [results, setResults] = useState(null);
  const [restarted, setRestarded] = useState(false);
  const [showIncorrectQuestions, setShowIncorrectQuestions] = useState(false);
  const [showCorrectQuestions, setShowCorrectQuestions] = useState(false);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);

  const handleToggleVisibility = (incorrect, correct) => {
    setShowIncorrectQuestions(incorrect);
    setShowCorrectQuestions(correct);
  };

  const handleShowIncorrectQuestions = () =>
    handleToggleVisibility(true, false);
  const handleShowCorrectQuestions = () => handleToggleVisibility(false, true);
  const handleShowAllQuestions = () => handleToggleVisibility(false, false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizData = await getQuizById(quizId);
        dispatch(setCurrentQuiz(quizData.quiz));
        setLoading(false);

        setTimeout(() => {
          if (quizData.quiz.questions.some((q) => q.userAnswer) && !restarted) {
            setSubmitted(true);
          }
        }, 200);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    fetchQuiz();
  }, [currentQuiz, quizId, submitted, dispatch]);

  const handleExplanationButtonClick = async () => {
    setExplLoading(true);

    try {
      if (!explanations || !explanations.length) {
        const response = await axios.post(
          `http://localhost:8080/api/quiz/explain/${quizId}`
        );
        setExplanations(response.data.explanations);
      }

      setExplLoading(false);
      console.log(explanations);
      setIsExplanationModalOpen(true);
    } catch (error) {
      console.error("Error fetching explanations:", error);
    }
  };

  const calculateElapsedTime = (time) => {
    if (time < 60) return `${time} seconds`;
    if (time < 3600)
      return `${Math.floor(time / 60)} minutes ${time % 60} seconds`;
    return `${Math.floor(time / 3600)} hours ${Math.floor(
      (time % 3600) / 60
    )} minutes`;
  };

  useEffect(() => {
    if (!submitted) {
      setTimeout(() => setTimer((prevTimer) => prevTimer + 1), 1000);
    }
  }, [timer, submitted]);

  useEffect(() => {
    if (submitted) {
      const updateQuestions = async () => {
        try {
          await axios.put(
            `http://localhost:8080/api/updateQuestions/${quizId}`,
            {
              questions: answeredQuestions,
              timeTaken: timer,
              score,
            }
          );
        } catch (error) {
          console.error("Error submitting answers:", error);
        }
      };

      const fetchExplanations = async () => {
        try {
          const quizData = await getQuizById(quizId);
          setExplanations(quizData.quiz.explanations);
        } catch (err) {
          console.log(err);
        }
      };

      fetchExplanations();

      if (!currentQuiz.questions.some((q) => q.userAnswer)) {
        setResults({
          selectedAnswers,
          timeTaken: timer,
          score,
        });
        updateQuestions();
      } else {
        const questions = currentQuiz.questions;
        const selectedAnswers = [];
        let score = 0;

        questions.forEach((question) => {
          const isCorrect = question.isCorrect;
          selectedAnswers.push({
            questionId: question._id,
            question: question.question,
            correctAnswer: question.answer,
            option: question.userAnswer,
            isCorrect,
          });

          if (isCorrect) score += 1;
        });

        setResults({
          selectedAnswers,
          timeTaken: currentQuiz.timeTaken,
          score,
        });
      }
    }
  }, [
    submitted,
    selectedAnswers,
    answeredQuestions,
    quizId,
    score,
    timer,
    currentQuiz.questions,
    currentQuiz.timeTaken,
  ]);

  if (loading) return <CircularProgress />;

  const { title, description, questions } = currentQuiz;
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = (option, index) => {
    const question = currentQuiz.questions[currentQuestionIndex];
    const isCorrect = option === question.answer;

    const isQuestionAlreadyAnswered = selectedAnswers.some(
      (answered) => answered.questionId === question._id
    );

    const answeredQuestion = {
      questionId: currentQuestion._id,
      isCorrect,
      userAnswer: option,
    };

    if (!isQuestionAlreadyAnswered) {
      setSelectedAnswers((prevSelectedAnswers) => [
        ...prevSelectedAnswers,
        {
          questionId: question._id,
          question: question.question,
          correctAnswer: question.answer,
          option,
          isCorrect,
        },
      ]);

      setScore((prevScore) => prevScore + (isCorrect ? 1 : 0));
      setAnsweredQuestions((prev) => [...prev, answeredQuestion]);
    }

    setClickedButtonIndex(index);

    setTimeout(() => setZoomOut(true), 500);

    setTimeout(() => {
      if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        setCurrentQuestionIndex((prevQuestionIndex) => prevQuestionIndex + 1);
        setClickedButtonIndex(null);
      } else {
        setSubmitted(true);
        setRestarded(false);
      }

      setZoomOut(false);
    }, 1000);
  };

  const handleCollapseToggle = (questionId) => {
    setQuestionOpenStates((prevStates) => ({
      ...prevStates,
      [questionId]: !prevStates[questionId],
    }));
  };

  return (
    <>
      {currentQuiz && !submitted && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            flexDirection: "column",
          }}
        >
          <Paper
            sx={{
              width: "80%",
              padding: 5,
              // marginTop: "20px",
              borderRadius: 4,
              color: "white",
              backgroundColor: "#2f2f2f",
            }}
          >
            <Typography variant="h4">{title}</Typography>
            <Typography variant="body1" color="white">
              {description}
            </Typography>
            <Divider sx={{ my: 2, borderColor: "lightgray" }} />
            <Fade in={!zoomOut} timeout={500}>
              <div style={{ marginBottom: "20px" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Stack>
                    <Typography variant="body2" color="white">
                      Question {currentQuestionIndex + 1}/{questions.length}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 2, color: "white" }}>
                      {currentQuestion.question}
                    </Typography>
                  </Stack>
                  <Box>
                    <Clock />
                    &nbsp;
                    {timer}
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  {currentQuestion.options.map((option, index) => {
                    const isCorrect =
                      clickedButtonIndex === index
                        ? clickedButtonIndex === index &&
                          currentQuiz.questions[currentQuestionIndex].answer ===
                            option
                        : "";

                    return (
                      <Grid key={index} item xs={6}>
                        <Button
                          variant="outlined"
                          size="large"
                          startIcon={
                            isCorrect ? (
                              <CheckCircleOutlineRounded fontSize="large" />
                            ) : clickedButtonIndex === index && !isCorrect ? (
                              <HighlightOffOutlined fontSize="large" />
                            ) : (
                              <RadioButtonUnchecked fontSize="large" />
                            )
                          }
                          sx={[
                            {
                              marginBottom: "10px",
                              width: "100%",
                              minHeight: "100%",
                              position: "relative",
                              border: "0.5px solid lightgray",
                              backgroundColor: "#181818",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "#2f2f2f",
                              },
                              "& .MuiButton-startIcon": {
                                position: "absolute",
                                left: 16,
                              },
                            },
                            isCorrect
                              ? {
                                  backgroundColor: "primary.light",
                                  borderColor: "green",
                                  color: "green",
                                  "&:hover": {
                                    backgroundColor: "primary.light",
                                    borderColor: "green",
                                    color: "green",
                                  },
                                }
                              : clickedButtonIndex === index && !isCorrect
                              ? {
                                  backgroundColor: "#ffc4c4",
                                  borderColor: "red",
                                  color: "red",
                                  "&:hover": {
                                    backgroundColor: "#ffc4c4",
                                    borderColor: "red",
                                    color: "red",
                                  },
                                }
                              : "",
                          ]}
                          onClick={() => handleAnswerClick(option, index)}
                        >
                          {clickedButtonIndex === index && isCorrect && (
                            <ConfettiExplosion
                              force={0.4}
                              duration={2200}
                              particleCount={30}
                              width={400}
                            />
                          )}
                          <Box width="85%">{option}</Box>
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>
              </div>
            </Fade>
          </Paper>
        </div>
      )}
      {submitted && results && (
        <div>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <Paper
              sx={{
                borderRadius: 4,
                width: "60vw",
                padding: 2,
                pt: 3,
                backgroundColor: "#2f2f2f",
                color: "white",
              }}
            >
              <Typography
                variant="h4"
                align="center"
                fontWeight={300}
                lineHeight={1.5}
              >
                Finished quiz for
              </Typography>
              <Typography
                variant="h5"
                align="center"
                sx={{
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              >
                {description.match(/for\s+(.*?)\s+at/)[1]}
              </Typography>
              <Box
                sx={{
                  p: 3,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Trophy strokeWidth="0.3px" size={150} />
              </Box>
              <Typography variant="h5" align="center" fontWeight={200} mb={1}>
                Score: {results.score}/{questions.length}
              </Typography>
            </Paper>
            <Stack spacing={3}>
              <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
                <Link to="/quizzes" style={{ textDecoration: "none" }}>
                  <Button variant="outlined" startIcon={<Home />}>
                    All Quizzes
                  </Button>
                </Link>
                <Button
                  startIcon={<History />}
                  sx={{
                    backgroundColor: "#12372A",
                    color: "white",
                    "&hover": { bgColor: "#12372A" },
                  }}
                >
                  Retake quiz
                </Button>
              </Box>
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 4,
                  width: "30vw",
                  padding: 3,
                  backgroundColor: "#2f2f2f",
                  color: "white",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h4">Accuracy</Typography>
                  <Target strokeWidth="0.7px" size={50} />
                </Box>
                <Divider sx={{ my: 2, mb: 3, borderColor: "lightgray" }} />
                <Typography fontSize="20px" fontWeight={300}>
                  Finished with&nbsp;
                  {((results.score / questions.length) * 100).toFixed(0)}%
                  accuracy
                </Typography>
              </Paper>
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 4,
                  width: "30vw",
                  padding: 3,
                  backgroundColor: "#2f2f2f",
                  color: "white",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h4">Time taken</Typography>
                  <Clock strokeWidth="0.7px" size={50} />
                </Box>
                <Divider sx={{ my: 2, mb: 3, borderColor: "lightgray" }} />
                <Typography fontSize="20px" fontWeight={300}>
                  Time taken:{" "}
                  {calculateElapsedTime(
                    results.timeTaken ? results.timeTaken : timer
                  )}
                </Typography>
              </Paper>
            </Stack>
          </Box>
          <Divider sx={{ my: 4 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
              pr: 5,
              pl: 5,
            }}
          >
            <div>
              <Button
                variant={showIncorrectQuestions ? "contained" : "outlined"}
                startIcon={<SearchX sx={{ color: "#ff8080" }} />}
                color="secondary"
                onClick={handleShowIncorrectQuestions}
                sx={[
                  {
                    marginRight: 2,
                    color: "#ff8080",
                    border: "1px solid #ff8080",
                  },
                ]}
              >
                Show Incorrect Questions
              </Button>
              <Button
                variant={showCorrectQuestions ? "contained" : "outlined"}
                startIcon={<SearchCheck />}
                color="primary"
                onClick={handleShowCorrectQuestions}
                sx={{
                  mr: 2,
                }}
              >
                Show Correct Questions
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleShowAllQuestions}
                sx={{
                  marginRight: 2,
                }}
              >
                Show All Questions
              </Button>
            </div>
            {results.score < questions.length && (
              <LoadingButton
                onClick={handleExplanationButtonClick}
                startIcon={<FileQuestion />}
                loadingPosition="start"
                loading={explLoading}
                variant="outlined"
              >
                <span>Explain Incorrect Questions</span>
              </LoadingButton>
            )}
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell align="left" sx={{ color: "lightgray" }}>
                    No. & Question
                  </TableCell>
                  <TableCell align="left" sx={{ color: "lightgray" }}>
                    Your answer
                  </TableCell>
                  <TableCell align="left" sx={{ color: "lightgray" }}>
                    Correct Answer
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.selectedAnswers.map((result, index) => {
                  const isIncorrect = !result.isCorrect;
                  const isCorrect = result.isCorrect;

                  if (
                    (showIncorrectQuestions && isIncorrect) ||
                    (showCorrectQuestions && isCorrect) ||
                    (!showIncorrectQuestions && !showCorrectQuestions)
                  ) {
                    return (
                      <>
                        <TableRow
                          hover
                          key={index}
                          sx={{
                            borderBottom: 0,
                            "& > *": {
                              borderBottom: questionOpenStates[
                                result.questionId
                              ]
                                ? "none"
                                : "unset",
                            },
                            boxShadow:
                              questionOpenStates[result.questionId] &&
                              "0 10px 8px -6px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleCollapseToggle(result.questionId)
                              }
                            >
                              <KeyboardArrowUp
                                sx={{
                                  color: "white",
                                  transform: questionOpenStates[
                                    result.questionId
                                  ]
                                    ? "rotate(0deg)"
                                    : "rotate(180deg)",
                                  transition: (theme) =>
                                    theme.transitions.create("transform", {
                                      duration:
                                        theme.transitions.duration.shortest,
                                    }),
                                }}
                              />
                            </IconButton>
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ color: "white" }}
                          >
                            <Typography variant="h6">
                              {result.question}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography
                              sx={{
                                color: result.isCorrect
                                  ? "green"
                                  : !result.isCorrect && "red",
                                fontWeight: 600,
                              }}
                            >
                              {result.option}
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              color: !result.isCorrect && "green",
                              fontWeight: 600,
                            }}
                          >
                            <Typography
                              sx={{ fontWeight: 600, color: "white" }}
                            >
                              {result.correctAnswer}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow
                          sx={{
                            "& > *": {
                              borderBottom:
                                !questionOpenStates[result.questionId] &&
                                "none",
                            },
                          }}
                        >
                          <TableCell
                            style={{ paddingTop: 0, paddingBottom: 0 }}
                            colSpan={6}
                          >
                            <Collapse
                              in={questionOpenStates[result.questionId]}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box sx={{ margin: 1, my: 3 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: "20px",
                                      height: "20px",
                                      borderRadius: 1,
                                      bgcolor: "green",
                                    }}
                                  />{" "}
                                  &nbsp;{" "}
                                  <span style={{ color: "white" }}>
                                    = Correct answer&nbsp;
                                  </span>
                                  <strong style={{ color: "white" }}>
                                    {result.isCorrect && "(Your answer)"}
                                  </strong>
                                  {!result.isCorrect && (
                                    <>
                                      <Divider
                                        flexItem
                                        orientation="vertical"
                                        sx={{
                                          mx: 2,
                                          borderColor: "white",
                                        }}
                                      />
                                      <Box
                                        sx={{
                                          width: "20px",
                                          height: "20px",
                                          borderRadius: 1,
                                          bgcolor: "#ff8080",
                                        }}
                                      />{" "}
                                      &nbsp;
                                      <span style={{ color: "white" }}>
                                        {" "}
                                        = Wrong answer&nbsp;
                                      </span>
                                      <strong style={{ color: "white" }}>
                                        (Your answer)
                                      </strong>
                                    </>
                                  )}
                                  <Divider
                                    flexItem
                                    orientation="vertical"
                                    sx={{
                                      mx: 2,
                                      borderColor: "white",
                                    }}
                                  />
                                  <Box
                                    sx={{
                                      width: "20px",
                                      height: "20px",
                                      borderRadius: 1,
                                      border: "1px solid white",
                                      bgcolor: "lightgray",
                                    }}
                                  />{" "}
                                  &nbsp;{" "}
                                  <span style={{ color: "white" }}>
                                    = Other options&nbsp;
                                  </span>
                                </Box>
                                <br />
                                <Typography
                                  variant="h6"
                                  mb={1}
                                  sx={{ color: "white" }}
                                >
                                  {result.question}
                                </Typography>
                                {currentQuiz.questions
                                  .find((q) => q._id === result.questionId)
                                  .options.map((option, i) => {
                                    const color = result.isCorrect
                                      ? option === result.option
                                        ? "green"
                                        : "white"
                                      : option === result.option
                                      ? "red"
                                      : option === result.correctAnswer
                                      ? "green"
                                      : "lightgray";

                                    return (
                                      <ListItem key={i}>
                                        <Box
                                          sx={{
                                            mr: 1,
                                            width: "20px",
                                            height: "20px",
                                            borderRadius: 1,
                                            bgcolor: color,
                                            border:
                                              option !== result.option &&
                                              option !== result.correctAnswer &&
                                              "1px solid black",
                                          }}
                                        />
                                        &nbsp;
                                        <Typography sx={{ color: color }}>
                                          {option}
                                        </Typography>
                                      </ListItem>
                                    );
                                  })}
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  }

                  return null;
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
      <ExplanationModal
        isOpen={isExplanationModalOpen}
        handleClose={() => setIsExplanationModalOpen(false)}
        explanations={explanations}
        questions={currentQuiz.questions}
        results={results}
      />
    </>
  );
};

export default Quiz;
