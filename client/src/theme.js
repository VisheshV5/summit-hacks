import { createTheme, linearProgressClasses } from "@mui/material";

export const theme = createTheme({
  typography: {
    fontFamily: "Poppins",
  },
  shadows: ["none", ...Array(24).fill("none")],
  palette: {
    primary: {
      main: "#12372A",
      light: "#abe098",
      dark: "#409a30",
    },
    secondary: {
      main: "#368ce7",
      light: "#7ab3ef",
      dark: "#1666ba",
    },
    error: {
      main: "#EB0014",
    },
  },
  overrides: {
    MuiDialog: {
      paper: {
        scroll: "body",
      },
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 10,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 10,
          borderRadius: 5,

          [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: "#2eb62c",
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "10px",
          padding: "0.5rem 1rem",
        },
        contained: {
          color: "#eef9ec",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          marginTop: "15px",
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
      styleOverrides: {
        tooltip: {
          borderRadius: "4px",
          background: "black",
        },
        arrow: {
          color: "black",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          textAlign: "center",
          fontSize: "24px",
          paddingBottom: "5px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "14px",
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        },
      },
    },
  },
});
