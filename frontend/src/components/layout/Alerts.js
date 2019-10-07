import React, { Component, Fragment } from "react";
import { withAlert } from "react-alert";
import { connect } from "react-redux";
import PropTypes from "prop-types";

export class Alerts extends Component {
  static propTypes = {
    error: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired
  };

  componentDidUpdate(previousProps) {
    const { error, alert, message } = this.props;

    if (error !== previousProps.error) {
      if (error.message.name) {
        alert.error(`Name: ${error.message.name.join()}`);
      }
      if (error.message.ip) {
        alert.error(`IP: ${error.message.ip.join()}`);
      }
      if (error.message.recurringTime) {
        alert.error(`Recurring Time: ${error.message.recurringTime.join()}`);
      }
      if (error.message.non_field_errors) {
        alert.error(error.message.non_field_errors.join());
      }
      if (error.message.username) {
        alert.error(error.message.username.join());
      }
    }

    if (message !== previousProps.message) {
      if (message.addServer) alert.success(message.addServer);
      if (message.deleteServer) alert.success(message.deleteServer);
      if (message.passwordNotMatch) alert.error(message.passwordNotMatch);
    }
  }

  render() {
    return <Fragment />;
  }
}

const mapStateToProps = state => ({
  error: state.errors,
  message: state.messages
});

export default connect(mapStateToProps)(withAlert()(Alerts));
