import React from 'react';
import PropTypes from 'prop-types';


const imageDefaultStyle = {
  height: 20,
};
const textDefaultStyle = {
  fontSize: 12,
  fontFamily: '"Source Code Pro", monospace',
  paddingLeft: 5,
  verticalAlign: 'top',
  top: 3,
  position: 'relative',
  color: '#fff',
};

const BlockstackSignInButton = (props) => {
  const {
    renderNothing,
    signOutBtnText,
    signInBtnText,
    includeBlockstackLogo,
    signInStyle,
    signOutStyle,
    isSignedIn,
    imageStyle,
    textStyle,
    style,
  } = props;

  let {
    defaultStyle,
  } = props;

  if (renderNothing) {
    return (null);
  }

  // If style isn't set then render default styling.
  if (!defaultStyle) {
    defaultStyle = {
      display: 'inline-block',
      backgroundColor: '#270F34',
      border: '1px solid #270F34',
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 15,
      paddingRight: 15,
      borderRadius: 2,
    };
  }


  const imageInlineStyle = Object.assign({}, imageDefaultStyle, imageStyle);
  const image = (includeBlockstackLogo) ? (
    <img
      src="https://media.githubusercontent.com/media/blockstack/designs/master/app-icons/assets/blockstack-app-icon-1024x1024.png"
      alt="Blockstack Logo"
      style={imageInlineStyle}
    />
  ) : (null);

  const textInlineStyle = Object.assign({}, textDefaultStyle, textStyle);


  const signOutInlineStyle = Object.assign({}, defaultStyle, style, signOutStyle);
  if (isSignedIn) {
    return (
      <button
        onClick={props.signOut}
        style={signOutInlineStyle}
      >
        {
          image
        }
        <span style={textInlineStyle}>
          {signOutBtnText}
        </span>
      </button>
    );
  }

  const signInInlineStyle = Object.assign({}, defaultStyle, style, signInStyle);
  return (
    <button
      onClick={props.signIn}
      style={signInInlineStyle}
    >
      {
        image
      }
      <span style={textInlineStyle}>
        {signInBtnText}
      </span>
    </button>
  );
};

BlockstackSignInButton.propTypes = {
  renderNothing: PropTypes.bool,
  signOutBtnText: PropTypes.string,
  signInBtnText: PropTypes.string,
  includeBlockstackLogo: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  defaultStyle: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  imageStyle: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  textStyle: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  signInStyle: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  signOutStyle: PropTypes.object,
  isSignedIn: PropTypes.bool.isRequired,
  signOut: PropTypes.func.isRequired,
  signIn: PropTypes.func.isRequired,
};

BlockstackSignInButton.defaultProps = {
  renderNothing: false,
  signOutBtnText: 'Sign Out',
  signInBtnText: 'Sign In with Blockstack',
  includeBlockstackLogo: true,
  defaultStyle: null,
  style: {},
  signInStyle: {},
  signOutStyle: {},
  imageStyle: {},
  textStyle: {},
};

export default BlockstackSignInButton;
