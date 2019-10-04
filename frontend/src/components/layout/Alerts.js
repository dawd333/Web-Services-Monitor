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
    }

    if (message !== previousProps.message) {
      if (message.addServer) alert.success(message.addServer);
      if (message.deleteServer) alert.success(message.deleteServer);
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
