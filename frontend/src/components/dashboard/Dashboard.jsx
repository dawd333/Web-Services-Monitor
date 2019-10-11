import React, {Component, Fragment} from "react";
import {withAlert} from "react-alert";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Alerts} from "../layout/Alerts";
import styles from "./Dashboard.less"

export class Dashboard extends Component {
  static propTypes = {

  };



  render() {
    return (
      <div className={styles.dashboard}>
        {"hello world"}
      </div>
    )
  }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps)(withAlert()(Alerts));
