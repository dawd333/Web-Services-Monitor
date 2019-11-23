import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Badge, Button, ButtonToolbar, Container } from "react-bootstrap";
import { getDjangoHealthCheckResults } from "../../../actions/django-health-check";
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
import CalendarRangePicker from "../../common/CalendarRangePicker/CalendarRangePicker";
import moment from "moment";
import Table from "react-bootstrap/Table";
import { view } from "../DashboardModel";
import {
  changeView,
  deleteDjangoHealthCheck
} from "../../../actions/dashboard";
import { DeleteModal } from "../../common/DeleteModal/DeleteModal";

class DjangoHealthCheckOverview extends React.Component {
  static propTypes = {
    djangoHealthCheckModel: PropTypes.object.isRequired,
    results: PropTypes.array
  };

  state = {
    lastDrawLocation: null,
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
    const lastDrawLocation = this.state.lastDrawLocation;

    let xDomain;

    if (lastDrawLocation) {
      xDomain = [lastDrawLocation.left, lastDrawLocation.right];
    } else {
      xDomain = [this.state.fromDate, this.state.toDate];
    }

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
        <XYPlot
          animation
          width={850}
          height={350}
          stackBy="y"
          xType="time"
          xDomain={xDomain}
          yDomain={
            this.state.lastDrawLocation && [
              this.state.lastDrawLocation.bottom,
              this.state.lastDrawLocation.top
            ]
          }
        >
          <HorizontalGridLines />
          <XAxis tickLabelAngle={-35} />
          <YAxis />
          <VerticalRectSeries
            color={"#1aaf54"}
            data={this.translateResultsPassed(this.props.results)}
          />
          <VerticalRectSeries
            color={"#c70d3a"}
            data={this.translateResultsFailed(this.props.results)}
          />
          {/* <VerticalRectSeries data={[{ x: new Date(), y: 0 }]} /> */}
          <Highlight
            drag={false}
            onBrushEnd={area => this.setState({ lastDrawLocation: area })}
          />
        </XYPlot>
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

  translateResultsPassed = results => {
    return results
      ? results.map(result => {
          let yValue = 0;
          if (result.was_success) {
            yValue = 1;
          }
          return {
            x0: convertFromUTCtoDateWithSecondsDifference(
              result.created_at,
              -this.props.djangoHealthCheckModel.interval * 0.4
            ),
            x: convertFromUTCtoDateWithSecondsDifference(
              result.created_at,
              this.props.djangoHealthCheckModel.interval * 0.4
            ),
            y: yValue
          };
        })
      : [];
  };

  translateResultsFailed = results => {
    return results
      ? results.map(result => {
          let yValue = 0;
          if (!result.was_success) {
            yValue = 1;
          }
          return {
            x0: convertFromUTCtoDateWithSecondsDifference(
              result.created_at,
              -this.props.djangoHealthCheckModel.interval * 0.4
            ),
            x: convertFromUTCtoDateWithSecondsDifference(
              result.created_at,
              this.props.djangoHealthCheckModel.interval * 0.4
            ),
            y: yValue
          };
        })
      : [];
  };

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
  results: state.djangoHealthCheck.results
});

export default connect(mapStateToProps, {
  getDjangoHealthCheckResults,
  changeView,
  deleteDjangoHealthCheck
})(DjangoHealthCheckOverview);
