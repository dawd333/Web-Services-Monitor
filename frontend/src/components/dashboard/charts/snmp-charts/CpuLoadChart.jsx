import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
  DiscreteColorLegend,
  XYPlot,
  LineSeries,
  HorizontalGridLines,
  XAxis,
  YAxis,
  Highlight
} from "react-vis";
import "../../../../../../node_modules/react-vis/dist/style.css"; // import react-vis stylesheet
import { convertFromUTCtoDateWithSecondsDifference } from "../../../../commons/dateUtils";
import styles from "./SnmpCharts.less";
import { Row, Col } from "react-bootstrap";

export class CpuLoadChart extends Component {
  static propTypes = {
    fromDate: PropTypes.objectOf(Date).isRequired,
    toDate: PropTypes.objectOf(Date).isRequired,
    results: PropTypes.array
  };

  state = {
    cpuLoadLastDrawLocation: null
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.fromDate !== this.props.fromDate ||
      prevProps.toDate !== this.props.toDate
    ) {
      this.setState({
        ...this.state,
        cpuLoadLastDrawLocation: null
      });
    }
  }

  render() {
    const { cpuLoadLastDrawLocation } = this.state;

    const cpuLoadColors = ["#fe4a49", "#1aaf54", "#fed766"];
    const cpuLoadResultIndexes = [4, 5, 6];

    let xDomainCPULoad;
    if (cpuLoadLastDrawLocation) {
      xDomainCPULoad = [
        cpuLoadLastDrawLocation.left,
        cpuLoadLastDrawLocation.right
      ];
    } else {
      xDomainCPULoad = [this.props.fromDate, this.props.toDate];
    }

    return (
      <Fragment>
        <Row className={styles.snmpCharts__row}>
          <h4 className={styles.snmpCharts__chartTitle}>{"CPU load"}</h4>
        </Row>
        <Row className={styles.snmpCharts__row}>
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
                    data={this.translateResultsForCpuLoad(
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
      </Fragment>
    );
  }

  translateResultsForCpuLoad = (results, index) => {
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
}
