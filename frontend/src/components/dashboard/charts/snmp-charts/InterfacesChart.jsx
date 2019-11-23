import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
  DiscreteColorLegend,
  XYPlot,
  HorizontalGridLines,
  XAxis,
  YAxis,
  VerticalRectSeries,
  Highlight,
  Borders
} from "react-vis";
import "../../../../../../node_modules/react-vis/dist/style.css"; // import react-vis stylesheet
import { convertFromUTCtoDateWithSecondsDifference } from "../../../../commons/dateUtils";
import styles from "./SnmpCharts.less";
import { Row, Col } from "react-bootstrap";

export class InterfacesChart extends Component {
  static propTypes = {
    fromDate: PropTypes.objectOf(Date).isRequired,
    toDate: PropTypes.objectOf(Date).isRequired,
    results: PropTypes.array,
    interval: PropTypes.number.isRequired,
    brushing: PropTypes.bool
  };

  state = {
    interfacesLastDrawLocation: null
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.fromDate !== this.props.fromDate ||
      prevProps.toDate !== this.props.toDate
    ) {
      this.setState({
        ...this.state,
        interfacesLastDrawLocation: null
      });
    }
  }

  render() {
    const { interfacesLastDrawLocation } = this.state;

    const interfacesColors = ["#00909e", "#f88020", "#472b62", "#c70d3a"];
    const interfacesResultIndexes = [22, 23, 24, 25];
    const interfacesIsInput = [true, true, false, false];

    return (
      <Fragment>
        <Row className={styles.snmpCharts__row}>
          <h4 className={styles.snmpCharts__chartTitle}>{"Interfaces"}</h4>
        </Row>
        <Row className={styles.snmpCharts__row}>
          <Col xs={10}>
            <XYPlot
              animation
              width={880}
              height={400}
              xType="time"
              xDomain={
                this.props.brushing && interfacesLastDrawLocation
                  ? [
                      interfacesLastDrawLocation.left,
                      interfacesLastDrawLocation.right
                    ]
                  : [this.props.fromDate, this.props.toDate]
              }
              yDomain={
                this.props.brushing &&
                interfacesLastDrawLocation && [
                  interfacesLastDrawLocation.bottom,
                  interfacesLastDrawLocation.top
                ]
              }
            >
              <HorizontalGridLines />
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
              <VerticalRectSeries
                data={[{ x0: new Date(), x: new Date(), y: 0 }]}
              />
              <Borders className={styles.border} />
              {this.props.brushing && (
                <Highlight
                  drag={false}
                  onBrushEnd={area =>
                    this.setState({ interfacesLastDrawLocation: area })
                  }
                />
              )}
              <XAxis tickLabelAngle={-35} />
              <YAxis title={"octets / 1000000"} />
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
      </Fragment>
    );
  }

  translateResultsForInterfaces = (results, isInput, resultIndex) => {
    return results
      ? results
          .map(result => {
            if (result.error_messages.length === 0) {
              return {
                x0: convertFromUTCtoDateWithSecondsDifference(
                  result.created_at,
                  -this.props.interval * 0.4
                ),
                x: convertFromUTCtoDateWithSecondsDifference(
                  result.created_at,
                  this.props.interval * 0.4
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
          })
          .filter(result => result.y !== 0)
      : [];
  };

  interfacesChartLegendData = () => {
    return [
      { title: "Interfaces input total", color: "#00909e" },
      { title: "Interfaces input errors", color: "#f88020" },
      { title: "Interfaces output total", color: "#472b62" },
      { title: "Interfaces output errors", color: "#c70d3a" }
    ];
  };
}
