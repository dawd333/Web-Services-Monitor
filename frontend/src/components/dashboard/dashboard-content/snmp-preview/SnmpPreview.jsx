import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styles from "./SnmpPreview.less";
import { Badge, Button, ButtonToolbar } from "react-bootstrap";
import { convertFromUTC } from "../../../../commons/dateUtils";
import { view } from "../../DashboardModel";
import { HorizontalGridLines, XAxis, XYPlot, YAxis } from "react-vis";
import VerticalBarSeries from "react-vis/es/plot/series/vertical-bar-series";
import {
  changeView,
  selectSnmp,
  selectService
} from "../../../../actions/dashboard";
import {STATUS_PAGE_TYPE} from "../../../../commons/enums";

class SnmpPreview extends React.Component {
  static propTypes = {
    serviceId: PropTypes.number.isRequired,
    model: PropTypes.object.isRequired
  };

  render() {
    return (
      <div className={styles.snmpPreview}>
        <h4 className={styles.snmpPreview__header}>{"Snmp configuration"}</h4>
        <div className={styles.snmpPreview__content}>
          {this.renderLeftColumn()}
          {this.renderRightColumn()}
        </div>
        <ButtonToolbar>
          <Button
            className={styles.snmpPreview__button}
            variant={"primary"}
            onClick={this.onDetailsClick}
          >
            {"Details"}
          </Button>
          <Button
            className={styles.snmpPreview__button}
            variant={"primary"}
            onClick={this.onConfigurationClick}
          >
            {"Configuration"}
          </Button>
        </ButtonToolbar>
      </div>
    );
  }

  renderLeftColumn = () => {
    return (
      <div className={styles.snmpPreview__leftColumn}>
        <span className={styles.snmpPreview__label}>{"Ip:"}</span>
        <br />
        <span>{this.props.model.ip}</span>
        <br />

        <span className={styles.snmpPreview__label}>{"Interval:"}</span>
        <br />
        <span>
          {this.props.model.interval}
          {" seconds"}
        </span>
        <br />

        <span className={styles.snmpPreview__label}>{"Platform:"}</span>
        <br />
        <span>{this.props.model.platform}</span>
        <br />

        <span className={styles.snmpPreview__label}>{"Username:"}</span>
        <br />
        <span>{this.props.model.username}</span>
        <br />

        <span className={styles.snmpPreview__label}>
          {"Display on status page:"}
        </span>
        <br />
          <Badge pill={true} variant="warning">
            {STATUS_PAGE_TYPE[this.props.model.display_type]}
          </Badge>
        <br />
        <span className={styles.snmpPreview__label}>
          {"Email notifications:"}
        </span>
        <br />
        <Badge pill={true} variant="warning">
          {this.props.model?.email_notifications ? "Enabled" : "Disabled"}
        </Badge>
        <br />
      </div>
    );
  };

  renderRightColumn = () => {
    return (
      <div className={styles.snmpPreview__rightColumn}>
        <span className={styles.snmpPreview__label}>{"Created at:"}</span>
        <br />
        <span>{convertFromUTC(this.props.model.created_at)}</span>
        <br />

        <span className={styles.snmpPreview__label}>{"Last modified at:"}</span>
        <br />
        <span>{convertFromUTC(this.props.model.updated_at)}</span>
        <br />

        <span className={styles.snmpPreview__label}>{"Status:"}</span>
        <br />
        {this.props.model.is_active ? (
          <Badge pill={true} variant="success">
            {"Enabled"}
          </Badge>
        ) : (
          <Badge pill={true} variant="danger">
            {"Disabled"}
          </Badge>
        )}
        <br />

        <span className={styles.snmpPreview__label}>
          {"Percentage of failure in last"}
        </span>
        <br />
        <XYPlot
          width={180}
          height={120}
          stackBy="y"
          xType="ordinal"
          yDomain={[0, 100]}
        >
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <VerticalBarSeries
            barWidth={0.7}
            color={"#af1c21"}
            data={this.translateErrorPercentage(
              this.props.model.error_percentage
            )}
          />
        </XYPlot>
      </div>
    );
  };

  onDetailsClick = () => {
    this.props.selectSnmp(this.props.model);
    this.props.changeView(view.SNMP_OVERVIEW);
  };

  onConfigurationClick = () => {
    this.props.selectSnmp(this.props.model);
    this.props.changeView(view.EDIT_SNMP);
  };

  translateErrorPercentage = error_percentage => {
    const weekData = { x: "week", y: error_percentage.week };
    const dayData = { x: "day", y: error_percentage.day };
    const hourData = { x: "hour", y: error_percentage.hour };
    return [weekData, dayData, hourData];
  };
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { selectService, changeView, selectSnmp }
)(SnmpPreview);
