import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styles from "./Dashboard.less";
import { Service } from "../../actions/types";
import SideNav from "./sidenav/SideNav";

export class Dashboard extends React.Component {
  static propTypes = {
    services: PropTypes.arrayOf(PropTypes.shape(Service))
  };

  render() {
    return (
      <div className={styles.dashboard}>
        <SideNav />
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Dashboard);
