import React from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles
} from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";

import { Provider } from "react-redux";
import createStore from "./../../logic/store";

import Form from "../Form/Form";
import TimeList from "../TimeList/TimeList";
import Syncer from "../Syncer/Syncer";
import UserProfile from "../UserProfile/UserProfile";
import AppMenu from "./AppMenu";

import MomentUtils from "material-ui-pickers/utils/moment-utils";
import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";
import moment from "moment";

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

const App = ({ classes }) => (
  <Provider store={createStore()}>
    <MuiThemeProvider theme={theme}>
      <Grid container className={classes.root} spacing={16}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography
              variant="title"
              color="inherit"
              className={classes.title}
            >
              OI Timesheet
            </Typography>
            <UserProfile />
            <Syncer />
            <AppMenu/>
          </Toolbar>
        </AppBar>
        <Grid item xs={12}>
          <MuiPickersUtilsProvider utils={MomentUtils} moment={moment}>
            <Form />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <TimeList />
          </Paper>
        </Grid>
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
          <a href="https://github.com/friedger/time-calc">Open Source And Free!</a>
        </Typography>
        <Typography align="center">
          Version {process.env.REACT_APP_APPVERSION}
        </Typography>
      </footer>
      {/* End footer */}
    </MuiThemeProvider>
  </Provider>
);

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
