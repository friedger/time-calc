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
import { withStyles, Dialog, DialogTitle } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import {
  requestApproval,
  navigateToProjects
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
    pickContact: false,
    customerCopyDialogOpen: false
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestApproval: PropTypes.any,
    onProjectSettings: PropTypes.any,
    history: PropTypes.any,
    signedIn: PropTypes.bool.isRequired,
    hasCustomer: PropTypes.bool.isRequired,
    currentProject: PropTypes.object,
    customerCopySaved: PropTypes.bool,
    customerCopyUrl: PropTypes.string,
    shareUrl: PropTypes.string
  };

  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuItemClick = (event, item) => {
    const { currentProject } = this.props;

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
      if (currentProject && currentProject.customer) {
        this.handleDialogClickOpen();
        this.props.onRequestApproval(currentProject.customer);
      }
    } else if (item === MENU_PROJECTS) {
      this.props.onProjectSettings(this.props.history);
    }
    this.handleClose();
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleDialogClickOpen = () => {
    this.setState({ customerCopyDialogOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ customerCopyDialogOpen: false });
  };

  render() {
    const {
      classes,
      signedIn,
      hasCustomer,
      customerCopySaved,
      shareUrl
    } = this.props;
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
          anchorEl={anchorEl}
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
          {signedIn && hasCustomer && (
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
                primary="Share with customer"
              />
            </MenuItem>
          )}
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
        <Dialog
          open={this.state.customerCopyDialogOpen}
          onClose={this.handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Customer Copy"}
          </DialogTitle>
          {customerCopySaved && (
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                A copy has been stored for your customer/reviewer.                
              </DialogContentText>
              <DialogContentText id="alert-dialog-description">
                Please share with <b>{this.props.currentProject.customer}</b> the link below <br/>
                <a href={shareUrl}>{shareUrl}</a>               
              </DialogContentText>
            </DialogContent>
          )}
          {!customerCopySaved && (
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Copy for your customer is currently generated.... please wait!
              </DialogContentText>
            </DialogContent>
          )}
          {customerCopySaved && (
            <DialogActions>
              <Button
                onClick={this.handleDialogClose}
                color="primary"
                autoFocus
              >
                Ok
              </Button>
            </DialogActions>
          )}
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  let shareUrl;
  if (state.projectlist.currentProject && state.userProfile.user) {
    shareUrl = window.origin + "/#/shared/" + state.userProfile.user.username + "/" + state.projectlist.currentProject.id + "/" + state.projectlist.currentProject.filename;
  }
  return {
    currentProject: state.projectlist.currentProject,
    signedIn: !!state.userProfile.user && !state.userProfile.userMessage,
    hasCustomer: !!state.projectlist.currentProject.customer,
    customerCopySaved: !!state.syncState.customerCopySaved,
    customerCopyUrl: state.syncState.customerCopyUrl,
    shareUrl
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onRequestApproval: userId => dispatch(requestApproval(userId)),
    onProjectSettings: history => dispatch(navigateToProjects(history))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(AppMenu))
);
