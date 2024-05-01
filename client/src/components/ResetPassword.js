import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  CardActions,
  Tooltip,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword, verifyToken } from "../actions/auth";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function ResetPassword() {
  const { message } = useSelector(state => state.message);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [countdown, setCountdown] = useState(5);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const token = new URLSearchParams(location.search).get("token");
  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleClickShowConfirm = () => setShowConfirm(show => !show);
  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  useEffect(() => {
    const verify = () => {
      dispatch(verifyToken(token))
        .then(() => {
          setError(false);
        })
        .catch(() => {
          setError(true);
          setCountdown(5);
          const countdownInterval = setInterval(() => {
            setCountdown(prevCount => prevCount - 1);
          }, 1000);

          setTimeout(() => {
            clearInterval(countdownInterval);
            navigate("/register");
          }, 5000);
        });
    };
    if (token) {
      verify();
    }
  }, [dispatch, navigate, token]);

  const validatePassword = value => {
    const newErrors = {};
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!passwordRegex.test(value)) {
      if (!/(?=.*[A-Za-z])/.test(value)) {
        newErrors.newPassword =
          "Password must contain at least one letter (a-z or A-Z)";
      } else if (!/(?=.*\d)/.test(value)) {
        newErrors.newPassword =
          "Password must contain at least one digit (0-9)";
      } else if (!/(?=.*[@$!%*?&])/.test(value)) {
        newErrors.newPassword =
          "Password must contain at least one special character (@$!%*?&)";
      } else if (value.length < 6) {
        newErrors.newPassword = "Password must have at least 6 characters";
      }
    } else {
      newErrors.newPassword = "";
    }

    setErrors({ ...errors, ...newErrors });

    return Object.keys(newErrors).length === 0;
  };

  const onChangePassword = e => {
    const value = e.target.value;
    setNewPassword(value);
    if (value.length === 0) {
      setErrors({ ...errors, password: "" });
    } else {
      validatePassword(value);
    }
  };

  const onChangeConfirmPassword = e => {
    const value = e.target.value;
    setConfirmPassword(value);
    setErrors({ ...errors, confirmPassword: "" });
  };

  const handleResetPassword = () => {
    const newErrors = {};

    if (!newPassword) {
      newErrors.newPassword = "Password is required";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords must match";
    }

    setErrors({ ...errors, ...newErrors });

    if (Object.keys(newErrors).length === 0) {
      dispatch(resetPassword(token, newPassword))
        .then(() => {
          navigate("/login");
        })
        .catch(error => {
          setError(true);
          console.log(error);
        });
    } else {
      // Handle password mismatch
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100%"
    >
      <Card sx={{ maxWidth: "500px" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h4" align="center" fontWeight={500} mb={1}>
            Reset Password <br />
            <Tooltip title="Your verification token">
              <Typography color="text.secondary" fontWeight={300}>
                {token}
              </Typography>
            </Tooltip>
          </Typography>
          {message && error && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="error">{message}</Alert>
              {countdown > 0 && (
                <Typography textAlign="center" variant="body2" sx={{ mt: 1 }}>
                  Returning to register in {countdown}...
                </Typography>
              )}
            </Box>
          )}
          {message && !error && <Divider sx={{ mt: 2, mb: 1 }} />}
          {!error && (
            <>
              <TextField
                fullWidth
                error={Boolean(errors.newPassword)}
                helperText={errors.newPassword}
                type={showPassword ? "text" : "password"}
                label="New Password"
                variant="outlined"
                margin="normal"
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
                value={newPassword}
                onChange={onChangePassword}
              />
              <TextField
                fullWidth
                type={showConfirm ? "text" : "password"}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
                label="Confirm Password"
                variant="outlined"
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirm}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={confirmPassword}
                onChange={onChangeConfirmPassword}
              />
              {!error && message && (
                <Alert severity="error" sx={{ my: 1 }}>
                  {message}
                </Alert>
              )}
              <CardActions
                sx={{ display: "flex", justifyContent: "center", mt: 1 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={handleResetPassword}
                >
                  Reset Password
                </Button>
              </CardActions>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
