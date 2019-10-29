import React, { Component } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { Paper, Typography } from "@material-ui/core";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { saveProject } from "../../logic/actions/actions";

import TextField from "../TextField/TextField";
import GenericButton from "../Button/Button";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  control: {
    padding: theme.spacing(2)
  }
});

const validate = values => {
  const errors = {};
  if (values.newTitle && values.newTitle.length < 2) {
    errors.newTitle = "Title too short";
  } else if (!values.title) {
    errors.title = "No title set";
  }

  return errors;
};

const readOnlyText = field => {
  return <small style={{ color: "gray" }}>{field.meta.initial}</small>;
};

class ProjectForm extends Component {
  render() {
    const { handleSubmit, save, classes, valid, edit } = this.props;
    return (
      <form onSubmit={handleSubmit(save)}>
        <Paper className={classes.control} style={{ margin: "10px" }}>
          <Typography variant="h3">Edit current project</Typography>
          <Grid container className={classes.root} spacing={2} justify="center">
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
              {valid && (
                <GenericButton
                  invoke={() => null}
                  context={this.props}
                  type="submit"
                  icon={edit ? "save" : "add"}
                />
              )}
              {!valid && (
                <GenericButton type="submit" icon={edit ? "save" : "add"} />
              )}
            </Grid>
          </Grid>
        </Paper>
      </form>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const currentProject = ownProps.currentProject;
  return {
    edit: !!currentProject,
    currentProject,
    initialValues:
      currentProject && currentProject.id
        ? {
            id: currentProject.id,
            title: currentProject.title,
            filename: currentProject.filename,
            customer: currentProject.customer
          }
        : { id: "" }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    save: project => {
      dispatch(saveProject(project));
    }
  };
};

ProjectForm.propTypes = {
  edit: PropTypes.bool,
  valid: PropTypes.bool,
  save: PropTypes.func,
  handleSubmit: PropTypes.func,
  classes: PropTypes.object,
  currentProject: PropTypes.any,
  initialValues: PropTypes.any
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withStyles(styles)(
    reduxForm({ form: "project", validate, enableReinitialize: true })(
      ProjectForm
    )
  )
);
