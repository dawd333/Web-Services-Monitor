import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Container,
  Row,
  Col,
  Table,
  Accordion,
  Card,
  Button,
  ButtonToolbar
} from "react-bootstrap";
import {
  getCurrentDateUTC,
  getDateFromTodayUTC,
  getDateUtc,
  convertFromUTC
} from "../../../commons/dateUtils";
import "../../../../../node_modules/react-vis/dist/style.css"; // import react-vis stylesheet
import styles from "./SnmpOverview.less";
import CalendarRangePicker from "../../common/calendar-range-picker/CalendarRangePicker";
import moment from "moment";
import { convertkBtoGB } from "../../../commons/utils";
import { view } from "../DashboardModel";
import {
  changeView,
  getSnmpResults,
  deleteSnmp
} from "../../../actions/dashboard";
import { DeleteModal } from "../../common/delete-modal/DeleteModal";
import { CpuChart } from "../charts/snmp-charts/CpuChart";
import { DiskChart } from "../charts/snmp-charts/DiskChart";
import { CpuLoadChart } from "../charts/snmp-charts/CpuLoadChart";
import { MemoryChart } from "../charts/snmp-charts/MemoryChart";
import { InterfacesChart } from "../charts/snmp-charts/InterfacesChart";

class SnmpOverview extends React.Component {
  static propTypes = {
    snmpModel: PropTypes.object.isRequired,
    results: PropTypes.array
  };

  state = {
    fromDate: moment()
      .subtract(7, "days")
      .toDate(),
    toDate: new Date(),
    showDeleteModal: false
  };

  componentDidMount() {
    this.props.getSnmpResults(
      this.props.snmpModel.id,
      getDateFromTodayUTC(-7),
      getCurrentDateUTC()
    );
  }

  render() {
    const errors = this.getErrors(this.props.results);
    const lastResult = this.getLastResult(this.props.results);

    return (
      <Container className={styles.snmpOverview}>
        <span className={styles.snmpOverview__header}>
          {"Snmp results dashboard for "}
        </span>
        <CalendarRangePicker
          fromDate={this.state.fromDate}
          toDate={this.state.toDate}
          onChange={this.onChangeCalendar}
        />
        {errors.length > 0 && (
          <Accordion className={styles.snmpOverview__row}>
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="danger" eventKey="0">
                  {"Error messages"}
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <Table bordered>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Error Messages</th>
                      </tr>
                    </thead>
                    <tbody>
                      {errors.map((error, index) => {
                        return (
                          <tr key={index}>
                            <td>{error.date}</td>
                            <td>{error.errorMessages}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        )}
        <Row className={styles.snmpOverview__row}>
          <h4 className={styles.snmpOverview__chartTitle}>
            {"System information from last successful sample"}
          </h4>
        </Row>
        <Row className={styles.snmpOverview__row}>
          <Table bordered>
            <tbody>
              <tr>
                <td>System Description</td>
                <td>{lastResult ? lastResult.results[0] : ""}</td>
              </tr>
              <tr>
                <td>System Uptime</td>
                <td>{lastResult ? lastResult.results[1] : ""}</td>
              </tr>
              <tr>
                <td>Users in System</td>
                <td>{lastResult ? lastResult.results[2] : ""}</td>
              </tr>
              <tr>
                <td>Processes running</td>
                <td>{lastResult ? lastResult.results[3] : ""}</td>
              </tr>
              <tr>
                <td>Total swap size</td>
                <td>
                  {lastResult
                    ? convertkBtoGB(lastResult.results[10]) + " GB"
                    : ""}
                </td>
              </tr>
              <tr>
                <td>Total RAM</td>
                <td>
                  {lastResult
                    ? convertkBtoGB(lastResult.results[12]) + " GB"
                    : ""}
                </td>
              </tr>
              <tr>
                <td>Total disks size</td>
                <td>
                  {lastResult
                    ? convertkBtoGB(lastResult.results[18]) + " GB"
                    : ""}
                </td>
              </tr>
            </tbody>
          </Table>
        </Row>
        <Row className={styles.snmpOverview__row}>
          <Col>
            <h4 className={styles.snmpOverview__chartTitle}>
              {"Average CPU usage"}
            </h4>
          </Col>
          <Col>
            <h4 className={styles.snmpOverview__chartTitle}>
              {"Disks usage from last successful sample"}
            </h4>
          </Col>
        </Row>
        <Row className={styles.snmpOverview__row}>
          <CpuChart results={this.props.results} />
          <DiskChart lastResult={lastResult} />
        </Row>
        <CpuLoadChart
          fromDate={this.state.fromDate}
          toDate={this.state.toDate}
          results={this.props.results}
          brushing={true}
        />
        <MemoryChart
          fromDate={this.state.fromDate}
          toDate={this.state.toDate}
          results={this.props.results}
          brushing={true}
        />
        <InterfacesChart
          fromDate={this.state.fromDate}
          toDate={this.state.toDate}
          results={this.props.results}
          interval={this.props.snmpModel.interval}
          brushing={true}
        />
        <ButtonToolbar className={styles.snmpOverview__nav}>
          <Button variant={"primary"} onClick={this.onConfigurationClick}>
            {"Configuration"}
          </Button>
          <Button variant={"danger"} onClick={this.onDeleteClick}>
            {"Delete"}
          </Button>
        </ButtonToolbar>
        <DeleteModal
          label={"Delete this snmp configuration"}
          show={this.state.showDeleteModal}
          onClose={() =>
            this.setState({ ...this.state, showDeleteModal: false })
          }
          onDelete={this.deleteSnmpConfiguration}
        />
      </Container>
    );
  }

  getErrors = results => {
    const errors = results
      ? results.map(result => {
          if (result.error_messages.length !== 0) {
            return {
              date: convertFromUTC(result.created_at),
              errorMessages: result.error_messages
            };
          } else return null;
        })
      : [];
    return errors.filter(error => error);
  };

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

  onChangeCalendar = (fromDate, toDate) => {
    this.setState({
      ...this.state,
      fromDate,
      toDate
    });
    this.props.getSnmpResults(
      this.props.snmpModel.id,
      getDateUtc(fromDate),
      getDateUtc(toDate)
    );
  };

  onConfigurationClick = () => {
    this.props.changeView(view.EDIT_SNMP);
  };

  onDeleteClick = () => {
    this.setState({
      ...this.state,
      showDeleteModal: true
    });
  };

  deleteSnmpConfiguration = async () => {
    await this.props.deleteSnmp(
      this.props.snmpModel.service,
      this.props.snmpModel.id
    );
    this.props.changeView(view.OVERVIEW);
  };
}

const mapStateToProps = state => ({
  results: state.dashboard.snmpResults
});

export default connect(mapStateToProps, {
  changeView,
  getSnmpResults,
  deleteSnmp
})(SnmpOverview);
