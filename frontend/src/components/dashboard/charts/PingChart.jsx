import React from "react";
import PropTypes from "prop-types";
import {
  Borders,
  Hint,
  HorizontalGridLines,
  VerticalRectSeries, VerticalRectSeriesCanvas,
  XAxis,
  XYPlot,
  YAxis,
} from "react-vis";
import '../../../../../node_modules/react-vis/dist/style.css'; // import react-vis stylesheet
import {SimpleTooltip} from "../../common/tooltip/SimpleTooltip";
import {listToStringWithCount} from "../../../commons/utils";
import {convertFromUTCtoDateWithSecondsDifference} from "../../../commons/dateUtils";
import Highlight from "react-vis/es/plot/highlight";
import styles from "./PingChart.less";


export class PingChart extends React.Component {
  static propTypes = {
    fromDate: PropTypes.objectOf(Date).isRequired,
    toDate: PropTypes.objectOf(Date).isRequired,
    results: PropTypes.array,
    interval: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      mouseEventClass: null,
      fromDate: props.fromDate,
      toDate: props.toDate,
      error: null,
      lastDrawLocation: null,
    }
  }

  render() {
    return (
      <div>
        <XYPlot
          width={850}
          height={350}
          stackBy="y"
          xType="time"
          xDomain={
            this.state.lastDrawLocation ?
              [this.state.lastDrawLocation.left, this.state.lastDrawLocation.right] :
              [this.state.fromDate, this.state.toDate]
          }
          yDomain={
            this.state.lastDrawLocation &&
            [this.state.lastDrawLocation.bottom, this.state.lastDrawLocation.top]
          }
        >
          <HorizontalGridLines/>
          <Highlight
            onBrushStart={() => this.setState({mouseEventClass: styles.mouseEventsOff})}
            onBrushEnd={area => {
              if (area) {
                area.bottom = area.bottom > 0 ? area.bottom : 0;
                area.top = area.top > 0 ? area.top : 1;
              }
              this.setState({
                lastDrawLocation: area,
                mouseEventClass: null
              })
            }}
          />
          <VerticalRectSeries className={this.state.mouseEventClass} color={"#1aaf54"} data={this.translateResultsPassed(this.props.results)}/>
          <VerticalRectSeries className={this.state.mouseEventClass} color={"#c70d3a"}
                                    data={this.translateResultsFailed(this.props.results)}
                                    onValueMouseOver={this.valueOnMouseOver} onValueMouseOut={this.valueOnMouseOut}/>
          {/* This is trick to bypass not rendering chart when data is empty */}
          <VerticalRectSeries data={[{x0: new Date(), x: new Date(), y: 0}]}/>
          <Borders className={styles.border}/>
          {this.state.error ?
            <Hint value={this.buildErrorValue(this.state.error)}>
              <SimpleTooltip content={listToStringWithCount(this.state.error.errors)}/>
            </Hint> : null
          }
          <XAxis tickLabelAngle={-35}/>
          <YAxis/>
        </XYPlot>
      </div>
    );
  }

  translateResultsPassed = (results) => {
    return results ? results.map(result => {
      return {
        x0: convertFromUTCtoDateWithSecondsDifference(result.created_at, -this.props.interval * 0.4),
        x: convertFromUTCtoDateWithSecondsDifference(result.created_at, this.props.interval * 0.4),
        y: result.rtt_avg_ms * (result.number_of_requests - result?.error_messages?.length),
      }
    }).filter(r => r.y !== 0) : [];
  };

  translateResultsFailed = (results) => {
    return results ? results.map(result => {
      return {
        x0: convertFromUTCtoDateWithSecondsDifference(result.created_at, -this.props.interval * 0.4),
        x: convertFromUTCtoDateWithSecondsDifference(result.created_at, this.props.interval * 0.4),
        y: result.rtt_avg_ms * result?.error_messages?.length,
        errors: result.error_messages
      }
    }).filter(r => r.y !== 0) : [];
  };

  valueOnMouseOver = (dataPoint) => {
    this.setState({...this.state, error: dataPoint}
    )
  };

  valueOnMouseOut = () => {
    this.setState({...this.state, error: null}
    )
  };

  buildErrorValue(hoveredCell) {
    const {x0, x, y, error, y0} = hoveredCell;
    const x_pos = new Date((x0.getTime() + x.getTime()) / 2);
    return {
      x: x_pos,
      y: y
    };
  }
}

