import React from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";

import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import {
  fetchCalculation,
  save,
  resetCalculation
} from "../../logic/actions/actions";

import TimeField from "../TimeField/TimeField";
import DateField from "../DateField/DateField";
import TextField from "../TextField/TextField";
import Button from "../Button/Button";
import { TimeHelper } from "../../logic/helpers";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  control: {
    padding: theme.spacing(2)
  }
});

const validate = (values, props) => {
  const errors = {};

  if (!values.start && !values.end) {
    errors.duration = "No Start or End Time set";
  }

  if (!Object.keys(errors).length) {
    props.calculate(values);
  }

  return errors;
};

const Form = props => (
  <form
    onSubmit={props.handleSubmit(values =>
      props.save(values, props.currentProject)
    )}
  >
    <Paper className={props.classes.control}>
      <Grid
        container
        className={props.classes.root}
        spacing={2}
        justify="center"
      >
        <Grid item xs={12}>
          <Field
            name="description"
            label="Description"
            fullWidth
            component={TextField}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Field name="start" label="Start Time" component={TimeField} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Field name="end" label="End Time" component={TimeField} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Field
            name="break"
            label="Break Time"
            defaultValue="00:00"
            component={TimeField}
            showPicker={false}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Field name="date" label="Day" component={DateField} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Field
            name="duration"
            label="Duration"
            component={TimeField}
            showPicker={false}
            disabled
            defaultValue="00:00"
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
          {!props.valid && (
            <Button
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
  const edit = !!(state.form.time && state.form.time.values
    ? state.form.time.values.id !== undefined
    : undefined);

  return {
    initialValues: edit
      ? undefined
      : { break: "00:00", date: TimeHelper.today() },
    edit,
    currentProject: state.projectlist.currentProject
  };
};

const mapDispatchToProps = dispatch => {
  return {
    calculate: formValue => dispatch(fetchCalculation(formValue)),
    reset: () => dispatch(resetCalculation()),
    save: (values, currentProject) => {
      dispatch(save(values, currentProject.id));
      dispatch(resetCalculation());
    }
  };
};

Form.propTypes = {
  edit: PropTypes.bool,
  valid: PropTypes.bool,
  save: PropTypes.func,
  handleSubmit: PropTypes.func,
  reset: PropTypes.func,
  classes: PropTypes.object,
  currentProject: PropTypes.object
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(reduxForm({ form: "time", validate })(Form)));
