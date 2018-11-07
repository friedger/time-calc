import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableFooter from '@material-ui/core/TableFooter'
import TableRow from '@material-ui/core/TableRow'

import Moment from 'moment'
import 'moment-duration-format'

import autoBind from 'react-autobind'
import {connect} from 'react-redux'
import {clearTimes, downloadTimes, loadTimes} from '../../logic/actions/actions'
import withDialog from '../Dialog/Dialog'
import Button from '../Button/Button'
import Timeset from '../Timeset/Timeset'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  important: {
    // fontWeight: 'bold',
  },

  hideMobile: {
    [theme.breakpoints.down('xs')]: {
      display: 'none !important'
    }
  }
})

export class TimeList extends React.PureComponent {
  static defaultProps = {
    times: {},
    deleteAllTitle: 'Delete all TimeRecords?',
    deleteAllHelp: 'Do you really want to wipe out all Data?'
  };

  static propTypes = {
    toggleDialog: PropTypes.func,
    times: PropTypes.array,
    load: PropTypes.func.isRequired,
    download: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    deleteAllHelp: PropTypes.string,
    deleteAllTitle: PropTypes.string
  }

  constructor (props) {
    super(props)

    autoBind(this)
  }

  componentDidMount () {
    this.props.load()
  }

  calculateSum () {
    let durationSum = Moment.duration('00:00')
    this.props.times
      .filter(t => t != null && t.start && t.end)
      .map(t => durationSum.add(t.duration))
    return durationSum.format('HH:mm', {trim: false})
  }

  render () {
    if (!this.props.times || !this.props.times.length) {
      return <div />
    }

    const sum = this.calculateSum()
    const {classes} = this.props

    return (
      <Table className={classes.table} id='times'>
        <TableHead>
          <TableRow>
            <TableCell className={classes.important} >Day</TableCell>
            <TableCell className={classes.hideMobile} >Description</TableCell>
            <TableCell className={classes.hideMobile} numeric>Start</TableCell>
            <TableCell className={classes.hideMobile} numeric>End</TableCell>
            <TableCell className={classes.hideMobile} numeric>Break</TableCell>
            <TableCell className={classes.important} numeric>Duration</TableCell>
            <TableCell>
              <Button invoke={() => this.props.download(this.props.times)} label='Download' icon='cloud_download' />
              <Button color='secondary' invoke={() => this.props.toggleDialog(this.props.times, this.props.deleteAllTitle, this.props.deleteAllHelp)} label='Delete' icon='delete' />
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          { Object.keys(this.props.times).map((k) => <Timeset key={k} time={this.props.times[k]} index={parseInt(k, 10)} />) }
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell />
            <TableCell />
            <TableCell className={classes.hideMobile} />
            <TableCell className={classes.hideMobile} />
            <TableCell className={classes.hideMobile} />
            <TableCell className={classes.important} numeric>{ sum }</TableCell>
            <TableCell className={classes.hideMobile} />
          </TableRow>
        </TableFooter>
      </Table>
    )
  }
}

export const StyledTimeList = withStyles(styles)(TimeList)

const mapStateToProps = (state) => {
  return {
    times: state.timelist.times
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    load: () => dispatch(loadTimes()),
    onOk: () => dispatch(clearTimes()),
    download: (times) => dispatch(downloadTimes(times))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDialog(StyledTimeList))
