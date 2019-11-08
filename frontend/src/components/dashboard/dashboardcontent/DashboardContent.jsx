import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Container, Row} from "react-bootstrap";
import styles from "./DashboardContent.less"
import {getPings} from "../../../actions/dashboard";
import PingPreview from "./pingpreview/PingPreview";

class DashboardContent extends React.Component {
  static propTypes = {
    serviceId: PropTypes.number.isRequired,
    pings: PropTypes.array,
    getPings: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getPings(this.props.serviceId);
  }

  render() {
    return (
      <Container className={styles.dashboardContent}>
        {this.props.pings && this.renderRow2(this.translatePingsToComponent())}
      </Container>
    );
  }

  renderRow2 = (components) => {
    let rows = [];
    for (let index = 0; index < components.length; index += 2) {
      rows.push(
        <Row className={styles.dashboardContent__row} key={index}>
          {components[index]}
          {components[index + 1]}
        </Row>
      )
    }
    return (
      <>
        {rows}
      </>
    )
  };

  translatePingsToComponent = () => {
    return this.props.pings.map((ping, index) => {
      return (
        <PingPreview
          key={index}
          serviceId={this.props.serviceId}
          model={ping}
        />

      )
    });
  }

}


const mapStateToProps = state => ({
  pings: state.dashboard.pings,
});

export default connect(
  mapStateToProps,
  {getPings},
)(DashboardContent);
