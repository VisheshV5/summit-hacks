import React from "react";
import "./Header.css";
import styled from "styled-components";
import { useHistory, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Tooltip,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
// import Study from "./Study";

const Header = () => {
  const { auth } = useSelector((state) => ({ ...state }));
  const user = JSON.parse(localStorage.getItem("user"));
  const history = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = () => {
    localStorage.removeItem("user");
    history("/login");
  };

  const handleLink = (link) => {
    handleCloseNavMenu();
    history(link);
  };

  return (
    <AppBar color="" position="static" sx={{ py: 2, zIndex: 999 }}>
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Box
            // src={logo}
            component="img"
            width="100px"
            sx={{ display: { xs: "none", md: "flex" } }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mx: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            PEAKX
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem onClick={() => handleLink("/studySets")}>
                <Typography textAlign="center">Study sets</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleLink("/view-mentees")}>
                <Typography textAlign="center">Mentoring</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleLink("/analytics")}>
                <Typography textAlign="center">Analytics</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleLink("/dictionary")}>
                <Typography textAlign="center">Dictionary</Typography>
              </MenuItem>
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            GROW{""}X
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              onClick={() => handleLink("/studySets")}
              sx={{
                my: 2,
                color: "black",
                display: "block",
                textTransform: "capitalize",
              }}
            >
              <Typography textAlign="center">Study Sets</Typography>
            </Button>
            <Button
              onClick={() => handleLink("/view-mentees")}
              sx={{
                my: 2,
                color: "black",
                display: "block",
                textTransform: "capitalize",
              }}
            >
              <Typography textAlign="center">Mentoring</Typography>
            </Button>
            <Button
              onClick={() => handleLink("/analytics")}
              sx={{
                my: 2,
                color: "black",
                display: "block",
                textTransform: "capitalize",
              }}
            >
              <Typography textAlign="center">Analytics</Typography>
            </Button>
            {/* <Box sx={{ flexGrow: 1 }}>
              <Tooltip title="Open settings" arrow>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box> */}
          </Box>
          {/* <Study /> */}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
