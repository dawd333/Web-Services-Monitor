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
  convertFromUTCtoDateWithSecondsDifference,
  getCurrentDateUTC,
  getDateFromTodayUTC,
  getDateUtc,
  convertFromUTC
} from "../../../commons/dateUtils";
import {
  RadialChart,
  Hint,
  DiscreteColorLegend,
  XYPlot,
  LineSeries,
  HorizontalGridLines,
  XAxis,
  YAxis,
  VerticalRectSeries,
  Highlight
} from "react-vis";
import "../../../../../node_modules/react-vis/dist/style.css"; // import react-vis stylesheet
import styles from "./SnmpOverview.less";
import CalendarRangePicker from "../../common/calendar-range-picker/CalendarRangePicker";
import moment from "moment";
import { isArray } from "util";
import { view } from "../DashboardModel";
import {
  changeView,
  getSnmpResults,
  deleteSnmp
} from "../../../actions/dashboard";
import { DeleteModal } from "../../common/delete-modal/DeleteModal";

class SnmpOverview extends React.Component {
  static propTypes = {
    snmpModel: PropTypes.object.isRequired,
    results: PropTypes.array
  };

  state = {
    cpuLoadLastDrawLocation: null,
    memoryLastDrawLocation: null,
    interfacesLastDrawLocation: null,
    fromDate: moment()
      .subtract(7, "days")
      .toDate(),
    toDate: new Date(),
    showDeleteModal: false,
    cpuHintValue: false,
    diskHintValue: false
  };

  componentDidMount() {
    this.props.getSnmpResults(
      this.props.snmpModel.id,
      getDateFromTodayUTC(-7),
      getCurrentDateUTC()
    );
  }

  render() {
    const {
      cpuHintValue,
      diskHintValue,
      cpuLoadLastDrawLocation,
      memoryLastDrawLocation,
      interfacesLastDrawLocation
    } = this.state;

    const lastResult = this.getLastResult(this.props.results);

    const cpuLoadColors = ["#fe4a49", "#1aaf54", "#fed766"];
    const memoryColors = [
      "#00909e",
      "#c70d3a",
      "#1aaf54",
      "#fed766",
      "#f88020",
      "#472b62"
    ];
    const interfacesColors = ["#00909e", "#f88020", "#472b62", "#c70d3a"];

    const cpuLoadResultIndexes = [4, 5, 6];
    const memoryResultIndexes = [11, 13, 14, 15, 16, 17];
    const interfacesResultIndexes = [22, 23, 24, 25];
    const interfacesIsInput = [true, true, false, false];

    const errors = this.getErrors(this.props.results);

    let xDomainCPULoad;
    let xDomainMemory;
    let xDomainInterfaces;

    if (cpuLoadLastDrawLocation) {
      xDomainCPULoad = [
        cpuLoadLastDrawLocation.left,
        cpuLoadLastDrawLocation.right
      ];
    } else {
      xDomainCPULoad = [this.state.fromDate, this.state.toDate];
    }

    if (memoryLastDrawLocation) {
      xDomainMemory = [
        memoryLastDrawLocation.left,
        memoryLastDrawLocation.right
      ];
    } else {
      xDomainMemory = [this.state.fromDate, this.state.toDate];
    }

    if (interfacesLastDrawLocation) {
      xDomainInterfaces = [
        interfacesLastDrawLocation.left,
        interfacesLastDrawLocation.right
      ];
    } else {
      xDomainInterfaces = [this.state.fromDate, this.state.toDate];
    }

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
                    ? this.convertkBtoGB(lastResult.results[10]) + " GB"
                    : ""}
                </td>
              </tr>
              <tr>
                <td>Total RAM</td>
                <td>
                  {lastResult
                    ? this.convertkBtoGB(lastResult.results[12]) + " GB"
                    : ""}
                </td>
              </tr>
              <tr>
                <td>Total disks size</td>
                <td>
                  {lastResult
                    ? this.convertkBtoGB(lastResult.results[18]) + " GB"
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
          <Col xs={4}>
            <RadialChart
              className={styles.snmpOverview__radialChart}
              innerRadius={100}
              radius={140}
              colorType="literal"
              getAngle={d => d.usageInPercent}
              data={this.translateResultsForCPU(this.props.results)}
              onValueMouseOver={value => this.setState({ cpuHintValue: value })}
              onSeriesMouseOut={() => this.setState({ cpuHintValue: false })}
              width={300}
              height={300}
              padAngle={0.04}
            >
              {cpuHintValue !== false && <Hint value={cpuHintValue} />}
            </RadialChart>
          </Col>
          <Col xs={2}>
            <DiscreteColorLegend
              height={200}
              width={300}
              items={this.cpuChartLegendData()}
            />
          </Col>
          <Col xs={4}>
            <RadialChart
              className={styles.snmpOverview__radialChart}
              innerRadius={100}
              radius={140}
              colorType="literal"
              getAngle={d => d.usage}
              data={this.translateResultForDisks(lastResult)}
              onValueMouseOver={value =>
                this.setState({ diskHintValue: value })
              }
              onSeriesMouseOut={() => this.setState({ diskHintValue: false })}
              width={300}
              height={300}
              padAngle={0.04}
            >
              {diskHintValue !== false && <Hint value={diskHintValue} />}
            </RadialChart>
          </Col>
          <Col xs={2}>
            <DiscreteColorLegend
              height={200}
              width={300}
              items={this.diskChartLegendData()}
            />
          </Col>
        </Row>
        <Row className={styles.snmpOverview__row}>
          <h4 className={styles.snmpOverview__chartTitle}>{"CPU load"}</h4>
        </Row>
        <Row className={styles.snmpOverview__row}>
          <Col xs={10}>
            <XYPlot
              animation
              width={880}
              height={350}
              xType="time"
              xDomain={xDomainCPULoad}
              yDomain={
                cpuLoadLastDrawLocation && [
                  cpuLoadLastDrawLocation.bottom,
                  cpuLoadLastDrawLocation.top
                ]
              }
            >
              <HorizontalGridLines />
              <XAxis tickLabelAngle={-35} />
              <YAxis />
              {cpuLoadResultIndexes.map((resultIndex, index) => {
                return (
                  <LineSeries
                    key={index}
                    color={cpuLoadColors[index]}
                    curve={"curveMonotoneX"}
                    data={this.translateResultsForLineSeries(
                      this.props.results,
                      resultIndex
                    )}
                  />
                );
              })}
              <LineSeries data={[{ x: new Date(), y: 0 }]} />
              <Highlight
                drag={false}
                onBrushEnd={area =>
                  this.setState({ cpuLoadLastDrawLocation: area })
                }
              />
            </XYPlot>
          </Col>
          <Col xs={2}>
            <DiscreteColorLegend
              height={200}
              width={300}
              items={this.cpuLoadChartLegendData()}
            />
          </Col>
        </Row>
        <Row className={styles.snmpOverview__row}>
          <h4 className={styles.snmpOverview__chartTitle}>{"Memory usage"}</h4>
        </Row>
        <Row className={styles.snmpOverview__row}>
          <Col xs={10}>
            <XYPlot
              animation
              width={880}
              height={350}
              xType="time"
              xDomain={xDomainMemory}
              yDomain={
                memoryLastDrawLocation && [
                  memoryLastDrawLocation.bottom,
                  memoryLastDrawLocation.top
                ]
              }
            >
              <HorizontalGridLines />
              <XAxis tickLabelAngle={-35} />
              <YAxis title={"GB"} />
              {memoryResultIndexes.map((resultIndex, index) => {
                return (
                  <LineSeries
                    key={index}
                    color={memoryColors[index]}
                    curve={"curveMonotoneX"}
                    data={this.convertkBtoGB(
                      this.translateResultsForLineSeries(
                        this.props.results,
                        resultIndex
                      )
                    )}
                  />
                );
              })}
              <LineSeries data={[{ x: new Date(), y: 0 }]} />
              <Highlight
                drag={false}
                onBrushEnd={area =>
                  this.setState({ memoryLastDrawLocation: area })
                }
              />
            </XYPlot>
          </Col>
          <Col xs={2}>
            <DiscreteColorLegend
              height={300}
              width={300}
              items={this.memoryChartLegendData()}
            />
          </Col>
        </Row>
        <Row className={styles.snmpOverview__row}>
          <h4 className={styles.snmpOverview__chartTitle}>{"Interfaces"}</h4>
        </Row>
        <Row className={styles.snmpOverview__row}>
          <Col xs={10}>
            <XYPlot
              animation
              width={880}
              height={400}
              xType="time"
              xDomain={xDomainInterfaces}
              yDomain={
                interfacesLastDrawLocation && [
                  interfacesLastDrawLocation.bottom,
                  interfacesLastDrawLocation.top
                ]
              }
            >
              <HorizontalGridLines />
              <XAxis tickLabelAngle={-35} />
              <YAxis title={"octets / 1000000"} />
              {interfacesResultIndexes.map((resultIndex, index) => {
                return (
                  <VerticalRectSeries
                    key={index}
                    color={interfacesColors[index]}
                    data={this.translateResultsForInterfaces(
                      this.props.results,
                      interfacesIsInput[index],
                      resultIndex
                    )}
                  />
                );
              })}
              <VerticalRectSeries data={[{ x: new Date(), y: 0 }]} />
              <Highlight
                drag={false}
                onBrushEnd={area =>
                  this.setState({ interfacesLastDrawLocation: area })
                }
              />
            </XYPlot>
          </Col>
          <Col xs={2}>
            <DiscreteColorLegend
              height={300}
              width={300}
              items={this.interfacesChartLegendData()}
            />
          </Col>
        </Row>
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

  translateResultsForCPU = results => {
    let userCPU = { usageInPercent: 0, color: "#FF9833" };
    let systemCPU = { usageInPercent: 0, color: "#79C7E3" };
    let idleCPU = { usageInPercent: 0, color: "#1A3177" };

    if (results) {
      if (results.length === 0)
        return [{ usageInPercent: 1, stroke: "#", color: "#ffffff" }];
      let errors = 0;
      results.forEach(result => {
        if (result.error_messages.length === 0) {
          userCPU.usageInPercent += parseInt(result.results[7]);
          systemCPU.usageInPercent += parseInt(result.results[8]);
          idleCPU.usageInPercent += parseInt(result.results[9]);
        } else {
          errors += 1;
        }
      });
      const resultsLength = results.length - errors;
      userCPU.usageInPercent /= resultsLength;
      systemCPU.usageInPercent /= resultsLength;
      idleCPU.usageInPercent /= resultsLength;
      return [userCPU, systemCPU, idleCPU];
    } else {
      return [{ usageInPercent: 1, stroke: "#", color: "#ffffff" }];
    }
  };

  cpuChartLegendData = () => {
    return [
      { title: "User CPU%", color: "#FF9833" },
      { title: "System CPU%", color: "#79C7E3" },
      { title: "Idle CPU%", color: "#1A3177" }
    ];
  };

  translateResultForDisks = result => {
    if (result) {
      const availableDiskSpace = {
        usage: this.convertkBtoGB(result.results[19]),
        color: "#42b883"
      };
      const usedDiskSpace = {
        usage: this.convertkBtoGB(result.results[20]),
        color: "#ff7e67"
      };

      return [availableDiskSpace, usedDiskSpace];
    } else return [{ usage: 1, stroke: "#", color: "#ffffff" }];
  };

  diskChartLegendData = () => {
    return [
      { title: "Available Disk space", color: "#42b883" },
      { title: "Used Disk space", color: "#ff7e67" }
    ];
  };

  translateResultsForLineSeries = (results, index) => {
    return results
      ? results.map(result => {
          if (result.error_messages.length === 0) {
            return {
              x: convertFromUTCtoDateWithSecondsDifference(result.created_at),
              y: result.results[index]
            };
          } else
            return {
              x: convertFromUTCtoDateWithSecondsDifference(result.created_at),
              y: 0
            };
        })
      : [];
  };

  cpuLoadChartLegendData = () => {
    return [
      { title: "1 min CPU load", color: "#fe4a49" },
      { title: "5 min CPU load", color: "#1aaf54" },
      { title: "15 min CPU load", color: "#fed766" }
    ];
  };

  memoryChartLegendData = () => {
    return [
      { title: "Available Swap space", color: "#00909e" },
      { title: "Available RAM", color: "#c70d3a" },
      { title: "Total free RAM", color: "#1aaf54" },
      { title: "Shared RAM", color: "#fed766" },
      { title: "Buffered RAM", color: "#f88020" },
      { title: "Cached Memory", color: "#472b62" }
    ];
  };

  translateResultsForInterfaces = (results, isInput, resultIndex) => {
    if (results) {
      return results.map(result => {
        if (result.error_messages.length === 0) {
          return {
            x0: convertFromUTCtoDateWithSecondsDifference(
              result.created_at,
              -this.props.snmpModel.interval * 0.4
            ),
            x: convertFromUTCtoDateWithSecondsDifference(
              result.created_at,
              this.props.snmpModel.interval * 0.4
            ),
            y: isInput
              ? result.results[resultIndex] / 1000000
              : -result.results[resultIndex] / 1000000
          };
        } else
          return {
            x: convertFromUTCtoDateWithSecondsDifference(result.created_at),
            y: 0
          };
      });
    } else return [];
  };

  interfacesChartLegendData = () => {
    return [
      { title: "Interfaces input total", color: "#00909e" },
      { title: "Interfaces input errors", color: "#f88020" },
      { title: "Interfaces output total", color: "#472b62" },
      { title: "Interfaces output errors", color: "#c70d3a" }
    ];
  };

  convertkBtoGB = data => {
    if (data) {
      if (isArray(data)) {
        return data.map(elem => {
          return {
            x: elem.x,
            y: Number((elem.y / 1000 / 1000).toFixed(4))
          };
        });
      } else {
        return Number((data / 1000 / 1000).toFixed(4));
      }
    } else return [];
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
