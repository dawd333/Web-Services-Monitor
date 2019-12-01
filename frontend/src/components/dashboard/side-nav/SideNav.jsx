import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { deleteService } from "../../../actions/services";
import { Card, ListGroup, Button } from "react-bootstrap";
import styles from "./SideNav.less";
import { Service, view } from "../DashboardModel";
import { changeView, selectService } from "../../../actions/dashboard";
import { DeleteModal } from "../../common/delete-modal/DeleteModal";

export class SideNav extends React.Component {
  static propTypes = {
    services: PropTypes.objectOf(PropTypes.shape(Service)),
    selectedServiceId: PropTypes.number,
    changeView: PropTypes.func.isRequired,
    selectService: PropTypes.func.isRequired,
    deleteService: PropTypes.func.isRequired
  };

  state = { showDeleteModal: false };

  render() {
    return (
      <div className={styles.sideNav}>
        {Object.values(this.props.services).map(this.renderService)}
        <Card className={styles.addService} key={"add_service"}>
          <a onClick={this.onAddService.bind(this)}>
            <Card.Header>{"Add service"}</Card.Header>
          </a>
        </Card>
        <DeleteModal
          label={`Delete service \"${this.getServiceName(
            this.props.selectedServiceId
          )}\" with entire data`}
          show={this.state.showDeleteModal}
          onClose={() =>
            this.setState({ ...this.state, showDeleteModal: false })
          }
          onDelete={this.deleteService}
        />
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

  renderServiceMenu = () => {
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
            variant="primary"
            className={styles.accordionButton}
            onClick={this.props.changeView.bind(
              this,
              view.ADD_DJANGO_HEALTH_CHECK
            )}
          >
            {"Add Health Check"}
          </Button>
          <Button
            variant="danger"
            className={styles.accordionButton}
            onClick={this.onDeleteClick}
          >
            {"Delete Service"}
          </Button>
          <Button
            variant="info"
            className={styles.accordionButton}
            href={"#/" + this.props.selectedServiceId}
          >
            {"Status page"}
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

  onDeleteClick = () => {
    this.setState({
      ...this.state,
      showDeleteModal: true
    });
  };

  deleteService = async () => {
    await this.props.deleteService(this.props.selectedServiceId);
    this.setState({
      ...this.state,
      showDeleteModal: false
    });
  };

  getServiceName = serviceId => {
    return this.props.services[serviceId]?.name
      ? this.props.services[serviceId].name
      : "";
  };
}

const mapStateToProps = state => ({
  selectedServiceId: state.dashboard.selectedServiceId
});

export default connect(mapStateToProps, {
  selectService,
  changeView,
  deleteService
})(SideNav);
