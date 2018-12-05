import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TimeList from "../TimeList/TimeList";

import { loadSharedTimes } from "../../logic/actions/actions";

class SharedTimeListContainer extends Component {
  static propTypes = {
    match: PropTypes.any,
    loadTimes: PropTypes.func,
    timesLoaded: PropTypes.bool,
    message: PropTypes.string,
    signedIn: PropTypes.bool
  };

  componentDidMount() {
    // eslint-disable-next-line no-console
    console.log(this.props);
    if (this.props.signedIn) {
      this.props.loadTimes();
    }
  }

  render() {
    const { match, timesLoaded, message } = this.props;

    // eslint-disable-next-line no-console
    console.log("params", match.params);
    return (
      <div>
        <Grid container>
          <Typography variant="title">Shared Timesheet</Typography>
          <Grid item xs={12}>
            <Paper>
              {timesLoaded && <TimeList readOnly="true"/>}
              {!timesLoaded && (
                <Typography variant="body1">{message}</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default connect(
  state => {    
    let signedIn = !!state.userProfile.user && !state.userProfile.userMessage;
    let message;
    if (!signedIn) {
      message = "Please sign in to see shared timesheet.";
    } else {
      message = state.syncState.error || "Loading ...";
    }
    return {
      signedIn,
      timesLoaded: !!state.timelist.times && state.timelist.times.length > 0,
      message
    };
  },
  (dispatch, ownProps) => {
    const user = ownProps.match.params.user;
    const projectId = ownProps.match.params.project;
    const filename = ownProps.match.params.file;
    return {
      loadTimes: () => dispatch(loadSharedTimes(user, projectId, filename))
    };
  }
)(SharedTimeListContainer);
