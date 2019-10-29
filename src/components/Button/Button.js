import React from "react";
// import './Button.css'
// import 'material-design-lite/src/button/button'
import PropTypes from "prop-types";

import IconButton from "@material-ui/core/IconButton";
import { Icon } from "@material-ui/core";

const GenericButton = ({ invoke, context, classes, icon, type, color }) => (
  <IconButton
    disabled={!invoke}
    variant="raised"
    color={color || "primary"}
    className={classes}
    type={type || "button"}
    onClick={() => (type ? true : invoke(context))}
  >
    <Icon className="material-icons">{icon}</Icon>
  </IconButton>
);

GenericButton.propTypes = {
  invoke: PropTypes.func,
  context: PropTypes.any,
  classes: PropTypes.string,
  icon: PropTypes.string,
  type: PropTypes.string,
  color: PropTypes.string
};

export default GenericButton;
