import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Badge, Button, ButtonToolbar, Container, FormGroup, OverlayTrigger, Popover, Row} from "react-bootstrap";
import {getPingResults} from "../../../actions/ping";
import {
  convertFromUTC,
  convertFromUTCtoDateWithSecondsDifference,
  getCurrentDateUTC,
  getDateFromTodayUTC, getDateUtc
} from "../../../commons/dateUtils";
import {
  Hint,
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
import Table from "react-bootstrap/Table";
import {view} from "../DashboardModel";
import {changeView, deletePing} from "../../../actions/dashboard";
import {DeleteModal} from "../../common/DeleteModal/DeleteModal";
import {SimpleTooltip} from "../../common/tooltip/SimpleTooltip";
import {listToStringWithCount} from "../../../commons/utils";


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
      showDeleteModal: false,
      error: null,
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
          height={350}
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
          <VerticalRectSeries color={"#c70d3a"} data={this.translateResultsFailed(this.props.results)}
                              onValueMouseOver={this.valueOnMouseOver} onValueMouseOut={this.valueOnMouseOut}/>
          {/* This is trick to bypass not rendering chart when data is empty */}
          <VerticalRectSeries data={[{x: new Date(), y: 0}]}/>
          {this.state.error ?
            <Hint value={this.buildErrorValue(this.state.error)}>
              <SimpleTooltip content={listToStringWithCount(this.state.error.errors)}/>
            </Hint> : null
          }
        </XYPlot>
        <br/>
        <Table bordered>
          <tbody>
          <tr>
            <td className={styles.pingOverview__labelColumn}>{"Ip"}</td>
            <td>{this.props.pingModel.ip}</td>
          </tr>
          <tr>
            <td>{"Status"}</td>
            <td>
              {
                this.props.pingModel.is_active ?
                  <Badge pill={true} variant="success">{"enabled"}</Badge> :
                  <Badge pill={true} variant="danger">{"disabled"}</Badge>
              }
            </td>
          </tr>
          <tr>
            <td>{"Interval"}</td>
            <td>{this.props.pingModel.interval}{" seconds"}</td>
          </tr>
          <tr>
            <td>{"Timeout"}</td>
            <td>{this.props.pingModel.timeout}{" seconds"}</td>
          </tr>
          <tr>
            <td>{"Number of requests"}</td>
            <td>
              {this.props.pingModel.number_of_requests}
            </td>
          </tr>
          <tr>
            <td>{"Created at"}</td>
            <td>
              {convertFromUTC(this.props.pingModel.created_at)}
            </td>
          </tr>
          <tr>
            <td>{"Last modified at"}</td>
            <td>
              {convertFromUTC(this.props.pingModel.updated_at)}
            </td>
          </tr>
          </tbody>
        </Table>
        <ButtonToolbar className={styles.pingOverview__nav}>
          <Button
            variant={"primary"}
            onClick={this.onConfigurationClick}
          >
            {"Configuration"}
          </Button>
          <Button
            variant={"danger"}
            onClick={this.onDeleteClick}
          >
            {"Delete"}
          </Button>
        </ButtonToolbar>
        <DeleteModal
          label={"Delete this ping configuration"}
          show={this.state.showDeleteModal}
          onClose={() => this.setState({...this.state, showDeleteModal: false})}
          onDelete={this.deletePingConfiguration}
        />
      </Container>
    );
  }

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
    const y_pos = (y0 + y) / 2;
    return {
      x: x_pos,
      y: y_pos
    };
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
        errors: result.error_messages
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
  };

  onConfigurationClick = () => {
    this.props.changeView(view.EDIT_PING);
  };

  onDeleteClick = () => {
    this.setState({
      ...this.state,
      showDeleteModal: true,
    })
  };

  deletePingConfiguration = async () => {
    await this.props.deletePing(this.props.pingModel.service, this.props.pingModel.id);
    this.props.changeView(view.OVERVIEW);
  };
}

const mapStateToProps = state => ({
  results: state.ping.results,
});

export default connect(
  mapStateToProps,
  {getPingResults, changeView, deletePing},
)(PingOverview);
