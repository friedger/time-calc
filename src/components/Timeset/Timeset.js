import React from "react";
import PropTypes from "prop-types";

import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core/styles";

import { batchActions } from "redux-batched-actions";

import Moment from "moment";
import { connect } from "react-redux";

import withDialog from "../Dialog/Dialog";
import Button from "../Button/Button";

import { deleteTime, setField } from "../../logic/actions/actions";

const styles = theme => ({
  hideMobile: {
    [theme.breakpoints.down("xs")]: {
      display: "none !important"
    }
  },

  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    },
    "& button": {
      opacity: 0
    },
    "&:hover": {
      "& button": {
        opacity: 1
      }
    }
  },

  important: {
    // fontWeight: 'bold',
  }
});

export const Timeset = ({ classes, time, onEditTime, toggleDialog, readOnly }) => {
  if (time == null) {
    return (
      <TableRow className={classes.row}>
        <TableCell className={classes.important}>Invalid time</TableCell>
      </TableRow>
    );
  }
  const date = new Moment(time.date, "L").format("LL"); // TODO should be refactored out into time utils
  return (
    <TableRow className={classes.row}>
      <TableCell className={classes.important}>{date}</TableCell>
      <TableCell className={classes.hideMobile}>{time.description}</TableCell>
      <TableCell className={classes.hideMobile} numeric>
        {time.start}
      </TableCell>
      <TableCell className={classes.hideMobile} numeric>
        {time.end}
      </TableCell>
      <TableCell className={classes.hideMobile} numeric>
        {time.break}
      </TableCell>
      <TableCell className={classes.important} numeric>
        {time.duration}
      </TableCell>
      {!readOnly && (
        <TableCell>
          <Button
            invoke={() => onEditTime({ time: time })}
            label="Edit"
            icon="edit"
          />
          <Button
            color="secondary"
            invoke={() =>
              toggleDialog(
                time,
                "Delete Time?",
                "really delete this TimeRecord?"
              )
            }
            label="Delete"
            icon="delete"
          />
        </TableCell>
      )}
    </TableRow>
  );
};

Timeset.propTypes = {
  toggleDialog: PropTypes.func,
  time: PropTypes.object.isRequired,
  onEditTime: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  readOnly: PropTypes.string
};

export const StyledTimeset = withStyles(styles)(Timeset);

const mapDispatchToProps = dispatch => {
  return {
    onOk: time => dispatch(deleteTime(time)),
    onEditTime: time =>
      dispatch(
        batchActions([
          setField("start", time.time.start),
          setField("end", time.time.end),
          setField("date", time.time.date),
          setField("break", time.time.break),
          setField("duration", time.time.duration),
          setField("id", time.time.id),
          setField("projectId", time.time.projectId),
          setField("description", time.time.description)
        ])
      )
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withDialog(StyledTimeset));
