import React from "react";
import autoBind from "react-autobind";
import PropTypes from "prop-types";

import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ShareIcon from "@material-ui/icons/Share";
import { withStyles } from "@material-ui/core";

const ITEM_HEIGHT = 48;
const styles = () => ({
  icon: {},
  primary: {}
});

class AppMenu extends React.Component {
  state = {
    anchorEl: null
  };

  static propTypes = {
    classes: PropTypes.object.isRequired
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
    if (item === "share") {
        try {
            // eslint-disable-next-line no-console
            console.log("nav.share " + navigator.share)
            navigator.share({ title: "OI Timesheet", url: "" });
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Share failed:", err.message);
          }
    }
  }

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
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
          onClick={(event) => {console.log("nav.share " + navigator.share);this.handleMenuItemClick(event, "share")}}>
            <ListItemIcon className={classes.icon}>
              <ShareIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.primary }}
              inset
              primary="Share"
            />
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default withStyles(styles)(AppMenu);
