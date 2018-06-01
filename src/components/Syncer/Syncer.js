import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

const Syncer = (props) => {
  const {
    hasChanges,
    isSyncing,
    allSynced,
    error
  } = props;

  if (error) {
      return (<div>{error}</div>)
  }
  if (hasChanges) {
    return (<div>*</div>)
  } else if (isSyncing) {
    return (<div>Syncing ...</div>)
  } else if (allSynced) {
    return (<div>Saved.</div>)
  }
  return <div>Sync state</div>
}

Syncer.propTypes = {
  hasChanges: PropTypes.boolean,
  isSyncing: PropTypes.boolean,
  allSynced: PropTypes.boolean,
  error: PropTypes.string
}

const mapStateToProps = (state) => {
  // eslint-disable-next-line no-console
  console.log("state:" + state)
  return {
    hasChanges: state.syncState.hasChanges,
    isSyncing: state.syncState.isSyncing,
    allSynced: state.syncState.allSynced,
    error: state.syncState.error
  }
}

export default connect(
  mapStateToProps,
  null
)(Syncer);
