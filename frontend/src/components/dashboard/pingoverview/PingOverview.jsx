import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Container, Row} from "react-bootstrap";
import {getPingResults} from "../../../actions/ping";
import {
  convertFromUTCtoDate,
  convertFromUTCtoDateWithSecondsDifference,
  getCurrentDateUTC,
  getDateFromTodayUTC
} from "../../../commons/utils";
import {
  HorizontalGridLines,
  VerticalGridLines, VerticalRectSeriesCanvas,
  XAxis,
  XYPlot,
  YAxis
} from "react-vis";
import '../../../../../node_modules/react-vis/dist/style.css'; // import react-vis stylesheet
import styles from "./PingOverview.less";
import VerticalRectSeries from "react-vis/es/plot/series/vertical-rect-series";

class PingOverview extends React.Component {
  static propTypes = {
    pingModel: PropTypes.object.isRequired,
    results: PropTypes.array,
  };


  componentDidMount() {
    this.props.getPingResults(this.props.pingModel.id, getDateFromTodayUTC(-7), getCurrentDateUTC());
  }

  render() {
    return (
      <Container className={styles.pingOverview}>
        <h4 className={styles.pingOverview__header}>
          {"Ping results from last X days"}
        </h4>
        <XYPlot
          width={800}
          height={300}
          stackBy="y"
          xType="time"
          xDomain={[
            convertFromUTCtoDate(getDateFromTodayUTC(-7)),
            convertFromUTCtoDate(getCurrentDateUTC()),
          ]}
          labelAnchorY={"Average response time [ms]"}
        >
          <HorizontalGridLines/>
          <XAxis tickLabelAngle={-35}/>
          <YAxis/>
          <VerticalRectSeries color={"#1aaf54"} data={this.translateResultsPassed(this.props.results)}/>
          <VerticalRectSeries color={"#fc0d1b"} data={this.translateResultsFailed(this.props.results)}/>
        </XYPlot>

      </Container>
    );
  }

  translateResultsPassed = (results) => {
    return results ? results.map(result => {
      return {
        x0: convertFromUTCtoDateWithSecondsDifference(result.created_at, -this.props.pingModel.interval * 0.5),
        x: convertFromUTCtoDateWithSecondsDifference(result.created_at, this.props.pingModel.interval * 0.5),
        y: result.rtt_avg_ms * (result.number_of_requests - result?.error_messages?.length),
      }
    }) : [];
  };

  translateResultsFailed = (results) => {
    return results ? results.map(result => {
      return {
        x0: convertFromUTCtoDateWithSecondsDifference(result.created_at, -this.props.pingModel.interval * 0.5),
        x: convertFromUTCtoDateWithSecondsDifference(result.created_at, this.props.pingModel.interval * 0.5),
        y: result.rtt_avg_ms * result?.error_messages?.length + 20, // TODO remove + 20 (its only for testing w/out failed results)
      }
    }) : [];
  };

}

const mapStateToProps = state => ({
  results: state.ping.results,
});

export default connect(
  mapStateToProps,
  {getPingResults},
)(PingOverview);
