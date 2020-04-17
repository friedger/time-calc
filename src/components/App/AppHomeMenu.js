import React from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core';
import { navigateToApp } from '../../logic/actions/actions';
import { withRouter } from 'react-router-dom';

const styles = () => ({
  icon: {},
  primary: {},
});

class AppHomeMenu extends React.Component {
  state = {};

  static propTypes = {
    classes: PropTypes.object.isRequired,
    onHome: PropTypes.any,
    history: PropTypes.any,
  };

  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleClick = () => {
    this.props.onHome(this.props.history);
  };

  render() {
    return (
      <IconButton color="inherit" onClick={this.handleClick} aria-label="Close">
        <CloseIcon />
      </IconButton>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onHome: history => dispatch(navigateToApp(history)),
  };
};

export default withRouter(connect(null, mapDispatchToProps)(withStyles(styles)(AppHomeMenu)));
