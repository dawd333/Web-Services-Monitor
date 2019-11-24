import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
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
import styles from "./DjangoHealthCheckChart.less";

export class DjangoHealthCheckChart extends Component {
  static propTypes = {
    fromDate: PropTypes.objectOf(Date).isRequired,
    toDate: PropTypes.objectOf(Date).isRequired,
    results: PropTypes.array,
    interval: PropTypes.number.isRequired,
    brushing: PropTypes.bool
  };

  state = {
    lastDrawLocation: null
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.fromDate !== this.props.fromDate ||
      prevProps.toDate !== this.props.toDate
    ) {
      this.setState({
        ...this.state,
        lastDrawLocation: null
      });
    }
  }

  render() {
    const { lastDrawLocation } = this.state;

    const chartColors = ["#1aaf54", "#c70d3a"];
    const isSuccess = [true, false];

    return (
      <Fragment>
        <XYPlot
          animation
          width={850}
          height={350}
          xType="time"
          xDomain={
            this.props.brushing && lastDrawLocation
              ? [lastDrawLocation.left, lastDrawLocation.right]
              : [this.props.fromDate, this.props.toDate]
          }
          yDomain={
            this.props.brushing &&
            this.state.lastDrawLocation && [
              this.state.lastDrawLocation.bottom,
              this.state.lastDrawLocation.top
            ]
          }
        >
          <HorizontalGridLines />
          {isSuccess.map((isSuccess, index) => {
            return (
              <VerticalRectSeries
                key={index}
                color={chartColors[index]}
                data={this.translateResultsForDjangoHealthCheck(
                  this.props.results,
                  isSuccess
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
              onBrushEnd={area => this.setState({ lastDrawLocation: area })}
            />
          )}
          <XAxis tickLabelAngle={-35} />
          <YAxis />
        </XYPlot>
      </Fragment>
    );
  }

  translateResultsForDjangoHealthCheck = (results, isSuccess) => {
    return results
      ? results
          .filter(result => result.was_success === isSuccess)
          .map(result => {
            return {
              x0: convertFromUTCtoDateWithSecondsDifference(
                result.created_at,
                -this.props.interval * 0.4
              ),
              x: convertFromUTCtoDateWithSecondsDifference(
                result.created_at,
                this.props.interval * 0.4
              ),
              y: isSuccess ? 1 : -1
            };
          })
      : [];
  };
}
