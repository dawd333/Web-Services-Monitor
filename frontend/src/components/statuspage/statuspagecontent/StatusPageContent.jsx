import React, {Component} from "react";
import {connect} from "react-redux";
import styles from "./StatusPageContent.less";
import Container from "react-bootstrap/Container";
import {PingChart} from "../../dashboard/charts/ping-charts/PingChart";
import moment from "moment";
import {ErrorPercentageChart} from "../../dashboard/charts/error-percentage-chart/ErrorPercentageChart";
import {DjangoHealthCheckChart} from "../../dashboard/charts/django-health-check-charts/DjangoHealthCheckChart";
import {Row} from "react-bootstrap";
import {CpuChart} from "../../dashboard/charts/snmp-charts/CpuChart";
import {DiskChart} from "../../dashboard/charts/snmp-charts/DiskChart";
import {CpuLoadChart} from "../../dashboard/charts/snmp-charts/CpuLoadChart";
import {MemoryChart} from "../../dashboard/charts/snmp-charts/MemoryChart";
import {InterfacesChart} from "../../dashboard/charts/snmp-charts/InterfacesChart";

class StatusPageContent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container className={styles.statusPageContent}>
        <h3 className={styles.statusPageContent__header}>
          {this.props.data.name}
        </h3>
        <hr/>
        {this.renderEmpty()}
        {this.renderHealthChecks()}
        {this.renderLineIf(this.props.data?.django_health_check_configurations?.length &&
          (this.props.data?.ping_configurations?.length || this.props.data?.snmp_configurations?.length))}
        {this.renderPings()}
        {this.renderLineIf(this.props.data?.ping_configurations?.length && this.props.data?.snmp_configurations?.length)}
        {this.renderSnmp()}
      </Container>
    );
  }

  renderPings = () => {
    return (
      <>
        {this.props.data.ping_configurations?.length > 0 &&
        <h4 className={styles.statusPageContent__header}>{"Ping status"}</h4>}
        {this.props.data.ping_configurations?.length > 0 &&
        this.props.data.ping_configurations.map(conf => {
          switch (conf.display_type) {
            case "ERROR_PERCENTAGE":
              return this.renderErrorPercentage(conf);
            case "NO_ERRORS_CHART":
              return this.renderPingNoErrorsChart(conf);
            case "FULL_CHART":
              return this.renderPingFullChart(conf);
            default:
              return null;
          }
        })}
      </>
    )
  };

  renderConfHeader = (conf) => {
    return (
      <div className={styles.statusPageContent__label}>
        {conf.error_percentage.hour === 0 && <span className={styles.statusBox__success}/>}
        {conf.error_percentage.hour > 0 && conf.error_percentage.hour < 100 &&
        <span className={styles.statusBox__warning}/>}
        {conf.error_percentage.hour === 100 && <span className={styles.statusBox__danger}/>}
        <span className={styles.statusPageContent__header}>{conf.ip}</span>
      </div>
    )
  };

  renderErrorPercentage = (conf) => {
    return (
      <div key={conf.id}>
        {this.renderConfHeader(conf)}
        <h6 className={styles.statusPageContent__header}>{"Error percentage:"}</h6>
        <ErrorPercentageChart
          error_percentage={conf.error_percentage}
        />
      </div>
    )
  };

  renderPingNoErrorsChart = (ping) => {
    return (
      <div key={ping.id}>
        {this.renderConfHeader(ping)}
        <h6 className={styles.statusPageContent__header}>{"Response time:"}</h6>
        <PingChart
          fromDate={moment().subtract(7, "days").toDate()}
          toDate={new Date()}
          results={ping.ping_results}
          interval={ping.interval}
          brushing={false}
          hint={false}
        />
      </div>
    )
  };

  renderPingFullChart = (ping) => {
    return (
      <div key={ping.id}>
        {this.renderConfHeader(ping)}
        <h6 className={styles.statusPageContent__header}>{"Response time with error details:"}</h6>
        <PingChart
          fromDate={moment().subtract(7, "days").toDate()}
          toDate={new Date()}
          results={ping.ping_results}
          interval={ping.interval}
          brushing={true}
          hint={true}
        />
      </div>
    )
  };

  renderHealthChecks = () => {
    return (
      <>
        {this.props.data.django_health_check_configurations?.length > 0 &&
        <h4 className={styles.statusPageContent__header}>{"Health check status"}</h4>}
        {this.props.data.django_health_check_configurations?.length > 0 &&
        this.props.data.django_health_check_configurations.map(conf => {
          switch (conf.display_type) {
            case "ERROR_PERCENTAGE":
              return this.renderErrorPercentage(conf);
            case "NO_ERRORS_CHART":
              return this.renderHealthCheckNoErrorsChart(conf);
            case "FULL_CHART":
              return this.renderHealthCheckFullChart(conf);
            default:
              return null;
          }
        })}
      </>
    )
  };

  renderHealthCheckNoErrorsChart = (healthCheck) => {
    return (
      <div key={healthCheck.id}>
        {this.renderConfHeader(healthCheck)}
        <h6 className={styles.statusPageContent__header}>{"Health check status:"}</h6>
        <DjangoHealthCheckChart
          fromDate={moment().subtract(7, "days").toDate()}
          toDate={new Date()}
          results={healthCheck.django_health_check_results}
          interval={healthCheck.interval}
          brushing={false}
        />
      </div>
    )
  };

  renderHealthCheckFullChart = (healthCheck) => {
    return (
      <div key={healthCheck.id}>
        {this.renderConfHeader(healthCheck)}
        <h6 className={styles.statusPageContent__header}>{"Health check status:"}</h6>
        <DjangoHealthCheckChart
          fromDate={moment().subtract(7, "days").toDate()}
          toDate={new Date()}
          results={healthCheck.django_health_check_results}
          interval={healthCheck.interval}
          brushing={true}
        />
      </div>
    )
  };

  renderSnmp = () => {
    return (
      <>
        {this.props.data.snmp_configurations?.length > 0 &&
        <h4 className={styles.statusPageContent__header}>{"Snmp status"}</h4>}
        {this.props.data.snmp_configurations?.length > 0 &&
        this.props.data.snmp_configurations.map(conf => {
          switch (conf.display_type) {
            case "ERROR_PERCENTAGE":
              return this.renderErrorPercentage(conf);
            case "NO_ERRORS_CHART":
              return this.renderSnmpNoErrorsChart(conf);
            case "FULL_CHART":
              return this.renderSnmpFullChart(conf);
            default:
              return null;
          }
        })}
      </>
    )
  };

  renderSnmpNoErrorsChart = (snmp) => {
    const lastResult = this.getLastResult(snmp.snmp_results);
    return (
      <div key={snmp.id}>
        {this.renderConfHeader(snmp)}
        <h6 className={styles.statusPageContent__header}>{"Snmp overview:"}</h6>
        <Row className={styles.snmpOverview__row}>
          <CpuChart results={snmp.snmp_results}/>
          <DiskChart lastResult={lastResult}/>
        </Row>
        <CpuLoadChart
          fromDate={moment().subtract(7, "days").toDate()}
          toDate={new Date()}
          results={snmp.snmp_results}
          brushing={false}
        />
        <MemoryChart
          fromDate={moment().subtract(7, "days").toDate()}
          toDate={new Date()}
          results={snmp.snmp_results}
          brushing={false}
        />
        <InterfacesChart
          fromDate={moment().subtract(7, "days").toDate()}
          toDate={new Date()}
          results={snmp.snmp_results}
          interval={snmp.interval}
          brushing={false}
        />
      </div>
    )
  };

  renderSnmpFullChart = (snmp) => {
    const lastResult = this.getLastResult(snmp.snmp_results);
    return (
      <div key={snmp.id}>
        {this.renderConfHeader(snmp)}
        <h6 className={styles.statusPageContent__header}>{"Snmp overview with error details:"}</h6>
        <Row className={styles.snmpOverview__row}>
          <CpuChart results={snmp.snmp_results}/>
          <DiskChart lastResult={lastResult}/>
        </Row>
        <CpuLoadChart
          fromDate={moment().subtract(7, "days").toDate()}
          toDate={new Date()}
          results={snmp.snmp_results}
          brushing={true}
        />
        <MemoryChart
          fromDate={moment().subtract(7, "days").toDate()}
          toDate={new Date()}
          results={snmp.snmp_results}
          brushing={true}
        />
        <InterfacesChart
          fromDate={moment().subtract(7, "days").toDate()}
          toDate={new Date()}
          results={snmp.snmp_results}
          interval={snmp.interval}
          brushing={true}
        />
      </div>
    )
  };


  renderLineIf = (condition) => {
    return condition ? <hr/> : null;
  };

  renderEmpty = () => {
    const pings = this.props.data.ping_configurations;
    const snmps = this.props.data.snmp_configurations;
    const healthchecks = this.props.data.django_health_check_configurations;
    const condition = !pings?.length && !snmps?.length && !healthchecks?.length;

    return condition ? <h3>{"This status page is empty"}</h3> : null;
  }

    getLastResult = results => {
    if (results) {
      const resultsSorted = results.sort((a, b) => {
        if (a.id > b.id) return -1;
        if (a.id < b.id) return 1;
        return 0;
      });
      return resultsSorted.find(result => result.error_messages.length === 0);
    }
  };

}

const mapStateToProps = state => ({
  data: state.statuspage.data
});

export default connect(mapStateToProps)(StatusPageContent);
