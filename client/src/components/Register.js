import React, { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Grow,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  Key,
  SendRounded,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { register, resetPasswordRequest } from "../actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../common/components/SnackbarContext";
import img from "../images/registerImg.png";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [resetError, setResetError] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({
    fName: "",
    lName: "",
    password: "",
    email: "",
    resetEmail: "",
    username: "",
  });
  const { message } = useSelector((state) => state.message);
  const snackbar = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const onChangeFName = (e) => {
    const fName = e.target.value;
    setFName(fName);
    setErrors({ ...errors, fName: "" });
    setDisabled(false);
  };

  const onChangeLName = (e) => {
    const lName = e.target.value;
    setLName(lName);
    setErrors({ ...errors, lName: "" });
    setDisabled(false);
  };

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
    setErrors({ ...errors, username: "" });
    setDisabled(false);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
    setErrors({ ...errors, email: "" });
    setDisabled(false);

    if (!validateEmail(email)) {
      setErrors({ ...errors, email: "Invalid email address" });
    }
  };

  const onChangeResetEmail = (e) => {
    const email = e.target.value;
    setResetEmail(email);
    setErrors({ ...errors, resetEmail: "" });
    setResetError(false);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (value) => {
    const newErrors = {};
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!passwordRegex.test(value)) {
      if (!/(?=.*[A-Za-z])/.test(value)) {
        newErrors.password =
          "Password must contain at least one letter (a-z or A-Z)";
      } else if (!/(?=.*\d)/.test(value)) {
        newErrors.password = "Password must contain at least one digit (0-9)";
      } else if (!/(?=.*[@$!%*?&])/.test(value)) {
        newErrors.password =
          "Password must contain at least one special character (@$!%*?&)";
      } else if (value.length < 6) {
        newErrors.password = "Password must have at least 6 characters";
      }
    } else {
      newErrors.password = "";
    }

    setErrors({ ...errors, ...newErrors });

    return Object.keys(newErrors).length === 0;
  };

  const onChangePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
    setDisabled(false);
    if (value.length === 0) {
      setErrors({ ...errors, password: "" });
    } else {
      validatePassword(value);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    const newErrors = {};

    if (!fName) {
      newErrors.fName = "Required";
    }

    if (!lName) {
      newErrors.lName = "Required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    }

    if (!username) {
      newErrors.username = "Username is required";
    }

    setErrors({ ...errors, ...newErrors });

    if (Object.keys(newErrors).length === 0 && validateEmail(email)) {
      dispatch(register(fName, lName, username, email, password))
        .then(() => {
          navigate("/login");
          snackbar.success(
            "Registration Successful! Please check your email for verification"
          );
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setResetLoading(true);

    if (resetEmail) {
      dispatch(resetPasswordRequest(resetEmail))
        .then(() => {
          setResetLoading(false);
          handleClose();

          setResetEmail("");
          snackbar.success(
            "Password reset email sent. Check your email for instructions."
          );
        })
        .catch(() => {
          setResetLoading(false);
          setResetError(true);
        });
    } else {
      setErrors({ ...errors, resetEmail: "Email is required" });
    }
  };

  return (
    <>
      <form onSubmit={handleRegister}>
        <Grow in>
          <Card
            sx={{
              width: "65%",
              margin: "auto",
              display: "flex",
            }}
          >
            <Box
              sx={{ display: "flex", flexDirection: "column", mr: 4, ml: 2 }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    sx={{
                      boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <Key />
                  </Avatar>
                }
                title={
                  <Typography variant="h4" fontWeight={500}>
                    Register
                  </Typography>
                }
                sx={{ mt: 2 }}
              />
              <CardContent>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    error={Boolean(errors.fName)}
                    helperText={errors.fName}
                    margin={errors.fName ? "dense" : "normal"}
                    label="First Name"
                    name="fName"
                    value={fName}
                    onChange={onChangeFName}
                    variant="outlined"
                  />
                  <TextField
                    error={Boolean(errors.lName)}
                    helperText={errors.lName}
                    margin={errors.lName ? "dense" : "normal"}
                    label="First Name"
                    name="lName"
                    value={lName}
                    onChange={onChangeLName}
                    variant="outlined"
                  />
                </Box>
                <TextField
                  fullWidth
                  error={Boolean(errors.username)}
                  helperText={errors.username}
                  margin={errors.username ? "dense" : "normal"}
                  label="Username"
                  name="username"
                  value={username}
                  onChange={onChangeUsername}
                  variant="outlined"
                  autoFocus
                />
                <TextField
                  fullWidth
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  margin={errors.email ? "dense" : "normal"}
                  label="Email"
                  name="email"
                  value={email}
                  onChange={onChangeEmail}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  type={showPassword ? "text" : "password"}
                  error={Boolean(errors.password)}
                  helperText={
                    /Password is/.test(errors.password) &&
                    "Password is required"
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />
                {errors.password && (
                  <>
                    {!/Password is/.test(errors.password) && (
                      <Alert severity="error" sx={{ my: 1 }}>
                        {errors.password}
                      </Alert>
                    )}
                  </>
                )}
                {message && error && !errors.password && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Alert severity="error">{message}</Alert>
                  </>
                )}
              </CardContent>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || disabled}
                  onClick={handleRegister}
                  sx={{ mb: 3, bgcolor: "primary.dark", color: "white" }}
                  disableElevation
                >
                  {loading && (
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                  )}
                  Sign Up
                </Button>
              </Box>
              <Typography
                onClick={handleOpen}
                variant="body2"
                color="primary.dark"
                textAlign="center"
                sx={{ mb: 2, cursor: "pointer" }}
              >
                Forgot password?
              </Typography>
            </Box>
            <Divider
              flexItem
              orientation="vertical"
              variant="middle"
              sx={{
                my: 3,
                mr: 2,
                display: { xs: "none", md: "block" },
              }}
            />
            <CardMedia
              component="img"
              alt="Sign up"
              image={img}
              sx={{ width: 410, display: { xs: "none", md: "block" } }}
            />
          </Card>
        </Grow>
      </form>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ ".MuiDialog-paper": { width: "320px" } }}
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            error={Boolean(errors.resetEmail)}
            helperText={errors.resetEmail}
            margin="normal"
            label="Email"
            name="email"
            value={resetEmail}
            onChange={onChangeResetEmail}
            variant="outlined"
          />
          {message && resetError && (
            <>
              <Divider sx={{ my: 2, mt: 1 }} />
              <Alert severity="error" sx={{ mb: 1 }}>
                {message}
              </Alert>
            </>
          )}
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <LoadingButton
              variant="contained"
              onClick={handleForgotPassword}
              loadingPosition="start"
              disabled={!resetEmail.length}
              loading={resetLoading}
              startIcon={<SendRounded />}
              disableElevation
            >
              <span>Send</span>
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Register;
