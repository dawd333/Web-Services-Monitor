import React, {Component} from "react";
import PropTypes from "prop-types";
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalBarSeries,
} from "react-vis";
import "../../../../../../node_modules/react-vis/dist/style.css";
import VerticalGridLines from "react-vis/es/plot/vertical-grid-lines"; // import react-vis stylesheet

export class ErrorPercentageChart extends Component {
  static propTypes = {
    error_percentage: PropTypes.object.isRequired,
  };

  render() {
    return (
      <>
        <XYPlot
          width={800}
          height={180}
          stackBy="x"
          yType="ordinal"
          xDomain={[0, 100]}
        >
          <VerticalGridLines/>
          <XAxis/>
          <YAxis/>
          <HorizontalBarSeries
            barWidth={0.6}
            color={"#af1c21"}
            data={this.translateErrorPercentage(this.props.error_percentage)}
          />
        </XYPlot>
      </>
    );
  }

  translateErrorPercentage = error_percentage => {
    const weekData = {x: error_percentage.week, y: "week"};
    const dayData = {x: error_percentage.day, y: "day"};
    const hourData = {x: error_percentage.hour, y: "hour"};
    return [weekData, dayData, hourData];
  };
}
