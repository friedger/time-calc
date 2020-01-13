import React, { useState } from "react";
import BlockstackSignInButton from "./BlockstackSignInButton";

import { connect } from "react-redux";
import { userSignIn, userSignOut } from "../../logic/actions/actions";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";

const styles = () => ({
  root: {
    textAlign: "center"
  },
  avatar: {
    borderRadius: "50%",
    height: "20px",
    width: "20px"
  }
});

const UserProfile = props => {
  const { isSignedIn, isConnecting, name, avatarUrl, message, classes } = props;
  const [imgSrc, setImgSrc] = useState("/blockstack.png");
  if (isSignedIn) {
    const image = <img src={imgSrc} alt={name} className={classes.avatar} />;
    fetch(avatarUrl)
      .then(r => r.blob())
      .then(content => {
        const imgData = URL.createObjectURL(content);
        setImgSrc(imgData);
      });
    return (
      <div className={classes.root}>
        <BlockstackSignInButton
          signIn={props.userSignIn}
          signOut={props.userSignOut}
          isSignedIn={props.isSignedIn}
          img={image}
          includeBlockstackLogo={false}
        />
      </div>
    );
  }
  if (isConnecting) {
    return <div>{message}</div>;
  }
  return (
    <BlockstackSignInButton
      signIn={props.userSignIn}
      signOut={props.userSignOut}
      isSignedIn={props.isSignedIn}
    />
  );
};

UserProfile.propTypes = {
  isSignedIn: PropTypes.bool,
  isConnecting: PropTypes.bool,
  name: PropTypes.string,
  avatarUrl: PropTypes.string,
  message: PropTypes.string,
  userSignIn: PropTypes.func,
  userSignOut: PropTypes.func,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const user = state.userProfile.user;
  const profile = user != null ? state.userProfile.user.profile : null;
  return {
    isSignedIn: user != null,
    isConnecting:
      user == null && state.userProfile.userMessage === "Connecting",
    name: profile != null ? profile.name : null,
    avatarUrl:
      profile != null && "image" in profile && profile.image.length > 0
        ? profile.image[0].contentUrl
        : null,
    message: state.userProfile.userMessage
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userSignIn: () => dispatch(userSignIn()),
    userSignOut: () => dispatch(userSignOut())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(UserProfile));
