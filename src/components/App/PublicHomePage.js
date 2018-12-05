import React from "react";
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

        <Typography variant="headline">
          Be more productive! Track your time spent on projects and clients.
        </Typography>

        <Typography variant="body1">
          Your data never get out of your control.
        </Typography>

        <Typography variant="body1">
          Works offline. Wherever and whenever you need.
        </Typography>

        <Typography variant="body1">
          Across devices with <a href="https://blockstack.org"><b>Blockstack</b></a>.
        </Typography>
        <div>
          <Link to="/app">
            <img alt="Launch as Web App" src="pwa.png" height="64vh" />
          </Link>
        
          <a href="https://play.google.com/store/apps/details?id=org.openintents.timesheet">
            <img
              alt="Get it on Google Play"
              src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png"
              height="64vh"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PublicHomePage;
