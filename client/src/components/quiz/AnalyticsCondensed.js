import {
  Button,
  CircularProgress,
  Collapse,
  Grow,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Pagination,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { setCurrentQuizzes } from "../../actions/quiz";
import { getAllQuizzes } from "../../services/quiz.service";
import "./Analytics.css";

import { Search } from "@mui/icons-material";
import { Box, Divider, Grid, Tooltip } from "@mui/material";
import { Chart, registerables } from "chart.js";
import {
  BookCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Frown,
  HelpCircle,
  Smile,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ExpandMore } from "../../common/components/ExpandMore";

Chart.register(...registerables);
Chart.defaults.font.family = "Poppins";

const StatsCard = ({ title, subtitle, icon, children }) => {
  return (
    <Grow in>
      <Box
        sx={{
          borderRadius: "12px",
          p: 2,
          backgroundColor: "#2f2f2f",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Typography variant="h5" fontWeight={300}>
              {title}
            </Typography>
            {subtitle && <Typography fontWeight={200}>{subtitle}</Typography>}
          </div>
          {icon}
        </Box>
        <Divider sx={{ my: 2 }} />
        {children}
      </Box>
    </Grow>
  );
};

export default function AnalyticsCondensed() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { loading, quizzes: allQuizzes } = useSelector((state) => state.quiz);

  const [sliderRef, setSliderRef] = useState(null);
  const [correctPage, setCorrectPage] = useState(1);
  const [incorrectPage, setIncorrectPage] = useState(1);
  const [correctSearchTerm, setCorrectSearchTerm] = useState("");
  const [incorrectSearchTerm, setIncorrectSearchTerm] = useState("");
  const rowsPerPage = 5;

  const quizzes = allQuizzes.filter((quiz) => quiz.user === user.id);

  const handleCorrectPageChange = (_, newPage) => {
    setCorrectPage(newPage);
  };

  const handleIncorrectPageChange = (_, newPage) => {
    setIncorrectPage(newPage);
  };

  const handleCorrectSearchChange = (event) => {
    setCorrectSearchTerm(event.target.value);
    setCorrectPage(1);
  };

  const handleIncorrectSearchChange = (event) => {
    setIncorrectSearchTerm(event.target.value);
    setIncorrectPage(1);
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizData = await getAllQuizzes();
        dispatch(setCurrentQuizzes(quizData.quizzes));
        console.log(quizData.quizzes);
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuizzes();
  }, [dispatch]);

  const calculateAverageAccuracy = (quizzesByCategory) => {
    const averages = {};
    Object.keys(quizzesByCategory).forEach((category, index) => {
      const correctQuestions = [];
      const incorrectQuestions = [];

      const totalQuestions = quizzesByCategory[category].reduce(
        (sum, quiz) => sum + quiz.questions.length,
        0
      );
      const totalCorrectAnswers = quizzesByCategory[category].reduce(
        (sum, quiz) => sum + quiz.score,
        0
      );
      const totalQuizzes = quizzesByCategory[category].length;
      const monthlyQuizCount = quizzesByCategory[category].reduce(
        (acc, quiz) => {
          const createdAt = new Date(quiz.createdAt);
          const monthYear = `${createdAt.toLocaleString("en-US", {
            month: "long",
          })} `;
          acc[monthYear] = (acc[monthYear] || 0) + 1;
          return acc;
        },
        {}
      );

      const allMonths = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(2023, i, 1);
        return date.toLocaleString("en-US", { month: "long" });
      });

      const labels = allMonths.map((month) => month + " ");
      const data = labels.map((label) => monthlyQuizCount[label] || 0);
      const totalTimeTaken = quizzesByCategory[category].reduce(
        (sum, quiz) => sum + quiz.timeTaken,
        0
      );
      const averageAccuracy = totalCorrectAnswers / totalQuestions || 0;
      const averageTimeTaken =
        totalQuizzes > 0 ? (totalTimeTaken / totalQuizzes).toFixed(0) : 0;
      const maxScore = Math.max(
        ...quizzesByCategory[category].map((quiz) => quiz.score)
      );
      const minScore = Math.min(
        ...quizzesByCategory[category].map((quiz) => quiz.score)
      );
      const minQuestionsLength =
        quizzesByCategory[category].find((quiz) => quiz.score === minScore)
          ?.questions.length || 0;
      const maxQuestionsLength =
        quizzesByCategory[category].find((quiz) => quiz.score === maxScore)
          ?.questions.length || 0;

      const minScoreString = `${minScore}/${minQuestionsLength}`;
      const maxScoreString = `${maxScore}/${maxQuestionsLength}`;

      let accuracyImprovement = 0;
      if (index > 0) {
        const prevAccuracy =
          quizzesByCategory[Object.keys(quizzesByCategory)[index - 1]].reduce(
            (sum, quiz) => sum + quiz.score,
            0
          ) /
          quizzesByCategory[Object.keys(quizzesByCategory)[index - 1]].reduce(
            (sum, quiz) => sum + quiz.questions.length,
            0
          );
        accuracyImprovement = (averageAccuracy - prevAccuracy) * 100;
      }

      quizzesByCategory[category].forEach((quiz) => {
        const correctQuestionsInQuiz = quiz.questions.filter(
          (question) => question.isCorrect
        );
        const incorrectQuestionsInQuiz = quiz.questions.filter(
          (question) => !question.isCorrect
        );

        correctQuestions.push(...correctQuestionsInQuiz);
        incorrectQuestions.push(...incorrectQuestionsInQuiz);
      });

      averages[category] = {
        accuracy: (averageAccuracy * 100).toFixed(0),
        accuracyImprovement: accuracyImprovement.toFixed(0),
        totalQuizzes,
        averageTimeTaken,
        labels,
        data,
        correctQuestions,
        incorrectQuestions,
        maxScore: maxScoreString,
        minScore: minScoreString,
        min: minScore,
        max: maxScore,
      };
    });
    return averages;
  };

  const filterQuizzesByCategory = () => {
    return quizzes.reduce((acc, quiz) => {
      const subject = quiz.description.match(/for\s+(.*?)\s+at/)[1];
      acc[subject] = acc[subject] || [];
      acc[subject].push(quiz);
      return acc;
    }, {});
  };

  const filteredQuizzes = filterQuizzesByCategory();
  const averageAccuracy = calculateAverageAccuracy(filteredQuizzes);

  const sliderSettings = {
    arrows: false,
    infinte: false,
    swipe: false,
    speed: 500,
    slidesToShow: 1,
    swipeToSlide: false,
    slidesToScroll: 1,
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <div>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* {Object.keys(averageAccuracy).map((subject) => (
            <Slide in direction="right">
              <Typography
                variant="h3"
                component="div"
                textTransform="capitalize"
                alignItems="center"
                fontWeight={300}
              >
                Current subject: <strong>{subject}</strong>
              </Typography>
            </Slide>
          ))} */}
          {/* <Slide in direction="left">
            <Box sx={{ display: "flex", gap: 3 }}>
              <Button
                startIcon={<ChevronLeft />}
                variant="outlined"
                onClick={sliderRef?.slickPrev}
              >
                Previous slide
              </Button>
              <Button
                endIcon={<ChevronRight />}
                variant="outlined"
                onClick={sliderRef?.slickNext}
              >
                Next slide
              </Button>
            </Box>
          </Slide> */}
        </Box>
        {/* <Divider sx={{ my: 4, mb: 3 }} /> */}

        <div>
          <Slider ref={setSliderRef} {...sliderSettings}>
            <Box sx={{ width: "10%" }}>
              {Object.keys(averageAccuracy).map((subject) => (
                <>
                  <h1 style={{ marginTop: 50 }}>{subject} Quiz</h1>
                  <Grid
                    key={subject}
                    container
                    spacing={4}
                    justifyContent="center"
                    sx={{ px: 1 }}
                  >
                    <Grid item xs={4}>
                      <StatsCard
                        title="Accuracy"
                        subtitle="Averaged from all tests"
                        icon={<Target strokeWidth="1px" />}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "start", gap: 2 }}
                        >
                          <Typography variant="h4">
                            {averageAccuracy[subject].accuracy}%
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            {averageAccuracy[subject].accuracyImprovement >=
                              0 && "+"}
                            {averageAccuracy[subject].accuracyImprovement}%{" "}
                            <Tooltip
                              arrow
                              title="Accuracy improvement from previous quiz"
                            >
                              <HelpCircle strokeWidth="1px" size={18} />
                            </Tooltip>
                          </Box>
                        </Box>
                      </StatsCard>
                    </Grid>
                    <Grid item xs={4}>
                      <StatsCard
                        title="Quizzes"
                        subtitle="Total # of quizzes taken"
                        icon={<BookCheck strokeWidth="1px" />}
                      >
                        <Typography variant="h4">
                          {averageAccuracy[subject].totalQuizzes} quiz
                          {averageAccuracy[subject].totalQuizzes > 1
                            ? "zes"
                            : ""}
                        </Typography>
                      </StatsCard>
                    </Grid>
                    <Grid item xs={4}>
                      <StatsCard
                        title="Time taken"
                        subtitle="Average time per quiz"
                        icon={<Clock strokeWidth="1px" />}
                      >
                        <Typography variant="h4">
                          {averageAccuracy[subject].averageTimeTaken} seconds
                        </Typography>
                      </StatsCard>
                    </Grid>
                    <br />
                    <Grid item xs={8}>
                      <Grow in>
                        <Box
                          sx={{
                            height: "auto",
                            borderRadius: "12px",
                            backgroundColor: "#2f2f2f",
                            p: 3,
                          }}
                        >
                          <Typography variant="h4">
                            Quizzes taken by month
                          </Typography>
                          <br />
                          <Bar
                            data={{
                              labels: averageAccuracy[subject].labels,
                              datasets: [
                                {
                                  label: "Number of Quizzes",
                                  data: averageAccuracy[subject].data,
                                  backgroundColor: "#7ab3ef",
                                  borderColor: "#368ce7",
                                  borderWidth: 1,
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              elements: {
                                bar: {
                                  borderWidth: 2,
                                  borderRadius: 5,
                                },
                              },
                              plugins: {
                                legend: {
                                  display: false,
                                },
                              },
                              scales: {
                                y: {
                                  beginAtZero: true,
                                  title: {
                                    display: true,
                                    text: "Number of quizzes",
                                  },
                                },
                              },
                            }}
                          />
                        </Box>
                      </Grow>
                    </Grid>
                    <Grid item xs={4}>
                      <Grow in>
                        <Typography variant="h4" textAlign="center">
                          Max and min scores
                        </Typography>
                      </Grow>
                      <Divider
                        sx={{ mt: 2, mb: 4, border: "1px solid lightgray" }}
                      />
                      <StatsCard
                        title="Highest score"
                        icon={<Smile strokeWidth="1.3px" />}
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          {averageAccuracy[subject].maxScore}
                          <Button
                            variant="outlined"
                            onClick={() =>
                              navigate(
                                "/quiz/" +
                                  filteredQuizzes[subject].find(
                                    (quiz) =>
                                      quiz.score ===
                                      averageAccuracy[subject].max
                                  )?._id
                              )
                            }
                          >
                            View Questions
                          </Button>
                        </Typography>
                      </StatsCard>
                      <br />
                      <StatsCard
                        title="Lowest score"
                        icon={<Frown strokeWidth="1.3px" />}
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          {averageAccuracy[subject].minScore}
                          <Button
                            variant="outlined"
                            onClick={() =>
                              navigate(
                                "/quiz/" +
                                  filteredQuizzes[subject].find(
                                    (quiz) =>
                                      quiz.score ===
                                      averageAccuracy[subject].min
                                  )?._id
                              )
                            }
                          >
                            View Questions
                          </Button>
                        </Typography>
                      </StatsCard>
                    </Grid>
                    {/* <Grid item xs={6}>
                    {averageAccuracy[subject].correctQuestions.length > 0 && (
                      <Box
                        sx={{
                          p: 3,
                          mt: 2,
                          boxShadow: 2,
                          borderRadius: "12px",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                          }}
                        >
                          <ExpandMore
                            expand={cExpanded}
                            onClick={() => setCExpanded(!cExpanded)}
                          >
                            <ChevronDown color="black" />
                          </ExpandMore>
                          <Typography variant="h6">
                            Correct Questions:
                          </Typography>
                        </Box>
                        <Collapse in={cExpanded} timeout="auto">
                          <Box>
                            <TextField
                              label="Search"
                              variant="outlined"
                              value={correctSearchTerm}
                              onChange={handleCorrectSearchChange}
                              fullWidth
                              margin="normal"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Search />
                                  </InputAdornment>
                                ),
                              }}
                            />
                            <List>
                              {averageAccuracy[subject].correctQuestions
                                .filter((question) =>
                                  question.question
                                    .toLowerCase()
                                    .includes(correctSearchTerm.toLowerCase())
                                )
                                .slice(
                                  (correctPage - 1) * rowsPerPage,
                                  correctPage * rowsPerPage
                                )
                                .map((question, index) => (
                                  <div key={index}>
                                    <ListItem>
                                      <ListItemText
                                        primary={question.question}
                                        secondary={`Your Answer: ${
                                          question.userAnswer
                                        }, Correct Answer: ${question.options.find(
                                          (option) => option === question.answer
                                        )}`}
                                      />
                                    </ListItem>
                                    <Divider />
                                  </div>
                                ))}
                            </List>
                            <Pagination
                              count={Math.ceil(
                                averageAccuracy[subject].correctQuestions
                                  .length / rowsPerPage
                              )}
                              page={correctPage}
                              onChange={handleCorrectPageChange}
                            />
                          </Box>
                        </Collapse>
                      </Box>
                    )}
                    {averageAccuracy[subject].incorrectQuestions.length > 0 && (
                      <Box
                        sx={{
                          p: 3,
                          mt: 2,
                          boxShadow: 2,
                          borderRadius: "12px",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                          }}
                        >
                          <ExpandMore
                            expand={iExpanded}
                            onClick={() => setIExpanded(!iExpanded)}
                          >
                            <ChevronDown color="black" />
                          </ExpandMore>
                          <Typography variant="h6">
                            Incorrect Questions:
                          </Typography>
                        </Box>
                        <Collapse in={iExpanded} timeout="auto">
                          <Box>
                            <TextField
                              label="Search"
                              variant="outlined"
                              value={incorrectSearchTerm}
                              onChange={handleIncorrectSearchChange}
                              fullWidth
                              margin="normal"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Search />
                                  </InputAdornment>
                                ),
                              }}
                            />
                            <List>
                              {averageAccuracy[subject].incorrectQuestions
                                .filter((question) =>
                                  question.question
                                    .toLowerCase()
                                    .includes(incorrectSearchTerm.toLowerCase())
                                )
                                .slice(
                                  (incorrectPage - 1) * rowsPerPage,
                                  incorrectPage * rowsPerPage
                                )
                                .map((question, index) => (
                                  <div key={index}>
                                    <ListItem>
                                      <ListItemText
                                        primary={question.question}
                                        secondary={`Your Answer: ${
                                          question.userAnswer
                                        }, Correct Answer: ${question.options.find(
                                          (option) => option === question.answer
                                        )}`}
                                      />
                                    </ListItem>
                                    <Divider />
                                  </div>
                                ))}
                            </List>
                            <Pagination
                              count={Math.ceil(
                                averageAccuracy[subject].incorrectQuestions
                                  .length / rowsPerPage
                              )}
                              page={incorrectPage}
                              onChange={handleIncorrectPageChange}
                            />
                          </Box>
                        </Collapse>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        height: "auto",
                        p: 4,
                        boxShadow: 2,
                        borderRadius: "12px",
                        mt: 2,
                      }}
                    >
                      <Typography variant="h4" align="center">
                        Correct vs Incorrect Answers
                      </Typography>
                      <br />
                      <Pie
                        data={{
                          labels: ["Correct Answers", "Incorrect Answers"],
                          datasets: [
                            {
                              data: [
                                averageAccuracy[subject].correctQuestions
                                  .length,
                                averageAccuracy[subject].incorrectQuestions
                                  .length,
                              ],
                              backgroundColor: ["#50c13c", "#ff6767"],
                              hoverOffset: 4,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                        }}
                      />
                    </Box>
                  </Grid>*/}
                  </Grid>
                </>
              ))}
            </Box>
          </Slider>
        </div>
      </div>
    </>
  );
}
