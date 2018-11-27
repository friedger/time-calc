import React from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

const launcherStyle = {
  width: "100vw",
  height: "50vh",
  alignContent: "center",
  alignItems: "center",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  justifyContent: "center",
  textAlign: "center"
};
const PublicHomePage = () => {
  return (
    <div style={launcherStyle}>
      <div>
        <div>
          <img height="100vh" width="100vw" src="/android-chrome-512x512.png" />
        </div>
        <div>
          <Link to="/app">
            <Button
              variant="contained"
              color="primary"
              style={{ margin: "10px" }}
            >
              <Typography>Start Now!</Typography>
            </Button>
          </Link>
        </div>
        <div>
          <a href="https://play.google.com/store/apps/details?id=org.openintents.timesheet">
            <Button
              variant="contained"
              color="primary"
              style={{ margin: "10px" }}
            >
              <Typography>Use Android app</Typography>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PublicHomePage;
