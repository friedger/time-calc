import React from "react";
import autoBind from "react-autobind";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import Slide from "@material-ui/core/Slide";

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));
Transition.displayName = "SlideUp";

export default WrappedComponent => {
  return withMobileDialog()(
    class WrappedDialog extends React.PureComponent {
      static propTypes = {
        onOk: PropTypes.func.isRequired,
        fullScreen: PropTypes.bool.isRequired
      };

      state = {
        open: false,
        title: "",
        help: "",
        context: null
      };

      constructor(props) {
        super(props);

        autoBind(this);
      }

      handleOk = () => {
        this.handleClose();
        this.props.onOk(this.state.context);
      };

      handleClose = () => {
        this.setState({ open: false });
      };

      toggleDialog(context, title, help) {
        this.setState({ open: !this.state.open, title, help, context });
      }

      render() {
        const { fullScreen } = this.props;

        return (
          <React.Fragment>
            <WrappedComponent
              {...this.props}
              toggleDialog={this.toggleDialog}
            />
            <Dialog
              fullScreen={fullScreen}
              open={this.state.open}
              onClose={this.handleClose}
              TransitionComponent={Transition}
              keepMounted
              aria-labelledby={this.state.title.replace(" ", "-").toLowerCase()}
            >
              <DialogTitle
                id={this.state.title.replace(" ", "-").toLowerCase()}
              >
                {this.state.title}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>{this.state.help}</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Gimme a Sec
                </Button>
                <Button onClick={this.handleOk} color="primary" autoFocus>
                  Do It
                </Button>
              </DialogActions>
            </Dialog>
          </React.Fragment>
        );
      }
    }
  );
};
