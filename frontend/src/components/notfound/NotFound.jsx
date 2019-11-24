import React, {Component} from "react";
import {Container} from "react-bootstrap";
import styles from "./NotFound.less";
import PropTypes from "prop-types";

export class NotFound extends Component {
  static propTypes = {
    message: PropTypes.string,
  };

  render() {
    return (
      <Container className={styles.notFound}>
        <h1>
          {"404 Not found"}
        </h1>
        <h3>{this.props.message}</h3>
      </Container>
    )
  }
}
