import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { deleteService } from "../../../actions/services";
import { Card, ListGroup, Button } from "react-bootstrap";
import styles from "./SideNav.less";
import { Service, view } from "../DashboardModel";
import { changeView, selectService } from "../../../actions/dashboard";

export class SideNav extends React.Component {
  static propTypes = {
    services: PropTypes.objectOf(PropTypes.shape(Service)),
    selectedServiceId: PropTypes.number,
    changeView: PropTypes.func.isRequired,
    selectService: PropTypes.func.isRequired,
    deleteService: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className={styles.sideNav}>
        {Object.values(this.props.services).map(this.renderService)}
        <Card className={styles.addService} key={"add_service"}>
          <a onClick={this.onAddService.bind(this)}>
            <Card.Header>{"Add service"}</Card.Header>
          </a>
        </Card>
      </div>
    );
  }

  renderService = service => {
    return (
      <Card className={styles.service} key={service.id}>
        <a onClick={this.onSelectService.bind(this, service.id)}>
          <Card.Header>{service.name}</Card.Header>
        </a>
        {service.id === this.props.selectedServiceId &&
          this.renderServiceMenu(service)}
      </Card>
    );
  };

  renderServiceMenu = service => {
    return (
      <Card.Body>
        <ListGroup>
          <Button
            variant="success"
            className={styles.accordionButton}
            onClick={this.props.changeView.bind(this, view.OVERVIEW)}
          >
            {"Overview"}
          </Button>
          <Button
            variant="primary"
            className={styles.accordionButton}
            onClick={this.props.changeView.bind(this, view.EDIT_SERVICE)}
          >
            {"Update Service"}
          </Button>
          <Button
            variant="primary"
            className={styles.accordionButton}
            onClick={this.props.changeView.bind(this, view.ADD_PING)}
          >
            {"Add ping"}
          </Button>
          <Button
            variant="primary"
            className={styles.accordionButton}
            onClick={this.props.changeView.bind(this, view.ADD_SNMP)}
          >
            {"Add snmp"}
          </Button>
          <Button
            variant="danger"
            className={styles.accordionButton}
            onClick={this.props.deleteService.bind(this, service.id)}
          >
            {"Delete Service"}
          </Button>
        </ListGroup>
      </Card.Body>
    );
  };

  onAddService = () => {
    this.props.selectService(undefined);
    this.props.changeView(view.ADD_SERVICE);
  };

  onSelectService = serviceId => {
    this.props.changeView(view.OVERVIEW);
    this.props.selectService(serviceId);
  };
}

const mapStateToProps = state => ({
  selectedServiceId: state.dashboard.selectedServiceId
});

export default connect(
  mapStateToProps,
  { selectService, changeView, deleteService }
)(SideNav);
