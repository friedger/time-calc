import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { Paper, Typography, Button } from "@material-ui/core";
import { connect } from "react-redux";
import {
  loadProjects,
  archiveProject,
  unarchiveProject
} from "../../logic/actions/actions";
import { withRouter } from "react-router-dom";

import RefreshIcon from "@material-ui/icons/Refresh";
import ArchiveIcon from "@material-ui/icons/Archive";
import UnarchiveIcon from "@material-ui/icons/Unarchive";

const uuidPrefix = new RegExp("^........-....-4...-....-............[.]*");
const startsWithProjectId = function(path) {
  return uuidPrefix.test(path);
};

const styles = theme => ({
  control: {
    padding: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(1)
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  iconSmall: {
    fontSize: 20
  }
});

class GaiaFiles extends Component {
  titleFor = k => {
    const p = this.props.projectsById[k];
    let title;
    if (p && p.title) {
      title = p.title;
    } else {
      title = k;
    }
    return title;
  };

  render() {
    const {
      timesheetFiles,
      otherFiles,
      classes,
      history,
      projects,
      exportProjects,
      unarchiveProject,
      archiveProject
    } = this.props;
    return (
      <Grid item xs={12}>
        <Paper className={classes.control} style={{ margin: "10px" }}>
          <Typography variant="h3">Your remote files</Typography>
          <Button
            onClick={() => exportProjects(history)}
            variant="contained"
            size="small"
            className={classes.button}
          >
            <RefreshIcon
              className={classNames(classes.leftIcon, classes.iconSmall)}
            />
            Refresh
          </Button>
          <Typography variant="h5">Timesheet Files</Typography>
          <Grid container spacing={2} justify="center">
            {Object.keys(timesheetFiles).map(projectId => {
              const project = projects.find(p => p.id === projectId);
              return (
                <Grid container key={projectId} item xs={12} md={6}>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      Project <b>{this.titleFor(projectId)}</b>
                      <br />
                      {!project && (
                        <Button
                          onClick={() => unarchiveProject(projectId)}
                          variant="contained"
                          size="small"
                          className={classes.button}
                        >
                          <UnarchiveIcon
                            className={classNames(
                              classes.leftIcon,
                              classes.iconSmall
                            )}
                          />
                          Unarchive
                        </Button>
                      )}
                      {project && (
                        <Button
                          onClick={() => archiveProject(project)}
                          variant="contained"
                          size="small"
                          className={classes.button}
                        >
                          <ArchiveIcon
                            className={classNames(
                              classes.leftIcon,
                              classes.iconSmall
                            )}
                          />
                          Archive
                        </Button>
                      )}
                    </Typography>
                  </Grid>
                  {Object.keys(timesheetFiles[projectId]).map(filename => (
                    <React.Fragment key={filename}>
                      <Grid item xs={2} md={1}>
                        {" "}
                      </Grid>
                      <Grid container item xs={10} md={5}>
                        <Grid item xs={12}>
                          <Typography variant="body1">
                            File <em>{filename}</em>
                          </Typography>
                        </Grid>
                        {Object.keys(timesheetFiles[projectId][filename]).map(
                          j => (
                            <Grid key={j} item xs={12}>
                              <Typography variant="body2">
                                <a
                                  href={
                                    timesheetFiles[projectId][filename][j].file
                                  }
                                >
                                  {timesheetFiles[projectId][filename][j]
                                    .user && (
                                    <span>
                                      shared with{" "}
                                      {
                                        timesheetFiles[projectId][filename][j]
                                          .user
                                      }{" "}
                                      privately
                                    </span>
                                  )}
                                  {!timesheetFiles[projectId][filename][j]
                                    .user && <span>your private version</span>}
                                </a>
                              </Typography>
                            </Grid>
                          )
                        )}
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              );
            })}
          </Grid>
          <Typography variant="h5">Other Files</Typography>
          <Grid container spacing={2} justify="center">
            {Object.keys(otherFiles).map(k => (
              <Grid key={k} item xs={12} md={6}>
                <a href={otherFiles[k].file}>
                  <Typography variant="body2">{otherFiles[k].path}</Typography>
                </a>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

const pushTimesheetFile = (
  timesheetFiles,
  projectsById,
  projectId,
  file,
  path,
  user,
  filename
) => {
  if (!timesheetFiles[projectId]) {
    timesheetFiles[projectId] = {};
  }
  if (!timesheetFiles[projectId][filename]) {
    timesheetFiles[projectId][filename] = [];
  }
  timesheetFiles[projectId][filename].push({ file, path, user, filename });
};

const mapStateToProps = state => {
  const currentProject = state.projectlist.currentProject;
  const files = state.projectlist.files || [];

  const timesheetFiles = {};
  const projectsById = {};
  const otherFiles = [];

  const projects = state.projectlist.projects;
  if (state.userProfile.user) {
    projects.forEach(p => {
      projectsById[p.id] = p;
    });
    const gaiaPrefix = state.userProfile.user.gaiaUrl;

    files.forEach(file => {
      const path = file.substring(gaiaPrefix.length);
      if (path.startsWith("shared")) {
        const pathParts = path.split("/");
        let user;
        let projectId;
        let filename;
        if (pathParts.length > 3) {
          user = pathParts[1];
          projectId = pathParts[2];
          filename = pathParts[3];

          pushTimesheetFile(
            timesheetFiles,
            projectsById,
            projectId,
            file,
            path,
            user,
            filename
          );
        } else {
          otherFiles.push({ file, path });
        }
      } else if (startsWithProjectId(path)) {
        const projectId = path.substring(0, 36);
        const filename = path.substring(37);
        pushTimesheetFile(
          timesheetFiles,
          projectsById,
          projectId,
          file,
          path,
          null,
          filename
        );
      } else {
        otherFiles.push({ file, path });
      }
    });
  }
  return {
    projects: state.projectlist.projects,
    timesheetFiles,
    otherFiles,
    currentProject,
    projectsById
  };
};

const mapDispatchToProps = dispatch => {
  return {
    exportProjects: () => {
      dispatch(loadProjects());
    },
    archiveProject: project => {
      dispatch(archiveProject(project));
    },
    unarchiveProject: projectId => {
      dispatch(unarchiveProject(projectId));
    }
  };
};

GaiaFiles.propTypes = {
  classes: PropTypes.object,
  exportProjects: PropTypes.func,
  archiveProject: PropTypes.func,
  unarchiveProject: PropTypes.func,
  history: PropTypes.any.isRequired,
  projects: PropTypes.array,
  timesheetFiles: PropTypes.object,
  sharedFiles: PropTypes.array,
  otherFiles: PropTypes.array,
  projectsById: PropTypes.object
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(GaiaFiles))
);
