import React, { Component } from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { Paper, Typography } from "@material-ui/core";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import {
  saveProject,
  createProject,
  navigateToApp
} from "../../logic/actions/actions";
import { withRouter } from "react-router-dom";

import TextField from "../TextField/TextField";
import Button from "../Button/Button";
import { uuid } from "../../logic/helpers";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  control: {
    padding: theme.spacing.unit * 2
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
    newTitle: ""
  };

  constructor() {
    super() 
  }

  onNewTitleChanged = (event) => {
    this.setState({
      newTitle: event.target.value
    });
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
                  <Button
                    invoke={() => null}
                    context={props}
                    type="submit"
                    icon={props.edit ? "save" : "add"}
                  />
                )}
                {props.edit && (
                  <Button
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
        <Paper className={props.classes.control} style={{ margin: "10px" }}>
          <Typography variant="title">Create new project</Typography>
          <Field
            name="newTitle"
            label="Customer/Project title"
            type="text"
            fullWidth
            onChange={this.onNewTitleChanged}
            component={TextField}
          />
          <Button
            invoke={() => props.addProject(props.history, this.state.newTitle)}
            context={props}
            icon={"add"}
          />
        </Paper>

        <Grid container>
          <Grid item xs={12} sm={6}>
            <Paper className={props.classes.control} style={{ margin: "10px" }}>
              <Typography variant="title">All local projects</Typography>
              <Grid container spacing={16} justify="center">
                {Object.keys(props.projects).map(k => (
                  <Grid key={k} item container justify="center">
                    <Grid item xs={12} md={8}>
                      <a href={props.projects[k].remoteUrl}>
                        <Typography variant="body1">
                          {props.projects[k].title}
                        </Typography>
                      </a>
                    </Grid>
                    <Grid item xs={12} md={4} zeroMinWidth>
                      <Typography
                        variant="body2"
                        style={{ color: "gray" }}
                        noWrap
                      >
                        {props.projects[k].id}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper className={props.classes.control} style={{ margin: "10px" }}>
              <Typography variant="title">All remote projects</Typography>
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
    files: state.projectlist.files || []
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
  history: PropTypes.any.isRequired,
  projects: PropTypes.array,
  files: PropTypes.array
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(reduxForm({ form: "project", validate })(ProjectForm)))
);
