import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
  DiscreteColorLegend,
  XYPlot,
  HorizontalGridLines,
  XAxis,
  YAxis,
  VerticalRectSeries,
  Highlight
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
    interval: PropTypes.number.isRequired
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

    let xDomainInterfaces;
    if (interfacesLastDrawLocation) {
      xDomainInterfaces = [
        interfacesLastDrawLocation.left,
        interfacesLastDrawLocation.right
      ];
    } else {
      xDomainInterfaces = [this.props.fromDate, this.props.toDate];
    }

    return (
      <Fragment>
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
      </Fragment>
    );
  }

  translateResultsForInterfaces = (results, isInput, resultIndex) => {
    if (results) {
      return results.map(result => {
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
}
