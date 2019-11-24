import React, { Component } from "react";
import { connect } from "react-redux";
import { changeView, deleteSnmp } from "../../../actions/dashboard";
import styles from "./StatusPageContent.less";
import Container from "react-bootstrap/Container";

class StatusPageContent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container className={styles.statusPageContent}>
        <h4 className={styles.statusPageContent__header}>
          {this.props.data.name}
        </h4>
        <hr />
        {this.renderPings()}
      </Container>
    );
  }

  renderPings = () => {
    // TODO
  };

  renderSnmp = () => {
    // TODO
  };

  renderHealthCheck = () => {
    // TODO
  };
}

const mapStateToProps = state => ({
  data: state.statuspage.data
});

export default connect(mapStateToProps, {
  changeView,
  deleteSnmp
})(StatusPageContent);
