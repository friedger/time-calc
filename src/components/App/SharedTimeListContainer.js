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
    project: PropTypes.object,
    owner: PropTypes.string,
    signedIn: PropTypes.bool
  };

  componentDidMount() {
    // eslint-disable-next-line no-console
    if (this.props.signedIn) {
      this.props.loadTimes();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.signedIn && this.props.signedIn) {
      this.props.loadTimes();
    }
  }

  render() {
    const { match, timesLoaded, message, project, owner } = this.props;

    // eslint-disable-next-line no-console
    console.log("params", match.params);
    return (
      <div style={{ margin: 8 }}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h3">
              Shared Timesheet {owner && <>by {owner}</>}
            </Typography>
            <Typography variant="h4">{project.title || project.id}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              {timesLoaded && <TimeList readOnly="true" />}
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
      timesLoaded:
        !!state.sharedTimesheet.times && state.sharedTimesheet.times.length > 0,
      project: state.sharedTimesheet.project || {},
      owner: state.sharedTimesheet.owner,
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
