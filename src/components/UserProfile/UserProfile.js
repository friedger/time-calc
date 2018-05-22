import React from 'react';
import BlockstackSignInButton from './BlockstackSignInButton'

import { connect } from 'react-redux'
import { userSignIn, userSignOut} from '../../logic/actions/actions'

import PropTypes from 'prop-types';

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

UserProfile.propTypes = {
  isSignedIn: PropTypes.boolean,
  isConnecting: PropTypes.boolean,
  name: PropTypes.string,
  avatarUrl: PropTypes.string,
  message: PropTypes.string,
  userSignIn: PropTypes.func,
  userSignOut: PropTypes.func
}
const mapStateToProps = (state) => {
  return {
    isSignedIn: state.userProfile.user != null,
    isConnecting: state.userProfile.user == null && state.userProfile.userMessage === 'Connecting',
    name: state.userProfile.user != null ? state.userProfile.user.profile.name : null,
    avatarUrl: state.userProfile.user != null ? state.userProfile.user.profile.image[0].contentUrl : null,
    message:  state.userProfile.userMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    userSignIn: () => dispatch(userSignIn()),
    userSignOut: () => dispatch(userSignOut())
    }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
