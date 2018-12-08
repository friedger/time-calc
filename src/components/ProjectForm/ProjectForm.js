import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import {
  Paper,
  Typography,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel
} from "@material-ui/core";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import {
  saveProject,
  createProject,
  navigateToApp,
  loadProjects
} from "../../logic/actions/actions";
import { withRouter } from "react-router-dom";

import TextField from "../TextField/TextField";
import GenericButton from "../Button/Button";
import RefreshIcon from "@material-ui/icons/Refresh";

import { uuid } from "../../logic/helpers";

const uuidPrefix = new RegExp("^........-....-4...-....-............[.]*");
const startsWithProjectId = function(path) {
  return uuidPrefix.test(path);
};
const styles = theme => ({
  root: {
    flexGrow: 1
  },
  control: {
    padding: theme.spacing.unit * 2
  },
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
});

const validate = values => {
  const errors = {};

  if (!values.name) {
    errors.duration = "No Name set";
  }

  return errors;
};

const readOnlyText = field => {
  return <small style={{ color: "gray" }}>{field.meta.initial}</small>;
};

class ProjectForm extends Component {
  state = {
    newTitle: "",
    selectedProjectId: ""
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.setState({
      selectedProjectId: this.props.currentProject.id
    });
  }

  onNewTitleChanged = event => {
    this.setState({
      newTitle: event.target.value
    });
  };

  onProjectSelected = event => {
    const selectedProjectId = event.target.value;
    this.setState({
      selectedProjectId
    });
    const selectedProject = this.props.projects.find(
      p => p.id === selectedProjectId
    );
    this.props.setCurrentProject(this.props.history, selectedProject);
  };

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

  renderExportPaper() {
    const props = this.props;
    const { timesheetFiles, otherFiles } = this.props;
    return (
      <Grid item xs={12}>
        <Paper className={props.classes.control} style={{ margin: "10px" }}>
          <Typography variant="title">Your remote files</Typography>
          <Button
            onClick={() => props.exportProjects(props.history)}
            variant="contained"
            size="small"
            className={props.classes.button}
          >
            <RefreshIcon
              className={classNames(
                props.classes.leftIcon,
                props.classes.iconSmall
              )}
            />
            Refresh
          </Button>
          <Typography variant="display1">Timesheet Files</Typography>
          <Grid container spacing={16} justify="center">
            {Object.keys(timesheetFiles).map(k => (
              <Grid container key={k} item xs={12} md={6}>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    Project {this.titleFor(k)}
                  </Typography>
                </Grid>
                {Object.keys(timesheetFiles[k]).map(i => (
                  <React.Fragment key={i}>
                    <Grid item xs={2} md={1}>
                      {" "}
                    </Grid>
                    <Grid container item xs={10} md={5}>
                      <Grid item xs={12}>
                        <Typography
                          variant="body1"
                          style={{ fontWeight: "bold" }}
                        >
                          File {i}
                        </Typography>
                      </Grid>
                      {Object.keys(timesheetFiles[k][i]).map(j => (
                        <Grid key={j} item xs={12}>
                          <Typography variant="body2">
                            <a href={timesheetFiles[k][i][j].file}>
                              {timesheetFiles[k][i][j].user && (
                                <div>
                                  shared with {timesheetFiles[k][i][j].user} in
                                  private
                                </div>
                              )}
                              {!timesheetFiles[k][i][j].user && (
                                <span>your private version</span>
                              )}
                            </a>
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            ))}
          </Grid>
          <Typography variant="display1">Other Files</Typography>
          <Grid container spacing={16} justify="center">
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
  render() {
    const props = this.props;

    return (
      <div>
        <form onSubmit={props.handleSubmit(props.save)}>
          <Paper className={props.classes.control} style={{ margin: "10px" }}>
            <Typography variant="title">Edit current project</Typography>
            <Grid
              container
              className={props.classes.root}
              spacing={16}
              justify="center"
            >
              <Grid item xs={12}>
                <Field
                  name="title"
                  label="Customer/Project title"
                  fullWidth
                  component={TextField}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="customer"
                  label="Customer (Blockstack ID), for read-only access"
                  fullWidth
                  component={TextField}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  name="id"
                  label="Project Id"
                  type="text"
                  component={readOnlyText}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  name="filename"
                  label="Filename"
                  type="text"
                  component={readOnlyText}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                {props.valid && (
                  <GenericButton
                    invoke={() => null}
                    context={props}
                    type="submit"
                    icon={props.edit ? "save" : "add"}
                  />
                )}
                {props.edit && (
                  <GenericButton
                    color="secondary"
                    invoke={props.reset}
                    context={props}
                    icon={"cancel"}
                  />
                )}
              </Grid>
            </Grid>
          </Paper>
        </form>

        <Grid container>
          <Grid item xs={12} sm={6}>
            <Paper className={props.classes.control} style={{ margin: "10px" }}>
              <Typography variant="title">Select current projects</Typography>
              <RadioGroup
                aria-label="Projects"
                name="project"
                className={props.classes.group}
                value={this.state.selectedProjectId}
                onChange={this.onProjectSelected}
              >
                {props.projects &&
                  Object.keys(props.projects).map(k => (
                    <FormControlLabel
                      key={k}
                      value={props.projects[k].id}
                      control={<Radio />}
                      label={props.projects[k].title}
                    />
                  ))}
              </RadioGroup>
            </Paper>
          </Grid>
          <Grid container item xs={12} sm={6}>
            <Grid item xs={12}>
              <Paper
                className={props.classes.control}
                style={{ margin: "10px" }}
              >
                <Typography variant="title">Create new project</Typography>
                <Field
                  name="newTitle"
                  label="Customer/Project title"
                  type="text"
                  fullWidth
                  onChange={this.onNewTitleChanged}
                  component={TextField}
                />
                <GenericButton
                  invoke={() =>
                    props.addProject(props.history, this.state.newTitle)
                  }
                  context={props}
                  icon={"add"}
                />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        {this.renderExportPaper()}
      </div>
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
    timesheetFiles[projectId] = [];
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
    for (let i1 in projects) {
      let p = projects[i1];
      projectsById[p.id] = p;
    }
    const gaiaPrefix = state.userProfile.user.gaiaUrl;

    for (let i in files) {
      const file = files[i];
      const path = file.substring(gaiaPrefix.length);
      if (path.startsWith("shared")) {
        const pathParts = path.split("/");
        let user;
        let projectId;
        let filename;
        if (pathParts.length > 1) {
          user = pathParts[1];
          projectId = pathParts[2];
          filename = pathParts[3];
        }
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
        if (startsWithProjectId(path)) {
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
      }
    }
  }
  return {
    initialValues: currentProject
      ? {
          id: currentProject.id,
          title: currentProject.title,
          filename: currentProject.filename,
          customer: currentProject.customer
        }
      : { id: uuid() },
    edit: !!currentProject,
    projects: state.projectlist.projects,
    timesheetFiles,
    otherFiles,
    currentProject,
    projectsById
  };
};

const mapDispatchToProps = dispatch => {
  return {
    save: project => {
      dispatch(saveProject(project));
    },
    addProject: (history, newTitle) => {
      dispatch(createProject(newTitle));
      dispatch(navigateToApp(history, true));
    },
    exportProjects: () => {
      dispatch(loadProjects());
    },
    setCurrentProject: (history, project) => {
      dispatch(saveProject(project));
      dispatch(navigateToApp(history, true));
    }
  };
};

ProjectForm.propTypes = {
  edit: PropTypes.bool,
  valid: PropTypes.bool,
  save: PropTypes.func,
  handleSubmit: PropTypes.func,
  reset: PropTypes.func,
  classes: PropTypes.object,
  addProject: PropTypes.func,
  exportProjects: PropTypes.func,
  setCurrentProject: PropTypes.func,
  history: PropTypes.any.isRequired,
  projects: PropTypes.array,
  timesheetFiles: PropTypes.object,
  sharedFiles: PropTypes.array,
  otherFiles: PropTypes.array,
  currentProject: PropTypes.any,
  projectsById: PropTypes.object
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(reduxForm({ form: "project", validate })(ProjectForm)))
);
