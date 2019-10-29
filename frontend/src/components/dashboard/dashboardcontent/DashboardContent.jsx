import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container, Row } from "react-bootstrap";
import styles from "./DashboardContent.less";
import { getPings, getSnmps } from "../../../actions/dashboard";
import PingPreview from "./pingpreview/PingPreview";
import SnmpPreview from "./snmppreview/SnmpPreview";

class DashboardContent extends React.Component {
  static propTypes = {
    serviceId: PropTypes.number.isRequired,
    pings: PropTypes.array,
    getPings: PropTypes.func.isRequired,
    snmps: PropTypes.array,
    getSnmps: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getPings(this.props.serviceId);
    this.props.getSnmps(this.props.serviceId);
  }

  render() {
    return (
      <Container className={styles.dashboardContent}>
        {this.props.pings && this.renderRow2(this.translatePingsToComponent())}
        {this.props.snmps && this.renderRow2(this.translateSnmpsToComponent())}
      </Container>
    );
  }

  renderRow2 = components => {
    let rows = [];
    for (let index = 0; index < components.length; index += 2) {
      rows.push(
        <Row className={styles.dashboardContent__row} key={index}>
          {components[index]}
          {components[index + 1]}
        </Row>
      );
    }
    return <>{rows}</>;
  };

  translatePingsToComponent = () => {
    return this.props.pings.map((ping, index) => {
      return (
        <PingPreview
          key={index}
          serviceId={this.props.serviceId}
          model={ping}
        />
      );
    });
  };

  translateSnmpsToComponent = () => {
    return this.props.snmps.map((snmp, index) => {
      return (
        <SnmpPreview
          key={index}
          serviceId={this.props.serviceId}
          model={snmp}
        />
      );
    });
  };
}

const mapStateToProps = state => ({
  pings: state.dashboard.pings,
  snmps: state.dashboard.snmps
});

export default connect(
  mapStateToProps,
  { getPings, getSnmps }
)(DashboardContent);
