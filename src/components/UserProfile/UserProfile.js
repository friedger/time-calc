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
      <img src={avatarUrl} width="100" height="100" alt=""/><br/>
      {name}
      <br/>
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
      isSignedIn = {props.isSignedIn}
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
  const user = state.userProfile.user;
  const profile = user != null ? state.userProfile.user.profile : null;
  return {
    isSignedIn: user != null,
    isConnecting: user == null && state.userProfile.userMessage === 'Connecting',
    name: profile != null ? profile.name : null,
    avatarUrl: profile != null && "image" in profile && profile.image.length > 0 ? profile.image[0].contentUrl : null,
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
