import React from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";

import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { saveProject } from "../../logic/actions/actions";

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
  return <small style={{color:"gray"}}>{field.meta.initial}</small>;
};

const ProjectForm = props => (
  <form onSubmit={props.handleSubmit(props.save)}>
    <Paper className={props.classes.control}>
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
);

const mapStateToProps = state => {
  const currentProject = state.projectlist.currentProject;
  return {
    initialValues: currentProject ? { id: currentProject.id, title:currentProject.title } : {id:uuid()},
    edit: !!currentProject
  };
};

const mapDispatchToProps = dispatch => {
  return {
    save: (project) => {
      // eslint-disable-next-line no-console
      console.log("save project ", project);
      dispatch(saveProject(project));
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(reduxForm({ form: "project", validate })(ProjectForm)));
