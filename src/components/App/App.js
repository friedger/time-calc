import React from "react";
import PropTypes from "prop-types";
import { HashRouter, Route } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles,
  responsiveFontSizes
} from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";

import { Provider, connect } from "react-redux";
import { withRouter } from "react-router-dom";
import createStore from "./../../logic/store";

import Syncer from "../Syncer/Syncer";
import UserProfile from "../UserProfile/UserProfile";
import AppMenu from "./AppMenu";

import PublicHomePage from "./PublicHomePage";
import TimeListContainer from "./TimeListContainer";
import ProjectsContainer from "./ProjectsContainer";
import SharedTimeListContainer from "./SharedTimeListContainer";
import AppHomeMenu from "./AppHomeMenu";

const theme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      primary: blue
    },
    typography: {
      fontDisplay: "swap"
    }
  })
);

const styles = () => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(8),
    padding: `${theme.spacing(6)}px 0`
  }
});

const BareOIAppBar = ({
  classes,
  currentProject,
  location,
  signedOut,
  sharedSheet
}) => {
  let title;
  let app = location.pathname !== "/";
  let projectDetails = location.pathname.startsWith("/project");
  if (app && !!currentProject && !!currentProject.title && !sharedSheet) {
    title = <div>OI Timesheet - {currentProject.title}</div>;
  } else {
    title = <div>OI Timesheet</div>;
  }
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {projectDetails && <AppHomeMenu />}
        <Typography variant="h3" color="inherit" className={classes.title}>
          {title}
        </Typography>
        <UserProfile />
        {app && !signedOut && <Syncer />}
        {app && !projectDetails && <AppMenu />}
      </Toolbar>
    </AppBar>
  );
};

BareOIAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  currentProject: PropTypes.object,
  match: PropTypes.any,
  location: PropTypes.any,
  signedOut: PropTypes.bool,
  history: PropTypes.object,
  sharedSheet: PropTypes.bool
};

const OIAppBar = withRouter(
  connect((state, ownProps) => {
    const sharedSheet =
      ownProps.location &&
      ownProps.location.pathname &&
      ownProps.location.pathname.startsWith("/shared");

    return {
      currentProject: state.projectlist.currentProject,
      signedOut: !state.userProfile.user && !state.userProfile.userMessage,
      sharedSheet
    };
  })(withStyles(styles)(BareOIAppBar))
);

const App = ({ classes }) => (
  <Provider store={createStore()}>
    <HashRouter>
      <MuiThemeProvider theme={theme}>
        <Grid container className={classes.root} spacing={2}>
          <OIAppBar />
          <Route path="/app" component={TimeListContainer} />
          <Route path="/project/:project" component={ProjectsContainer} />
          <Route
            path="/shared/:user/:project/:file"
            component={SharedTimeListContainer}
          />
          <Route path="/" exact component={PublicHomePage} />
        </Grid>
        {/* Footer */}
        <footer className={classes.footer} align="center">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="body1"
                align="center"
                color="textSecondary"
                component="p"
              >
                About
              </Typography>
              <Typography variant="body2" align="center" gutterBottom>
                made by OpenIntents.org
              </Typography>
              <Typography variant="body2" align="center" color="textSecondary">
                <a href="https://github.com/friedger/time-calc">
                  Open Source And Free!
                </a>
                <br />
                Version {process.env.REACT_APP_VERSION}
                <br />
                <a href="https://github.com/friedger/time-calc/releases">
                  What is new
                </a>
                <br />
                <a href='https://github.com/friedger/time-calc/issues?q=is%3Aissue+is%3Aopen+label%3A"bug"'>
                  Known issues
                </a>
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography
                variant="body1"
                align="center"
                color="textSecondary"
                component="p"
              >
                Contact
              </Typography>
              <Typography
                variant="body2"
                align="center"
                color="textSecondary"
                component="p"
              >
                <a href="https://app.trymumble.com/join/public/7df9971ea843-4c96-a86c-9acd67647c97">
                  Mumble
                </a>
                <br />
                <a href="mailto:support@openintents.org">Email</a>
              </Typography>
            </Grid>
          </Grid>
        </footer>
        {/* End footer */}
      </MuiThemeProvider>
    </HashRouter>
  </Provider>
);

App.propTypes = {
  classes: PropTypes.object.isRequired,
  currentProject: PropTypes.object
};

export default withStyles(styles)(App);
