import React from "react";
import logo from "../images/peakXlogo.png";
import "./Home.css";
import { Grid } from "@mui/material";

const Home = () => {
  return (
    <div className="">
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        <Grid item md={6} xs={11}>
          <div className="homeContainer">
            <div className="homeTextContainer">
              <strong>
                <div className="homeText">
                  <div className="d-flex1">
                    We are <div className="miniText">PeakX</div>
                  </div>
                  Learn till you earn.
                </div>
              </strong>
            </div>
          </div>
        </Grid>

        <Grid item md={4} xs={11}>
          <div className="homeImageContainer">
            {/* <div className="homeImage"> */}
            <img src={logo} className="homeImage" />
            {/* </div> */}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
