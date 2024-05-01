import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Divider,
  FormControl,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Sparkles } from "lucide-react";
import React, { useState } from "react";
import "./Create.css";

const CreateCourseCard = () => {
  const [numChapters, setNumChapters] = useState(1);
  const [createType, setCreateType] = useState("ai");
  const [generating, setGenerating] = useState(false);
  const [subject, setSubject] = useState("");
  const [errors, setErrors] = useState({
    subject: "",
    difficulty: "",
    numChapters: "",
  });

  const handleSubjectChange = e => {
    setSubject(e.target.value);
    setErrors({ ...errors, subject: "" });
  };

  const handleNumChaptersChange = e => {
    setNumChapters(e.target.value);
    setErrors({ ...errors, numChapters: "" });
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
    }, 2000);
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", pt: "20px" }}>
      <Typography
        variant="h4"
        align="center"
        // mb={Boolean(errors.difficulty) ? -1 : 1}
      >
        Create a New Course
      </Typography>
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ px: 2 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <TextField
                label="Subject"
                variant="outlined"
                fullWidth
                // margin={Boolean(errors.difficulty) ? "normal" : "none"}
                value={subject}
                error={Boolean(errors.subject)}
                onChange={handleSubjectChange}
                helperText={
                  Boolean(errors.subject)
                    ? errors.subject
                    : "Be specific so that we can find the right course for you! e.g. instead of saying just 'Math', say 'Algebra'"
                }
              />
              <TextField
                label="Num Chapters"
                variant="outlined"
                fullWidth
                value={numChapters}
                type="number"
                margin={Boolean(errors.difficulty) ? "normal" : "none"}
                error={Boolean(errors.numChapters)}
                helperText={
                  Boolean(errors.numChapters)
                    ? errors.numChapters
                    : "Number of chapters for your course"
                }
                inputProps={{
                  min: 1,
                  style: { textAlign: "center" },
                }}
                onChange={handleNumChaptersChange}
                sx={{ width: "50%" }}
              />
            </Box>
            <Divider sx={{ my: 2 }} />
            <FormControl margin="normal" fullWidth>
              <ButtonGroup fullWidth>
                <Button
                  sx={{
                    display: "block",
                    textAlign: "center",
                    boxShadow: createType === "ai" ? 1 : 0,
                  }}
                  variant={createType === "ai" ? "contained" : "outlined"}
                  onClick={() => setCreateType("ai")}
                >
                  <Typography>&nbsp; Generate chapters with</Typography>
                  <Typography
                    className={createType === "ai" ? "selected" : "AItext"}
                    fontWeight={600}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Sparkles
                      color={
                        createType === "ai" ? "white" : "rgb(182, 243, 159)"
                      }
                      size={20}
                    />
                    Artificial Intelligence
                  </Typography>
                </Button>
                <Button
                  sx={{ boxShadow: createType === "own" ? 1 : 0 }}
                  variant={createType === "own" ? "contained" : "outlined"}
                  onClick={() => setCreateType("own")}
                >
                  <Typography fontSize="17px">
                    Create your own chapters
                  </Typography>
                </Button>
              </ButtonGroup>
            </FormControl>
            {generating && (
              <Stack sx={{ mt: 1 }}>
                <Skeleton sx={{ bgcolor: "rgba(182, 243, 159, 0.2)" }} />
                <Skeleton sx={{ bgcolor: "rgba(131, 212, 117, 0.2)" }} />
                <Skeleton
                  width="80%"
                  sx={{ bgcolor: "rgba(46, 182, 44, 0.2)" }}
                />
              </Stack>
            )}
            <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
              {createType === "ai" ? (
                <Button onClick={handleGenerate}>Generate</Button>
              ) : (
                <div></div>
              )}
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CreateCourseCard;
