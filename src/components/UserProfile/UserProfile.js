import React from 'react';
import PropTypes from 'prop-types';
import BlockstackSignInButton from './BlockstackSignInButton'

import { connect } from 'react-redux'
import { userSignIn, userSignOut} from '../../logic/actions/actions'

const UserProfile = (props) => {
  const {
    isSignedIn,
    isConnecting,
    name,
    avatarUrl,
    message
  } = props;

  if (isSignedIn) {
    return (
      <div>
      <img src={avatarUrl} alt=""/> {name}
      <BlockstackSignInButton
        signIn = {props.userSignIn}
        signOut = {props.userSignOut}
      />
      </div>
    )
  }
  if (isConnecting) {
    return (
      <div>
      {message}
      </div>
    );
  }
  return (
    <BlockstackSignInButton
      signIn = {props.userSignIn}
      signOut = {props.userSignOut}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.user != null,
    isConnecting: state.user == null && state.userMessage === 'Connecting',
    name: state.user != null ? state.user.name : null,
    avatarUrl: state.user != null ? state.user.profileUrl : null,
    message:  state.userMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    userSignIn: (component) => dispatch(userSignIn()),
    userSignOut: (component) => dispatch(userSignOut())
    }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
