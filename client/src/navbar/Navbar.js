import { AutoAwesome, Class, Logout, Settings } from "@mui/icons-material";
import {
  Avatar,
  ButtonBase,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../actions/auth";
import EventBus from "../common/EventBus";
import userService from "../services/user.service";
import { menuItems } from "./MenuItems";
import logo from "../images/peakXlogo.png";
import "./Navbar.css";
import { FileQuestion, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [createEl, setCreateEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const isOpen = Boolean(createEl);
  const open = Boolean(anchorEl);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOut = useCallback(() => {
    setAnchorEl(false);
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  useEffect(() => {
    EventBus.on("logout", () => {
      logOut();
    });

    window.addEventListener("scroll", handleScroll);

    return () => {
      EventBus.remove("logout");
      window.removeEventListener("scroll", handleScroll);
    };
  }, [user, logOut]);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const navbarClass = isScrolled ? "NavbarItems normal-navbar" : "NavbarItems";

  return (
    <nav className={navbarClass}>
      <div className="nav-container">
        <img src={logo} width={80} />
        <Typography
          variant="h5"
          component="h1"
          className="logo"
          sx={{
            letterSpacing: "0.1rem",
            fontFamily: "Poppins",
          }}
        >
          PeakX
        </Typography>
        <ul className="nav-menu">
          {menuItems.map((item, index) => {
            if (item.permission === "admin" && !showAdminBoard) {
              return null;
            } else if (item.permission === "user" && !user) {
              return null;
            }

            return (
              <li key={index}>
                <Link
                  to={`/${item.url}`}
                  style={{
                    textDecoration: "none",
                    fontSize: "20px",
                    fontWeight: 300,
                  }}
                  className={`${item.cName} left`}
                >
                  <i>{item.icon}</i>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="nav-container profile">
        {user && (
          <>
            {/* <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              {imageSrc ? (
                <Avatar
                  sx={{
                    width: 61,
                    height: 61,
                    background: "white",
                  }}
                  src={imageSrc}
                />
              ) : (
                <Avatar sx={{ width: 56, height: 56, fontSize: "30px" }}>
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
              )}
            </IconButton> */}
            <Link
              to={`/dashboard`}
              style={{
                textDecoration: "none",
                fontSize: "20px",
                fontWeight: 300,
              }}
              className={`nav-links left`}
            >
              <i>
                <LayoutDashboard size={30} strokeWidth="1px" />
              </i>
              Dashboard
            </Link>
            <Divider
              flexItem
              orientation="vertical"
              variant="middle"
              sx={{ borderColor: "white", mx: 1 }}
            />
          </>
        )}
        {!user ? (
          <ButtonBase sx={{ borderRadius: "6px" }}>
            <Link
              to={!user && "/login"}
              style={{ textDecoration: "none" }}
              className="nav-links-mobile left"
              onClick={(e) => setCreateEl(e.currentTarget)}
            >
              Sign in
            </Link>
          </ButtonBase>
        ) : (
          <IconButton
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
              navigate("/profile");
            }}
          >
            {imageSrc ? (
              <Avatar
                sx={{
                  width: 61,
                  height: 61,
                  background: "white",
                }}
                src={imageSrc}
              />
            ) : (
              <Avatar sx={{ width: 56, height: 56, fontSize: "30px" }}>
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
            )}
          </IconButton>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
