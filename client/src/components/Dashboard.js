import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Paper } from "@mui/material";
import { Card, Avatar, Badge } from "antd";
import "./Dashboard.css";
import Analytics from "./quiz/Analytics";
import AnalyticsCondensed from "./quiz/AnalyticsCondensed";
import Quizzes from "./quiz/Quizzes";
import { AutoAwesome } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Calendar from "./events/Calendar";
import Page5 from "./ikigai/Page5";
import Diversity1Icon from "@mui/icons-material/Diversity1";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Dashboard = () => {
  const [value, setValue] = React.useState(0);
  const { Meta } = Card;
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Paper
        variant="elevation"
        className="top-bg"
        style={{
          background: "#436850",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card sx={{ width: 100 }}>
          <Meta
            avatar={<Avatar>V</Avatar>}
            title={"Vishesh"}
            description={`Joined 9 hours ago`}
          />
        </Card>
      </Paper>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="scrollable"
            sx={{
              color: "white",
              borderBottom: "1px solid lightgray",
              "& .MuiTabs-indicator": {
                backgroundColor: "#ADBC9F",
              },
            }}
          >
            <Tab
              disableRipple
              label="Personal"
              sx={{
                color: "white",
                "&.Mui-selected": {
                  color: "#ADBC9F",
                },
              }}
              {...a11yProps(0)}
            />
            <Tab
              disableRipple
              label="Academic"
              sx={{
                color: "white",
                "&.Mui-selected": {
                  color: "#ADBC9F",
                },
              }}
              {...a11yProps(1)}
            />
            <Tab
              disableRipple
              label="Social"
              sx={{
                color: "white",
                "&.Mui-selected": {
                  color: "#ADBC9F",
                },
              }}
              {...a11yProps(2)}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Page5 />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Box sx={{ display: "flex" }}>
            <div style={{ position: "sticky" }}>
              <Quizzes />
            </div>

            <div>
              <Link
                to="/generate/quiz"
                className="nav-links-mobile left"
                style={{
                  width: 165,
                  textAlign: "center",
                  textDecoration: "none",
                  marginLeft: "auto",
                  backgroundColor: "#436850",
                  color: "white",
                }}
                // onClick={(e) => setCreateEl(e.currentTarget)}
              >
                <AutoAwesome />
                Create Quiz
              </Link>
              <AnalyticsCondensed />
            </div>
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Calendar />
        </CustomTabPanel>
      </Box>
    </>
  );
};

export default Dashboard;
