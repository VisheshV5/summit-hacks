import { Close } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Fade,
  Grid,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";

const PaperComponent = (props) => {
  return (
    <Draggable handle="#handle" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
};

export default function ExplanationModal({
  isOpen,
  handleClose,
  explanations,
  questions,
  results,
}) {
  const firstIncorrectIndex =
    results && results.selectedAnswers.findIndex((result) => !result.isCorrect);

  const [selectedQuestion, setSelectedQuestion] = useState(firstIncorrectIndex);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const result = results && results.selectedAnswers[selectedQuestion];

  useEffect(() => {
    setSelectedQuestion(firstIncorrectIndex);
  }, [firstIncorrectIndex]);

  const handleQuestionClick = (index) => {
    setIsContentVisible(false);
    setTimeout(() => {
      const selectedQuestionIndex = firstIncorrectIndex + index;

      setSelectedQuestion(selectedQuestionIndex);
      setIsContentVisible(true);
    }, 200);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle sx={{ m: 0, p: 2, cursor: "move" }} id="handle">
        Explanation for incorrect answers
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 15,
          top: 15,
        }}
      >
        <Close />
      </IconButton>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {explanations.map((explanation, index) => {
              return (
                <ListItem
                  key={index}
                  disablePadding
                  sx={{
                    borderBottom: (theme) =>
                      `1px solid ${theme.palette.divider}`,
                    "&:last-child": { borderBottom: 0 },
                  }}
                >
                  <ListItemButton onClick={() => handleQuestionClick(index)}>
                    <Stack>
                      <ListItemText
                        primary={
                          <Typography
                            fontSize="18px"
                            color="black"
                            gutterBottom
                          >
                            <Typography
                              component="span"
                              fontSize="18px"
                              fontWeight={600}
                            >
                              Question {firstIncorrectIndex + index+1}:
                            </Typography>{" "}
                            {explanation.question}
                          </Typography>
                        }
                      />
                      <Typography variant="body2">
                        {explanation.explanation}
                      </Typography>
                    </Stack>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Grid>
          <Divider
            variant="middle"
            orientation="vertical"
            sx={{ mx: 2, ml: 4 }}
            flexItem
          />
          {result && (
            <Fade in={isContentVisible} timeout={200}>
              <Grid item xs={5}>
                <Typography variant="h6" mb={1}>
                  {result.question}
                </Typography>
                {questions
                  .find((q) => q._id === result.questionId)
                  .options.map((option, i) => {
                    const color = result.isCorrect
                      ? option === result.option
                        ? "green"
                        : "inherit"
                      : option === result.option
                      ? "red"
                      : option === result.correctAnswer
                      ? "green"
                      : "inherit";

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
                              option !== selectedQuestion.option &&
                              option !== selectedQuestion.correctAnswer &&
                              "1px solid black",
                          }}
                        />
                        &nbsp;
                        <Typography sx={{ color: color }}>{option}</Typography>
                      </ListItem>
                    );
                  })}
              </Grid>
            </Fade>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
