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
        alert.error(`Username: ${error.message.username.join()}`);
      }
      if (error.message.password) {
        alert.error(`Password: ${error.message.password.join()}`);
      }
      if (error.message.platform) {
        alert.error(`Platform: ${error.message.platform.join()}`);
      }
      if (error.message.authentication_password) {
        alert.error(
          `Authentication Password: ${error.message.authentication_password.join()}`
        );
      }
      if (error.message.privacy_password) {
        alert.error(
          `Privacy Password: ${error.message.privacy_password.join()}`
        );
      }
      if (error.status === 500) {
        alert.error("Internal Server Error");
      }
    }

    if (message !== previousProps.message) {
      if (message.passwordNotMatch) alert.error(message.passwordNotMatch);
      if (message.addService) alert.success(message.addService);
      if (message.updateService) alert.success(message.updateService);
      if (message.deleteService) alert.success(message.deleteService);
      if (message.addPing) alert.success(message.addPing);
      if (message.updatePing) alert.success(message.updatePing);
      if (message.deletePing) alert.success(message.deletePing);
      if (message.addSnmp) alert.success(message.addSnmp);
      if (message.updateSnmp) alert.success(message.updateSnmp);
      if (message.deleteSnmp) alert.success(message.deleteSnmp);
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
