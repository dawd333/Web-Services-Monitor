import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styles from "./SnmpPreview.less";
import { Badge, Button, ButtonToolbar, Nav } from "react-bootstrap";
import { convertFromUTC } from "../../../../commons/utils";
import { view } from "../../DashboardModel";
import {
  changeView,
  selectSnmp,
  selectService
} from "../../../../actions/dashboard";

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

        <span className={styles.snmpPreview__label}>{"Status:"}</span>
        <br />
        {this.props.model.is_active ? (
          <Badge pill={true} variant="success">
            {"enabled"}
          </Badge>
        ) : (
          <Badge pill={true} variant="danger">
            {"disabled"}
          </Badge>
        )}
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
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { selectService, changeView, selectSnmp }
)(SnmpPreview);
