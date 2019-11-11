import React from "react";
import PropTypes from "prop-types";
import styles from "./SimpleTooltip.less"

export class SimpleTooltip extends React.Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div className={styles.tooltip}>
        {this.props.content}
      </div>
    );
  }

}
