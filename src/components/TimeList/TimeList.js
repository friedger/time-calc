import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";

import Moment from "moment";
import "moment-duration-format";

import autoBind from "react-autobind";
import { connect } from "react-redux";
import { clearTimes, downloadTimes } from "../../logic/actions/actions";
import withDialog from "../Dialog/Dialog";
import Button from "../Button/Button";
import Timeset from "../Timeset/Timeset";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  important: {
    // fontWeight: 'bold',
  },

  hideMobile: {
    [theme.breakpoints.down("xs")]: {
      display: "none !important"
    }
  }
});

export class TimeList extends React.PureComponent {
  static defaultProps = {
    times: {},
    deleteAllTitle: "Delete all TimeRecords?",
    deleteAllHelp: "Do you really want to wipe out all Data?"
  };

  static propTypes = {
    toggleDialog: PropTypes.func,
    times: PropTypes.array,
    sharedTimes: PropTypes.array,
    projects: PropTypes.array,
    download: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    deleteAllHelp: PropTypes.string,
    deleteAllTitle: PropTypes.string,
    readOnly: PropTypes.string
  };

  constructor(props) {
    super(props);

    autoBind(this);
  }

  calculateSum(times) {
    let durationSum = Moment.duration("00:00");
    times
      .filter(t => t != null && t.start && t.end)
      .map(t => durationSum.add(t.duration));
    return durationSum.format("HH:mm", { trim: false });
  }

  render() {
    // eslint-disable-next-line no-console
    console.log("props", this.props);
    const { classes, readOnly } = this.props;
    const times = readOnly ? this.props.sharedTimes : this.props.times;
    if (!times || !times.length) {
      return <div />;
    }

    const sum = this.calculateSum(times);

    return (
      <Table className={classes.table} id="times">
        <TableHead>
          <TableRow>
            <TableCell className={classes.important}>Day</TableCell>
            <TableCell className={classes.hideMobile}>Description</TableCell>
            <TableCell className={classes.hideMobile} align="right">
              Start
            </TableCell>
            <TableCell className={classes.hideMobile} align="right">
              End
            </TableCell>
            <TableCell className={classes.hideMobile} align="right">
              Break
            </TableCell>
            <TableCell className={classes.important} align="right">
              Duration
            </TableCell>
            {!readOnly && (
              <TableCell>
                <Button
                  invoke={() => this.props.download(times)}
                  label="Download"
                  icon="cloud_download"
                />
                <Button
                  color="secondary"
                  invoke={() =>
                    this.props.toggleDialog(
                      times,
                      this.props.deleteAllTitle,
                      this.props.deleteAllHelp
                    )
                  }
                  label="Delete"
                  icon="delete"
                />
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {Object.keys(times).map(k => (
            <Timeset key={k} time={times[k]} readOnly={readOnly} />
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell />
            <TableCell />
            <TableCell className={classes.hideMobile} />
            <TableCell className={classes.hideMobile} />
            <TableCell className={classes.hideMobile} />
            <TableCell className={classes.important} align="right">
              {sum}
            </TableCell>
            {!readOnly && <TableCell className={classes.hideMobile} />}
          </TableRow>
        </TableFooter>
      </Table>
    );
  }
}

export const StyledTimeList = withStyles(styles)(TimeList);

const mapStateToProps = state => {
  return {
    times: state.timelist.times,
    sharedTimes: state.sharedTimesheet.times
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onOk: () => dispatch(clearTimes()),
    download: times => dispatch(downloadTimes(times))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDialog(StyledTimeList));
