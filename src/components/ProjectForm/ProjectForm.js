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
  exportProjects
} from "../../logic/actions/actions";
import { withRouter } from "react-router-dom";

import TextField from "../TextField/TextField";
import GenericButton from "../Button/Button";
import DownloadIcon from "@material-ui/icons/CloudDownload";

import { uuid } from "../../logic/helpers";

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
    const selectedProjectId = event.target.value  
    this.setState({
      selectedProjectId,
    });
    const selectedProject = this.props.projects.find(p => p.id === selectedProjectId)
    this.props.setCurrentProject(this.props.history, selectedProject);    
  };

  renderExportPaper() {
    const props = this.props;
    return (
      <Grid item xs={12}>
        <Paper className={props.classes.control} style={{ margin: "10px" }}>
          <Typography variant="title">Export your time sheets</Typography>
          <Button
            onClick={() => props.exportProjects(props.history)}
            variant="contained"
            size="small"
            className={props.classes.button}
          >
            <DownloadIcon
              className={classNames(
                props.classes.leftIcon,
                props.classes.iconSmall
              )}
            />
            Export
          </Button>
          <Grid container spacing={16} justify="center">
            {Object.keys(props.files).map(k => (
              <Grid key={k} item xs={12} md={6}>
                <a href={props.files[k]}>
                  <Typography variant="body2">{props.files[k]}</Typography>
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
                  name="id"
                  label="Project Id"
                  type="text"
                  fullWidth
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
                {props.projects && Object.keys(props.projects).map(k => (
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  const currentProject = state.projectlist.currentProject;
  return {
    initialValues: currentProject
      ? { id: currentProject.id, title: currentProject.title }
      : { id: uuid() },
    edit: !!currentProject,
    projects: state.projectlist.projects,
    files: state.projectlist.files || [],
    currentProject
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
      dispatch(exportProjects());
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
  files: PropTypes.array,
  currentProject: PropTypes.any
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(reduxForm({ form: "project", validate })(ProjectForm)))
);
