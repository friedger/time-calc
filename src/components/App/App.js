import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Route } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles
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

const styles = () => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 8,
    padding: `${theme.spacing.unit * 6}px 0`
  }
});

const theme = createMuiTheme({
  palette: {
    primary: blue
  },
  typography: {
    fontDisplay: "swap"
  }
});

const BareOIAppBar = ({
  classes,
  currentProject,
  location,
  signedOut
}) => {
  let title;
  let app = location.pathname !== "/";
  let projects = location.pathname === "/projects";
  if (app && !!currentProject && !!currentProject.title) {
    title = <div>OI Timesheet - {currentProject.title}</div>;
  } else {
    title = <div>OI Timesheet</div>;
  }
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {projects && (
          <AppHomeMenu/>
        )}
        <Typography variant="title" color="inherit" className={classes.title}>
          {title}
        </Typography>
        <UserProfile />
        {app && !signedOut && <Syncer />}
        {app && !projects && <AppMenu />}
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
  history: PropTypes.object
};

const OIAppBar = withRouter(
  connect(
    state => {
      return {
        currentProject: state.projectlist.currentProject,
        signedOut: !state.userProfile.user && !state.userProfile.userMessage
      };
    })(withStyles(styles)(BareOIAppBar))
);

const App = ({ classes }) => (
  <Provider store={createStore()}>
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <Grid container className={classes.root} spacing={16}>
          <OIAppBar />
          <Route path="/app" component={TimeListContainer} />
          <Route path="/projects" component={ProjectsContainer} />
          <Route path="/shared/:user/:project/:file" component={SharedTimeListContainer}/>
          <Route path="/" exact component={PublicHomePage} />
        </Grid>
        {/* Footer */}
        <footer className={classes.footer}>
          <Typography variant="subheading" align="center" gutterBottom>
            made by OpenIntents.org
          </Typography>
          <Typography
            variant="subheading"
            align="center"
            color="textSecondary"
            component="p"
          >
            <a href="https://github.com/friedger/time-calc">
              Open Source And Free!
            </a>
          </Typography>
          <Typography align="center">
            Version {process.env.REACT_APP_APPVERSION}
          </Typography>
        </footer>
        {/* End footer */}
      </MuiThemeProvider>
    </BrowserRouter>
  </Provider>
);

App.propTypes = {
  classes: PropTypes.object.isRequired,
  currentProject: PropTypes.object
};

export default withStyles(styles)(App);
