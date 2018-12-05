import React from "react";
import Typography from "@material-ui/core/Typography";

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
          <a href="/#/app">
            <img alt="Launch as Web App" src="pwa.png" height="64vh" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PublicHomePage;
