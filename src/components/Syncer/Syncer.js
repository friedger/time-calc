import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import CloudOffIcon from "@material-ui/icons/CloudOff";
import SaveIcon from "@material-ui/icons/Save";
import SyncIcon from "@material-ui/icons/Sync";
import CloudCircleIcon from "@material-ui/icons/CloudCircle";
import CloudDoneIcon from "@material-ui/icons/CloudDone";
import { withStyles, Tooltip } from "@material-ui/core";
import { withRouter } from "react-router-dom";

const styles = () => ({
  root: {
    margin: "8px"
  }
});

const Syncer = props => {
  const { hasChanges, isSyncing, allSynced, error, classes } = props;

  if (error) {
    return (
      <div>
         <Tooltip title={error}>
          <CloudOffIcon />
        </Tooltip>
      </div>
    );
  }
  if (hasChanges) {
    return (
      <div className={classes.root}>
        <SaveIcon titleAccess="Needs syncing" />
      </div>
    );
  } else if (isSyncing) {
    return (
      <div className={classes.root}>
        <SyncIcon titleAccess="Syncing ..." />
      </div>
    );
  } else if (allSynced) {
    return (
      <div className={classes.root}>
        <CloudDoneIcon titleAccess="Sync done" />
      </div>
    );
  }
  return (
    <div className={classes.root}>
      <CloudCircleIcon titleAccess="Sync State" />
    </div>
  );
};

Syncer.propTypes = {
  hasChanges: PropTypes.bool,
  isSyncing: PropTypes.bool,
  allSynced: PropTypes.bool,
  error: PropTypes.string,
  classes: PropTypes.object.isRequired,
  match: PropTypes.any
};

const mapStateToProps = state => {
  return {
    hasChanges: state.syncState.hasChanges,
    isSyncing: state.syncState.isSyncing,
    allSynced: state.syncState.allSynced,
    error: state.syncState.error
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(withStyles(styles)(Syncer))
);
