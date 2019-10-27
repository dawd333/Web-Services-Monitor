import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import styles from "./PingPreview.less"
import {Badge, Button, ButtonToolbar, Nav} from "react-bootstrap";
import {convertFromUTC} from "../../../../commons/utils";
import {view} from "../../DashboardModel";
import {changeView, selectPing, selectService} from "../../../../actions/dashboard";

class PingPreview extends React.Component {
  static propTypes = {
    serviceId: PropTypes.number.isRequired,
    model: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className={styles.pingPreview}>
        <h4 className={styles.pingPreview__header}>
          {"Ping configuration"}
        </h4>
        <div className={styles.pingPreview__content}>
          {this.renderLeftColumn()}
          {this.renderRightColumn()}
        </div>
        <ButtonToolbar>
          <Button
            variant={"primary"}
            onClick={this.onDetailsClick}
          >
            {"Details"}
          </Button>
          <Button
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
      <div className={styles.pingPreview__leftColumn}>
        <span className={styles.pingPreview__label}>{"Ip:"}</span><br/>
        <span>{this.props.model.ip}</span><br/>

        <span className={styles.pingPreview__label}>{"Status:"}</span><br/>
        {this.props.model.isActive ?
          <Badge pill={true} variant="success">{"enabled"}</Badge> :
          <Badge pill={true} variant="danger">{"disabled"}</Badge>
        }<br/>

        <span className={styles.pingPreview__label}>{"Interval:"}</span><br/>
        <span>{this.props.model.interval}{" seconds"}</span><br/>

        <span className={styles.pingPreview__label}>{"Timeout:"}</span><br/>
        <span>{this.props.model.timeout}{" seconds"}</span><br/>

        <span className={styles.pingPreview__label}>{"Number of requests:"}</span><br/>
        <span>{this.props.model.number_of_requests}</span><br/>
      </div>
    )
  };

  renderRightColumn = () => {
    return (
      <div className={styles.pingPreview__rightColumn}>
        <span className={styles.pingPreview__label}>{"Created at:"}</span><br/>
        <span>{convertFromUTC(this.props.model.created_at)}</span><br/>

        <span className={styles.pingPreview__label}>{"Last modified at:"}</span><br/>
        <span>{convertFromUTC(this.props.model.updated_at)}</span><br/>
      </div>
    )
  };

  onDetailsClick = () => {

  };

  onConfigurationClick = () => {
    this.props.selectPing(this.props.model);
    this.props.changeView(view.EDIT_PING);
  };
}


const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {selectService, changeView, selectPing},
)(PingPreview);
