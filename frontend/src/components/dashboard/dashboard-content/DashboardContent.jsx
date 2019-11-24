import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container, Row } from "react-bootstrap";
import styles from "./DashboardContent.less";
import { getServiceWithConfigurations } from "../../../actions/dashboard";
import PingPreview from "./ping-preview/PingPreview";
import SnmpPreview from "./snmp-preview/SnmpPreview";
import DjangoHealthChechPreview from "./django-health-check-preview/DjangoHealthCheckPreview";

class DashboardContent extends React.Component {
  static propTypes = {
    serviceId: PropTypes.number.isRequired,
    getServiceWithConfigurations: PropTypes.func.isRequired,
    pings: PropTypes.array,
    snmps: PropTypes.array,
    djangoHealthChecks: PropTypes.array
  };

  componentDidMount() {
    this.props.getServiceWithConfigurations(this.props.serviceId);
  }

  render() {
    return (
      <Container className={styles.dashboardContent}>
        {this.props.pings &&
          this.props.snmps &&
          this.props.djangoHealthChecks &&
          this.renderRow2(this.translateConfigurationsToComponents())}
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

  translateConfigurationsToComponents = () => {
    const pingPreviews = this.props.pings.map((ping, index) => {
      return (
        <PingPreview
          key={"ping_" + index}
          serviceId={this.props.serviceId}
          model={ping}
        />
      );
    });

    const snmpPreviews = this.props.snmps.map((snmp, index) => {
      return (
        <SnmpPreview
          key={"snmp_" + index}
          serviceId={this.props.serviceId}
          model={snmp}
        />
      );
    });

    const djangoHealthCheckPreviews = this.props.djangoHealthChecks.map(
      (djangoHealthCheck, index) => {
        return (
          <DjangoHealthChechPreview
            key={"django_health_check_" + index}
            serviceId={this.props.serviceId}
            model={djangoHealthCheck}
          />
        );
      }
    );

    return pingPreviews.concat(snmpPreviews).concat(djangoHealthCheckPreviews);
  };
}

const mapStateToProps = state => ({
  pings: state.dashboard.pings,
  snmps: state.dashboard.snmps,
  djangoHealthChecks: state.dashboard.djangoHealthChecks
});

export default connect(mapStateToProps, { getServiceWithConfigurations })(
  DashboardContent
);
