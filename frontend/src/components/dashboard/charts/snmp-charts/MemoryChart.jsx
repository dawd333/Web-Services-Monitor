import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
  DiscreteColorLegend,
  XYPlot,
  LineSeries,
  HorizontalGridLines,
  XAxis,
  YAxis,
  Highlight,
  Borders
} from "react-vis";
import "../../../../../../node_modules/react-vis/dist/style.css"; // import react-vis stylesheet
import { convertFromUTCtoDateWithSecondsDifference } from "../../../../commons/dateUtils";
import styles from "./SnmpCharts.less";
import { Row, Col } from "react-bootstrap";
import { convertkBtoGB } from "../../../../commons/utils";

export class MemoryChart extends Component {
  static propTypes = {
    fromDate: PropTypes.objectOf(Date).isRequired,
    toDate: PropTypes.objectOf(Date).isRequired,
    results: PropTypes.array,
    brushing: PropTypes.bool
  };

  state = {
    memoryLastDrawLocation: null
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.fromDate !== this.props.fromDate ||
      prevProps.toDate !== this.props.toDate
    ) {
      this.setState({
        ...this.state,
        memoryLastDrawLocation: null
      });
    }
  }

  render() {
    const { memoryLastDrawLocation } = this.state;

    const memoryColors = [
      "#00909e",
      "#c70d3a",
      "#1aaf54",
      "#fed766",
      "#f88020",
      "#472b62"
    ];
    const memoryResultIndexes = [11, 13, 14, 15, 16, 17];

    return (
      <Fragment>
        <Row className={styles.snmpCharts__row}>
          <h4 className={styles.snmpCharts__chartTitle}>{"Memory usage"}</h4>
        </Row>
        <Row className={styles.snmpCharts__row}>
          <Col xs={10}>
            <XYPlot
              animation
              width={880}
              height={350}
              xType="time"
              xDomain={
                this.props.brushing && memoryLastDrawLocation
                  ? [memoryLastDrawLocation.left, memoryLastDrawLocation.right]
                  : [this.props.fromDate, this.props.toDate]
              }
              yDomain={
                this.props.brushing &&
                memoryLastDrawLocation && [
                  memoryLastDrawLocation.bottom,
                  memoryLastDrawLocation.top
                ]
              }
            >
              <HorizontalGridLines />
              {memoryResultIndexes.map((resultIndex, index) => {
                return (
                  <LineSeries
                    key={index}
                    color={memoryColors[index]}
                    curve={"curveMonotoneX"}
                    data={convertkBtoGB(
                      this.translateResultsForMemory(
                        this.props.results,
                        resultIndex
                      )
                    )}
                  />
                );
              })}
              <LineSeries data={[{ x: new Date(), y: 0 }]} />
              <Borders className={styles.border} />
              {this.props.brushing && (
                <Highlight
                  drag={false}
                  onBrushEnd={area =>
                    this.setState({ memoryLastDrawLocation: area })
                  }
                />
              )}
              <XAxis tickLabelAngle={-35} />
              <YAxis title={"GB"} />
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
      </Fragment>
    );
  }

  translateResultsForMemory = (results, index) => {
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
}
