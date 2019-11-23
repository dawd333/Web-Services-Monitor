import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Badge, Button, ButtonToolbar, Container} from "react-bootstrap";
import {
  convertFromUTC,
  getCurrentDateUTC,
  getDateFromTodayUTC, getDateUtc
} from "../../../commons/dateUtils";
import '../../../../../node_modules/react-vis/dist/style.css'; // import react-vis stylesheet
import styles from "./PingOverview.less";
import CalendarRangePicker from "../../common/CalendarRangePicker/CalendarRangePicker";
import moment from "moment";
import Table from "react-bootstrap/Table";
import {view} from "../DashboardModel";
import {changeView, deletePing, getPingResults} from "../../../actions/dashboard";
import {DeleteModal} from "../../common/DeleteModal/DeleteModal";
import {PingChart} from "../charts/PingChart";


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
        <PingChart
          fromDate={this.state.fromDate}
          toDate={this.state.toDate}
          results={this.props.results}
          interval={this.props.pingModel.interval}
        />
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
  results: state.dashboard.pingResults,
});

export default connect(
  mapStateToProps,
  {getPingResults, changeView, deletePing},
)(PingOverview);
