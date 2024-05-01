import { Check, Delete, Search } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grow,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Pagination,
  Paper,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import Fuse from "fuse.js";
import {
  AlignJustify,
  BookA,
  CopyCheck,
  PencilLine,
  Share,
  Table,
} from "lucide-react";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TransitionGroup } from "react-transition-group";
import { setCurrentQuizzes } from "../../actions/quiz";
import { useSnackbar } from "../../common/components/SnackbarContext";
import noImage from "../../images/noImage.png";
import noResults from "../../images/noResults.png";
import searchImage from "../../images/search.png";
import { deleteQuiz, getAllQuizzes } from "../../services/quiz.service";

const LoadingCard = () => {
  return (
    <Card
      sx={{
        display: "flex",
        borderRadius: "15px",
        position: "relative",
        mb: 3,
      }}
    >
      <Skeleton
        sx={{ height: 190, width: 151 }}
        animation="wave"
        variant="rectangular"
      />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Box sx={{ width: 300 }}>
            <Typography component="div" variant="h4">
              <Skeleton />
            </Typography>
            <Typography component="div" variant="subtitle2">
              <Skeleton width="60%" />
            </Typography>
            <Typography
              variant="p"
              color="text.secondary"
              component="div"
              sx={{ mt: 1 }}
            >
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </Typography>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

const QuizList = () => {
  const { quizzes } = useSelector((state) => state.quiz);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const search = location?.search;

  const subjectFromUrl = search
    ? new URLSearchParams(search).get("subject")
    : null;

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(
    search ? `${subjectFromUrl} Quiz` : ""
  );
  const [style, setStyle] = useState("list");
  const [fuse, setFuse] = useState(null);
  const [delLoading, setDelLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [loading, setLoading] = useState(false);
  const quizzesPerPage = 3;

  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const myQuizzes = quizzes.filter((quiz) => quiz.user === user.id);

  const fetchQuizzes = async () => {
    setLoading(true);

    try {
      const quizData = await getAllQuizzes();

      dispatch(setCurrentQuizzes(quizData.quizzes));
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (myQuizzes.length > 0) {
      const options = {
        keys: ["description"],
        threshold: 0.4,
        ignoreLocation: true,
      };
      setFuse(new Fuse(myQuizzes, options));
    }
  }, [myQuizzes]);

  const handleDelete = async (quizId) => {
    if (confirmDelete === quizId) {
      setDelLoading(true);

      try {
        await deleteQuiz(quizId);
        const quizData = await getAllQuizzes();
        dispatch(setCurrentQuizzes(quizData.myQuizzes));
        setDelLoading(false);
        setConfirmDelete(null);
        snackbar.success("Quiz deleted successfully");
      } catch (error) {
        console.error(error);
        setDelLoading(false);
        setConfirmDelete(null);
      }
    } else {
      setConfirmDelete(quizId);
    }
  };

  const isQueryInUser = (user, query) => {
    const lowerCaseQuery = query.toLowerCase();

    for (let i = 0; i < lowerCaseQuery.length; i++) {
      if (!user.toLowerCase().includes(lowerCaseQuery[i])) {
        return false;
      }
    }
    return true;
  };

  const filteredQuizzes = searchTerm
    ? fuse?.search(searchTerm).map((result) => result.item)
    : myQuizzes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalPages = Math.ceil(filteredQuizzes?.length / quizzesPerPage);
  const currentQuizzes = filteredQuizzes?.slice(
    (page - 1) * quizzesPerPage,
    page * quizzesPerPage
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grow in>
          <Paper
            sx={{
              color: "white",
              backgroundColor: "#2f2f2f",
              // width: "90%",
              marginRight: "30px",
              marginTop: "10px",
              borderRadius: 4,
              padding: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h4">My Quizzes</Typography>
            </Box>
            <Divider sx={{ my: 2, mb: 3 }} />
            {!loading && (
              <TextField
                fullWidth
                label="Search"
                value={searchTerm}
                // color="dark"
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{ color: "lightgray" }}
                    >
                      <Search color="white" />
                    </InputAdornment>
                  ),
                }}
                sx={[
                  { input: { color: "white" } },
                  {
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "lightgray",
                      },
                      "&:hover fieldset": {
                        borderColor: "lightgray",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "lightgray",
                      },
                    },
                    "& label": {
                      color: "lightgray",
                    },
                    "& label.Mui-focused": {
                      color: "lightgray",
                    },
                    ".MuiFormHelperText-root": { color: "lightgray" },
                    ".MuiOutlinedInput-root.Mui-focused": {
                      borderColor: "lightgray",
                    },
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "lightgray",
                    },
                    caretColor: "lightgray",
                    marginBottom: 3,
                  },
                ]}
                helperText="Search by title, difficulty, or grade level"
              />
            )}
            {loading && (
              <>
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
              </>
            )}
            {!loading && (
              <TransitionGroup className="quiz-list">
                {currentQuizzes?.map((filteredQuiz, index) => (
                  <Grow key={filteredQuiz._id}>
                    <Card
                      sx={{
                        display: "flex",
                        borderRadius: "15px",
                        position: "relative",
                        mb: 3,
                        backgroundColor: "#2f2f2f",
                        boxShadow: 0,
                      }}
                    >
                      {window.innerWidth > 500 && (
                        <>
                          <CardMedia
                            component="img"
                            image={
                              filteredQuiz.image
                                ? filteredQuiz.image.url || noImage
                                : noImage
                            }
                            alt={filteredQuiz.description}
                            sx={{
                              width: 151,
                              color: "white",
                              height: "auto",
                              filter: "brightness(60%)",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              padding: "2px 6px",
                              borderRadius: "6px",
                              top: "10px",
                              left: "10px",
                              color: "black",
                              backgroundColor: "white",
                              boxShadow:
                                "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
                            }}
                          >
                            <Tooltip title="Multiple Choice Quiz">
                              <>
                                <CopyCheck color="black" size={20} />{" "}
                                {filteredQuiz.questions.length} q
                                {filteredQuiz.questions.length > 1 ? "'s" : ""}
                              </>
                            </Tooltip>
                          </Box>
                        </>
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          color: "white",
                        }}
                      >
                        <CardContent sx={{ flex: "1 0 auto" }}>
                          {/* <Link
                            sx={{
                              textDecoration: "none",
                              color: "white",
                            }}
                          > */}

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box
                              sx={{
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                width: "100%",
                                position: "relative",
                              }}
                            >
                              <Typography
                                onClick={() =>
                                  navigate(`/quiz/${filteredQuiz._id}`)
                                }
                                variant="h5"
                                sx={{
                                  color: "white",
                                  textDecoration: "none",
                                  textTransform: "capitalize",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  "&hover": { color: "black" },
                                }}
                              >
                                {
                                  filteredQuiz.description.match(
                                    /for\s+(.*?)\s+at/
                                  )[1]
                                }{" "}
                                Quiz{" "}
                              </Typography>
                              <Typography
                                gutterBottom
                                variant="subtitle1"
                                onClick={() =>
                                  navigate(`/quiz/${filteredQuiz._id}`)
                                }
                              >
                                {moment(filteredQuiz.createdAt).fromNow()}
                              </Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box sx={{ position: "relative" }}>
                                {confirmDelete === filteredQuiz._id ? (
                                  <Zoom in timeout={300}>
                                    <div className="confirmation-area">
                                      <IconButton
                                        onClick={() =>
                                          handleDelete(filteredQuiz._id)
                                        }
                                        disabled={delLoading}
                                      >
                                        <Check
                                          color={
                                            delLoading ? "disabled" : "success"
                                          }
                                        />
                                      </IconButton>
                                    </div>
                                  </Zoom>
                                ) : (
                                  <IconButton
                                    onClick={() =>
                                      handleDelete(filteredQuiz._id)
                                    }
                                    disabled={delLoading}
                                  >
                                    <Delete
                                      color={
                                        confirmDelete === filteredQuiz._id
                                          ? "disabled"
                                          : "error"
                                      }
                                    />
                                  </IconButton>
                                )}
                                {delLoading &&
                                  confirmDelete === filteredQuiz._id && (
                                    <CircularProgress
                                      size={30}
                                      color="secondary"
                                      sx={{
                                        position: "absolute",
                                        top: 5,
                                        left: 5,
                                        zIndex: 1,
                                      }}
                                    />
                                  )}
                              </Box>
                            </Box>
                          </Box>
                          {window.innerWidth <= 500 && (
                            <span style={{ height: "20px" }} />
                          )}
                          <Typography
                            // variant="body"
                            sx={{ fontSize: "13px", color: "white" }}
                            color="text.secondary"
                            component="div"
                            onClick={() =>
                              navigate(`/quiz/${filteredQuiz._id}`)
                            }
                            // sx={{ color: "white" }}
                          >
                            {filteredQuiz.description}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent:
                                window.innerWidth > 500 ? "end" : "center",
                              gap: 1,
                            }}
                          >
                            {/* <Tooltip title="Share quiz" arrow>
                              <IconButton
                                onClick={() =>
                                  handleShareClick(filteredQuiz._id)
                                }
                                size="small"
                                edge="end"
                              >
                                <Share />
                              </IconButton>
                            </Tooltip> */}
                          </Box>

                          {/* </Link> */}
                        </CardContent>
                      </Box>
                    </Card>
                  </Grow>
                ))}
              </TransitionGroup>
            )}
            {currentQuizzes?.length === 0 && !loading && (
              <Grow in>
                <img
                  src={noResults}
                  alt="No results found"
                  width={500}
                  style={{ marginTop: "-3rem" }}
                />
              </Grow>
            )}
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              {totalPages > 1 && (
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(event, value) => setPage(value)}
                  color={"standard"}
                  variant="outlined"
                  size="large"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "#fff",
                      border: "0.2px solid lightgrey",
                    },
                  }}
                />
              )}
            </Box>
          </Paper>
        </Grow>
      </Box>
    </>
  );
};

export default QuizList;
