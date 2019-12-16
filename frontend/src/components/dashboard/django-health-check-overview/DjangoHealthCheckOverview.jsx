import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Badge, Button, ButtonToolbar, Container } from "react-bootstrap";
import {
  convertFromUTC,
  convertFromUTCtoDateWithSecondsDifference,
  getCurrentDateUTC,
  getDateFromTodayUTC,
  getDateUtc
} from "../../../commons/dateUtils";
import {
  Highlight,
  HorizontalGridLines,
  VerticalRectSeries,
  XAxis,
  XYPlot,
  YAxis
} from "react-vis";
import "../../../../../node_modules/react-vis/dist/style.css"; // import react-vis stylesheet
import styles from "./DjangoHealthCheckOverview.less";
import CalendarRangePicker from "../../common/calendar-range-picker/CalendarRangePicker";
import moment from "moment";
import Table from "react-bootstrap/Table";
import { view } from "../DashboardModel";
import {
  changeView,
  getDjangoHealthCheckResults,
  deleteDjangoHealthCheck
} from "../../../actions/dashboard";
import { DeleteModal } from "../../common/delete-modal/DeleteModal";
import { DjangoHealthCheckChart } from "../charts/django-health-check-charts/DjangoHealthCheckChart";
import {STATUS_PAGE_TYPE} from "../../../commons/enums";

class DjangoHealthCheckOverview extends React.Component {
  static propTypes = {
    djangoHealthCheckModel: PropTypes.object.isRequired,
    results: PropTypes.array
  };

  state = {
    fromDate: moment()
      .subtract(7, "days")
      .toDate(),
    toDate: new Date(),
    showDeleteModal: false
  };

  componentDidMount() {
    this.props.getDjangoHealthCheckResults(
      this.props.djangoHealthCheckModel.id,
      getDateFromTodayUTC(-7),
      getCurrentDateUTC()
    );
  }

  render() {
    return (
      <Container className={styles.djangoHealthCheckOverview}>
        <span className={styles.djangoHealthCheckOverview__header}>
          {"Django Health Check results for "}
        </span>
        <CalendarRangePicker
          fromDate={this.state.fromDate}
          toDate={this.state.toDate}
          onChange={this.onChangeCalendar}
        />
        <DjangoHealthCheckChart
          fromDate={this.state.fromDate}
          toDate={this.state.toDate}
          results={this.props.results}
          interval={this.props.djangoHealthCheckModel.interval}
          brushing={true}
        />
        <br />
        <Table bordered>
          <tbody>
            <tr>
              <td className={styles.djangoHealthCheckOverview__labelColumn}>
                {"Ip"}
              </td>
              <td>{this.props.djangoHealthCheckModel.ip}</td>
            </tr>
            <tr>
              <td>{"Status"}</td>
              <td>
                {this.props.djangoHealthCheckModel.is_active ? (
                  <Badge pill={true} variant="success">
                    {"enabled"}
                  </Badge>
                ) : (
                  <Badge pill={true} variant="danger">
                    {"disabled"}
                  </Badge>
                )}
              </td>
            </tr>
            <tr>
              <td>{"Interval"}</td>
              <td>
                {this.props.djangoHealthCheckModel.interval}
                {" seconds"}
              </td>
            </tr>
            <tr>
              <td>{"Created at"}</td>
              <td>
                {convertFromUTC(this.props.djangoHealthCheckModel.created_at)}
              </td>
            </tr>
            <tr>
              <td>{"Last modified at"}</td>
              <td>
                {convertFromUTC(this.props.djangoHealthCheckModel.updated_at)}
              </td>
            </tr>
            <tr>
              <td>{"Display on status page"}</td>
              <td>{STATUS_PAGE_TYPE[this.props.djangoHealthCheckModel.display_type]}</td>
            </tr>
            <tr>
              <td>{"Email notifications"}</td>
              <td>{this.props.djangoHealthCheckModel?.email_notifications ? "Enabled" : "Disabled"}</td>
            </tr>
          </tbody>
        </Table>
        <ButtonToolbar className={styles.djangoHealthCheckOverview__nav}>
          <Button variant={"primary"} onClick={this.onConfigurationClick}>
            {"Configuration"}
          </Button>
          <Button variant={"danger"} onClick={this.onDeleteClick}>
            {"Delete"}
          </Button>
        </ButtonToolbar>
        <DeleteModal
          label={"Delete this Django Health Check configuration"}
          show={this.state.showDeleteModal}
          onClose={() =>
            this.setState({ ...this.state, showDeleteModal: false })
          }
          onDelete={this.deleteDjangoHealthCheckConfiguration}
        />
      </Container>
    );
  }

  onChangeCalendar = (fromDate, toDate) => {
    this.setState({
      ...this.state,
      fromDate,
      toDate
    });
    this.props.getDjangoHealthCheckResults(
      this.props.djangoHealthCheckModel.id,
      getDateUtc(fromDate),
      getDateUtc(toDate)
    );
  };

  onConfigurationClick = () => {
    this.props.changeView(view.EDIT_DJANGO_HEALTH_CHECK);
  };

  onDeleteClick = () => {
    this.setState({
      ...this.state,
      showDeleteModal: true
    });
  };

  deleteDjangoHealthCheckConfiguration = async () => {
    await this.props.deleteDjangoHealthCheck(
      this.props.djangoHealthCheckModel.service,
      this.props.djangoHealthCheckModel.id
    );
    this.props.changeView(view.OVERVIEW);
  };
}

const mapStateToProps = state => ({
  results: state.dashboard.djangoHealthCheckResults
});

export default connect(mapStateToProps, {
  changeView,
  getDjangoHealthCheckResults,
  deleteDjangoHealthCheck
})(DjangoHealthCheckOverview);
