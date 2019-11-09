import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container, Row, Col, Table } from "react-bootstrap";
import { getSnmpResults } from "../../../actions/snmp";
import {
  convertFromUTCtoDateWithSecondsDifference,
  getCurrentDateUTC,
  getDateFromTodayUTC,
  getDateUtc
} from "../../../commons/utils";
import {
  RadialChart,
  Hint,
  DiscreteColorLegend,
  XYPlot,
  LineSeries,
  HorizontalGridLines,
  XAxis,
  YAxis,
  VerticalRectSeries
} from "react-vis";
import "../../../../../node_modules/react-vis/dist/style.css"; // import react-vis stylesheet
import styles from "./SnmpOverview.less";
import CalendarRangePicker from "../../common/CalendarRangePicker/CalendarRangePicker";
import moment from "moment";
import { isArray } from "util";

class SnmpOverview extends React.Component {
  //todo hinting in line series ???
  static propTypes = {
    snmpModel: PropTypes.object.isRequired,
    results: PropTypes.array
  };

  state = {
    fromDate: moment()
      .subtract(7, "days")
      .toDate(),
    toDate: new Date(),
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
    const { cpuHintValue, diskHintValue } = this.state;

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
        <Row className={styles.snmpOverview__row}>
          <h4 className={styles.snmpOverview__chartTitle}>
            {"System information from last sample"}
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
              {"Disks usage from last sample"}
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
          <XYPlot
            width={780}
            height={300}
            xType="time"
            xDomain={[this.state.fromDate, this.state.toDate]}
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
          </XYPlot>
          <DiscreteColorLegend
            height={200}
            width={300}
            items={this.cpuLoadChartLegendData()}
          />
        </Row>
        <Row className={styles.snmpOverview__row}>
          <h4 className={styles.snmpOverview__chartTitle}>{"Memory usage"}</h4>
        </Row>
        <Row className={styles.snmpOverview__row}>
          <XYPlot
            width={780}
            height={300}
            xType="time"
            xDomain={[this.state.fromDate, this.state.toDate]}
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
          </XYPlot>
          <DiscreteColorLegend
            height={300}
            width={300}
            items={this.memoryChartLegendData()}
          />
        </Row>
        <Row className={styles.snmpOverview__row}>
          <h4 className={styles.snmpOverview__chartTitle}>{"Interfaces"}</h4>
        </Row>
        <Row className={styles.snmpOverview__row}>
          <XYPlot
            width={770}
            height={400}
            xType="time"
            xDomain={[this.state.fromDate, this.state.toDate]}
          >
            <HorizontalGridLines />
            <XAxis tickLabelAngle={-35} />
            <YAxis title={"octets / 1000000"} />
            {/* {interfacesResultIndexes.map((resultIndex, index) => {
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
            })} */}
            <VerticalRectSeries
              color={"#00909e"}
              data={this.translateResultsForInterfaces(
                this.props.results,
                true,
                22
              )}
            />
            <VerticalRectSeries
              color={"#f88020"}
              data={this.translateResultsForInterfacesErrorTest(
                this.props.results,
                true,
                23
              )}
            />
            <VerticalRectSeries
              color={"#472b62"}
              data={this.translateResultsForInterfaces(
                this.props.results,
                false,
                24
              )}
            />
            <VerticalRectSeries
              color={"#c70d3a"}
              data={this.translateResultsForInterfacesErrorTest(
                this.props.results,
                false,
                25
              )}
            />
          </XYPlot>
          <DiscreteColorLegend
            height={300}
            width={300}
            items={this.interfacesChartLegendData()}
          />
        </Row>
      </Container>
    );
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

  translateResultsForCPU = results => {
    let userCPU = { usageInPercent: 0, color: "#FF9833" };
    let systemCPU = { usageInPercent: 0, color: "#79C7E3" };
    let idleCPU = { usageInPercent: 0, color: "#1A3177" };

    if (results) {
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
    }
    return [userCPU, systemCPU, idleCPU];
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
    } else return [];
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
          return {
            x: convertFromUTCtoDateWithSecondsDifference(result.created_at),
            y: result.results[index]
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
      { title: "Used RAM", color: "#c70d3a" },
      { title: "Free RAM", color: "#1aaf54" },
      { title: "Shared RAM", color: "#fed766" },
      { title: "Buffered RAM", color: "#f88020" },
      { title: "Cached Memory", color: "#472b62" }
    ];
  };

  translateResultsForInterfaces = (results, isInput, resultIndex) => {
    if (results) {
      return results.map(result => {
        return {
          x0: convertFromUTCtoDateWithSecondsDifference(
            result.created_at,
            -1800
          ),
          x: convertFromUTCtoDateWithSecondsDifference(result.created_at, 1800),
          y: isInput
            ? result.results[resultIndex] / 1000000
            : -result.results[resultIndex] / 1000000
        };
      });
    } else return [];
  };

  translateResultsForInterfacesErrorTest = (results, isInput, resultIndex) => {
    if (results) {
      return results.map(result => {
        return {
          x0: convertFromUTCtoDateWithSecondsDifference(
            result.created_at,
            -1800
          ),
          x: convertFromUTCtoDateWithSecondsDifference(result.created_at, 1800),
          y: isInput ? 1000 : -1500
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
}

const mapStateToProps = state => ({
  results: state.snmp.results
});

export default connect(
  mapStateToProps,
  { getSnmpResults }
)(SnmpOverview);
