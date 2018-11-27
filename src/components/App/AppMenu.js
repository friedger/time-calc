import React from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ShareIcon from "@material-ui/icons/Share";
import SettingsIcon from "@material-ui/icons/Settings";
import { withStyles } from "@material-ui/core";
import {
  requestApproval,
  navigateToProjects,
} from "../../logic/actions/actions";
import { withRouter } from "react-router-dom";

const ITEM_HEIGHT = 48;
const MENU_PROJECTS = "projects";
const MENU_REQUEST_APPROVAL = "request_approval";
const MENU_SHARE = "share";

const styles = () => ({
  icon: {},
  primary: {}
});

class AppMenu extends React.Component {
  state = {
    anchorEl: null,
    pickContact: false
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestApproval: PropTypes.any,
    onProjectSettings: PropTypes.any,
    history: PropTypes.any,
    signedIn: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleClick = event => {
    // eslint-disable-next-line no-console
    console.log("currentTarget " + event.currentTarget);
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuItemClick = (event, item) => {
    if (item === MENU_SHARE) {
      try {
        // eslint-disable-next-line no-console
        console.log("nav.share " + navigator.share);
        navigator.share({ title: "OI Timesheet", url: "" });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Share failed:", err.message);
        alert("Couldn't share (" + err + ")");
      }
    } else if (item === MENU_REQUEST_APPROVAL) {
      this.props.onRequestApproval("friedger.id.blockstack");
      this.setState({ pickContact: true });
    } else if (item === MENU_PROJECTS) {
      this.props.onProjectSettings(this.props.history);
    }
    this.handleClose();
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, signedIn } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    /* Hide menu in PublicHomePage
    if (match.path === "/") {
      return null;
    }
    */

    return (
      <div>
        <IconButton
          aria-label="More"
          aria-owns={open ? "app-menu" : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="app-menu"
          open={open}
          onClose={this.handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 200
            }
          }}
        >
          <MenuItem
            // eslint-disable-next-line no-console
            onClick={event => {
              this.handleMenuItemClick(event, MENU_PROJECTS);
            }}
          >
            <ListItemIcon className={classes.icon}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.primary }}
              inset
              primary="Project settings"
            />
          </MenuItem>
          {signedIn &&
          <MenuItem
            // eslint-disable-next-line no-console
            onClick={event => {
              this.handleMenuItemClick(event, MENU_REQUEST_APPROVAL);
            }}
          >
            <ListItemIcon className={classes.icon}>
              <ShareIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.primary }}
              inset
              primary="Share to approve"
            />
          </MenuItem>
          }
          {navigator.share && (
            <MenuItem
              // eslint-disable-next-line no-console
              onClick={event => {
                this.handleMenuItemClick(event, MENU_SHARE);
              }}
            >
              <ListItemIcon className={classes.icon}>
                <ShareIcon />
              </ListItemIcon>
              <ListItemText
                classes={{ primary: classes.primary }}
                inset
                primary="Share app"
              />
            </MenuItem>
          )}
        </Menu>
      </div>
    );
  }
}

const mapStateToProps =  state => {
  return {
    signedIn: !!state.userProfile.user && !!state.userProfile.userMessage
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onRequestApproval: userId => dispatch(requestApproval(userId)),
    onProjectSettings: history => dispatch(navigateToProjects(history)),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(AppMenu))
);
