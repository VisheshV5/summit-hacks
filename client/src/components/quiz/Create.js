import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createQuiz } from "../../actions/quiz";
import LoadingDots from "../../common/components/LoadingText";
import loadingImage from "../../images/loading.gif";

const educationLevels = [
  "Preschool",
  "Kindergarten",
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
  "4th Grade",
  "5th Grade",
  "6th Grade",
  "7th Grade",
  "8th Grade",
  "9th Grade (Freshman)",
  "10th Grade (Sophomore)",
  "11th Grade (Junior)",
  "12th Grade (Senior)",
  "College/University (Undergraduate)",
  "Graduate School (Master's)",
  "Graduate School (Doctorate/Ph.D.)",
  "Medical School",
  "Law School",
  "Business School",
  "Engineering School",
  "Nursing School",
  "Dental School",
  "Pharmacy School",
  "Veterinary School",
  "Pre-Med",
  "Pre-Law",
  "Pre-Business",
  "Pre-Engineering",
  "Pre-Nursing",
  "Pre-Dental",
  "Pre-Pharmacy",
  "Pre-Veterinary",
];

const loadingTexts = [
  "Creating quiz, please wait",
  "Generating questions",
  "Compiling quiz data",
  "Fetching additional resources",
  "Preparing quiz for you",
  "Almost there, just a moment",
];

const CreateQuizCard = () => {
  const { user } = useSelector(state => state.auth);
  const { loading, finished } = useSelector(state => state.quiz);
  const dispatch = useDispatch();
  const history = useNavigate();

  const [difficulty, setDifficulty] = useState("");
  const [numQuestions, setNumQuestions] = useState(1);
  const [gradeLevel, setGradeLevel] = useState(educationLevels[0]);
  const [gameType, setGameType] = useState("mcq");
  const [subject, setSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState(loadingTexts[0]);
  const [errors, setErrors] = useState({
    subject: "",
    difficulty: "",
    numQuestions: "",
  });

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (finished) return 100;
          if (prev === 100) {
            return 0;
          }
          if (Math.random() < 0.1) {
            return prev + 2;
          }
          return prev + 0.5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [finished, isLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      let randomIndex = Math.floor(Math.random() * loadingTexts.length);
      setLoadingText(loadingTexts[randomIndex]);
    }, 2000);
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  const handleSubjectChange = e => {
    setSubject(e.target.value);
    setErrors({ ...errors, subject: "" });
  };

  const handleNumQuestionsChange = e => {
    setNumQuestions(e.target.value);
    setErrors({ ...errors, numQuestions: "" });
  };

  const handleDifficultyChange = e => {
    setDifficulty(e.target.value);
    setErrors({ ...errors, difficulty: "" });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      subject: "",
      difficulty: "",
      numQuestions: "",
    };

    if (!subject.trim()) {
      newErrors.subject = "Subject is required";
      isValid = false;
    }

    if (!difficulty) {
      newErrors.difficulty = "Difficulty is required";
      isValid = false;
    }

    if (numQuestions < 1) {
      newErrors.numQuestions = "Must be ≥ 1";
      isValid = false;
    }

    setErrors({ ...errors, ...newErrors });
    return isValid;
  };

  const handleCreateQuiz = async () => {
    const isValid = validateForm();

    if (isValid) {
      setIsLoading(true);

      try {
        const createdQuiz = await dispatch(
          createQuiz(user.id, {
            grade_level: gradeLevel,
            game_type: gameType,
            num: numQuestions,
            difficulty,
            subject,
          })
        );

        setIsLoading(true);
        setLoadingProgress(0);
        const interval = setInterval(() => {
          clearInterval(interval);
          setIsLoading(false);
          history(`/quiz/${createdQuiz}`);
        }, 1000);
      } catch (error) {
        console.error(error);

        setIsLoading(false);
        setLoadingProgress(0);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <Box sx={{ p: 2, margin: "auto", width: "80%" }}>
          <>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <img src={loadingImage} width={400} height={400} alt="loading" />
            </Box>
            <LinearProgress variant="determinate" value={loadingProgress} />
            <Typography variant="h4" align="center" mt={4}>
              <LoadingDots text={loadingText} />
            </Typography>
          </>
        </Box>
      ) : (
        <Card sx={{ maxWidth: 500, margin: "auto", pt: "20px" }}>
          <Typography
            variant="h4"
            align="center"
            mb={Boolean(errors.difficulty) ? -1 : 1}
          >
            Create a New Quiz
          </Typography>
          <CardContent>
            <Stack spacing={2}>
              <Box sx={{ px: 2 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <TextField
                    label="Subject"
                    variant="outlined"
                    fullWidth
                    margin={Boolean(errors.difficulty) ? "normal" : "none"}
                    value={subject}
                    error={Boolean(errors.subject)}
                    onChange={handleSubjectChange}
                    helperText={
                      Boolean(errors.subject)
                        ? errors.subject
                        : "Type any topic that you want to be quizzed on"
                    }
                  />
                  <TextField
                    label="Num Q's"
                    variant="outlined"
                    fullWidth
                    value={numQuestions}
                    type="number"
                    margin={Boolean(errors.difficulty) ? "normal" : "none"}
                    error={Boolean(errors.numQuestions)}
                    helperText={errors.numQuestions}
                    inputProps={{
                      min: 1,
                      style: { textAlign: "center" },
                    }}
                    onChange={handleNumQuestionsChange}
                    sx={{ width: "30%" }}
                  />
                </Box>
                <FormControl
                  fullWidth
                  variant="outlined"
                  margin={Boolean(errors.difficulty) ? "dense" : "normal"}
                  error={Boolean(errors.difficulty)}
                >
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={difficulty}
                    onChange={handleDifficultyChange}
                    label="Difficulty"
                  >
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                  </Select>
                  {Boolean(errors.difficulty) && (
                    <FormHelperText>{errors.difficulty}</FormHelperText>
                  )}
                </FormControl>
                <FormControl
                  fullWidth
                  variant="outlined"
                  margin="normal"
                >
                  <Autocomplete
                    options={educationLevels}
                    value={gradeLevel}
                    onChange={(event, newValue) => setGradeLevel(newValue)}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Grade Level"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </FormControl>
                <FormControl margin="normal" fullWidth>
                  <ButtonGroup fullWidth>
                    <Button
                      sx={{
                        boxShadow: gameType === "mcq" ? 1 : 0,
                      }}
                      variant={gameType === "mcq" ? "contained" : "outlined"}
                      onClick={() => setGameType("mcq")}
                    >
                      Multiple choice
                    </Button>
                    <Button
                      sx={{ boxShadow: gameType === "open_ended" ? 1 : 0 }}
                      variant={
                        gameType === "open_ended" ? "contained" : "outlined"
                      }
                      onClick={() => setGameType("open_ended")}
                    >
                      Open ended
                    </Button>
                  </ButtonGroup>
                </FormControl>
              </Box>
            </Stack>
          </CardContent>
          <Divider />
          <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateQuiz}
              disabled={isLoading}
            >
              Create Quiz
            </Button>
          </Box>
        </Card>
      )}
    </>
  );
};

export default CreateQuizCard;
