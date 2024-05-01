import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Grow,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../actions/auth";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    username: "",
  });
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
    setErrors({ ...errors, username: "" });
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
    setErrors({ ...errors, password: "" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newErrors = {};

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (!username) {
      newErrors.username = "Username is required";
    }

    setErrors({ ...errors, ...newErrors });

    if (Object.keys(newErrors).length === 0) {
      try {
        await dispatch(login(username, password));
        navigate("/home");
        window.location.reload();
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    } else {
      setError(false);
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    navigate("/home");
  }

  return (
    <form onSubmit={handleLogin}>
      <Grow in>
        <Card
          sx={{
            width: "60%",
            margin: "auto",
            display: "flex",
          }}
        >
          <CardMedia
            component="img"
            alt="Login"
            image="https://i.pinimg.com/736x/a5/0a/67/a50a6704336ade0fdb4b5a364df0b850.jpg"
            sx={{ width: 400, display: { xs: "none", md: "block" } }}
            height={370}
          />
          <Divider
            flexItem
            orientation="vertical"
            variant="middle"
            sx={{
              my: 3,
              display: { xs: "none", md: "block" },
            }}
          />
          <Box sx={{ display: "flex", flexDirection: "column", mr: 3, ml: 2 }}>
            <CardHeader
              avatar={
                <Avatar
                  sx={{
                    boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <LockOutlined />
                </Avatar>
              }
              title={
                <Typography variant="h4" fontWeight={500}>
                  Sign in
                </Typography>
              }
              sx={{ mt: 2 }}
            />
            <CardContent>
              <TextField
                fullWidth
                margin="normal"
                label="Username"
                name="username"
                value={username}
                error={Boolean(errors.username)}
                helperText={errors.username}
                onChange={onChangeUsername}
                variant="outlined"
                required
                autoFocus
              />
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                name="password"
                value={password}
                error={Boolean(errors.password)}
                helperText={errors.password}
                onChange={onChangePassword}
                type={showPassword ? "text" : "password"}
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
                required
              />
              {message && error && (
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
                onClick={handleLogin}
                disabled={loading}
                sx={{ mb: 3, bgcolor: "primary.dark", color: "white" }}
                disableElevation
              >
                {loading && (
                  <span className="spinner-border spinner-border-sm mr-2"></span>
                )}
                Login
              </Button>
            </Box>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <Typography
                textAlign="center"
                variant="body2"
                color="primary.dark"
                sx={{ mb: 2 }}
              >
                Don't have an account? Create one.
              </Typography>
            </Link>
          </Box>
        </Card>
      </Grow>
    </form>
  );
}
