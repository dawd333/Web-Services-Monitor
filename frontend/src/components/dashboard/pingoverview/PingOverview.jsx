import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Container, FormGroup, Row} from "react-bootstrap";
import {getPingResults} from "../../../actions/ping";
import {
  convertFromUTCtoDate,
  convertFromUTCtoDateWithSecondsDifference,
  getCurrentDateUTC,
  getDateFromTodayUTC, getDateUtc
} from "../../../commons/utils";
import {
  HorizontalGridLines,
  VerticalRectSeries,
  XAxis,
  XYPlot,
  YAxis,
} from "react-vis";
import '../../../../../node_modules/react-vis/dist/style.css'; // import react-vis stylesheet
import styles from "./PingOverview.less";
import CalendarRangePicker from "../../common/CalendarRangePicker/CalendarRangePicker";
import moment from "moment";


class PingOverview extends React.Component {
  static propTypes = {
    pingModel: PropTypes.object.isRequired,
    results: PropTypes.array,
  };

  componentDidMount() {
    this.props.getPingResults(this.props.pingModel.id, getDateFromTodayUTC(-7), getCurrentDateUTC());
  }

  constructor(props) {
    super(props);
    this.state = {
      fromDate: moment().subtract(7, 'days').toDate(),
      toDate: new Date(),
    }
  }

  render() {
    return (
      <Container className={styles.pingOverview}>
        <span className={styles.pingOverview__header}>
          {"Ping results for "}
        </span>
        <CalendarRangePicker
          fromDate={this.state.fromDate}
          toDate={this.state.toDate}
          onChange={this.onChangeCalendar}
        />
        <XYPlot
          width={800}
          height={300}
          stackBy="y"
          xType="time"
          xDomain={[
            this.state.fromDate,
            this.state.toDate,
          ]}

        >
          <HorizontalGridLines/>
          <XAxis tickLabelAngle={-35}/>
          <YAxis/>
          <VerticalRectSeries color={"#1aaf54"} data={this.translateResultsPassed(this.props.results)}/>
          <VerticalRectSeries color={"#1aaf54"} data={this.translateResultsPassed(this.props.results)}/>
          {/* This is trick to bypass not rendering chart when data is empty */}
          <VerticalRectSeries data={[{x: new Date(), y:0}]}/>
        </XYPlot>

      </Container>
    );
  }

  translateResultsPassed = (results) => {
    return results ? results.map(result => {
      return {
        x0: convertFromUTCtoDateWithSecondsDifference(result.created_at, -this.props.pingModel.interval * 0.4),
        x: convertFromUTCtoDateWithSecondsDifference(result.created_at, this.props.pingModel.interval * 0.4),
        y: result.rtt_avg_ms * (result.number_of_requests - result?.error_messages?.length),
      }
    }) : [];
  };

  translateResultsFailed = (results) => {
    return results ? results.map(result => {
      return {
        x0: convertFromUTCtoDateWithSecondsDifference(result.created_at, -this.props.pingModel.interval * 0.4),
        x: convertFromUTCtoDateWithSecondsDifference(result.created_at, this.props.pingModel.interval * 0.4),
        y: result.rtt_avg_ms * result?.error_messages?.length,
      }
    }) : [];
  };

  onChangeCalendar = (fromDate, toDate) => {
    this.setState({
      ...this.state,
      fromDate,
      toDate,
    });
    this.props.getPingResults(this.props.pingModel.id, getDateUtc(fromDate), getDateUtc(toDate));
  }
}

const mapStateToProps = state => ({
  results: state.ping.results,
});

export default connect(
  mapStateToProps,
  {getPingResults},
)(PingOverview);
