import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getServices,
  addService,
  deleteService,
  updateService
} from "../../../actions/services";
import {
  Accordion,
  AccordionCollapse,
  AccordionToggle,
  Card,
  ListGroup,
  Button,
  FormControl,
  Form,
  Modal
} from "react-bootstrap";
import styles from "./SideNav.less";
import { Service } from "../../../actions/types";

export class SideNav extends React.Component {
  state = {
    name: "",
    value: 0,
    service: {
      id: 0,
      name: "",
      value: 0
    },
    modalShow: false
  };

  static propTypes = {
    services: PropTypes.arrayOf(PropTypes.shape(Service)),
    getServices: PropTypes.func.isRequired,
    addService: PropTypes.func.isRequired,
    updateService: PropTypes.func.isRequired,
    deleteService: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getServices();
  }

  onChange = event => {
    if (event.target.type === "checkbox") {
      this.setState({ [event.target.name]: event.target.checked });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  };

  onSubmit = event => {
    event.preventDefault();

    const service = this.state;
    this.props.addService(service);

    this.setState({
      name: "",
      value: 0
    });
  };

  clearServiceState = () => {
    const clearService = {
      id: 0,
      name: "",
      value: 0
    };
    this.setState({ service: clearService });
  };

  handleOpenModal = service => {
    const serviceToUpdate = {
      id: service.id,
      name: service.name,
      value: service.value
    };
    this.setState({ modalShow: true, service: serviceToUpdate });
  };

  handleSaveModal = event => {
    event.preventDefault();
    const service = this.state.service;
    this.props.updateService(service);
    this.setState({ modalShow: false });
    this.clearServiceState();
  };

  handleCloseModal = () => {
    this.setState({ modalShow: false });
    this.clearServiceState();
  };

  onChangeModal = event => {
    const updatedService = { ...this.state.service };
    if (event.target.type === "checkbox") {
      updatedService[event.target.name] = event.target.checked;
    } else {
      updatedService[event.target.name] = event.target.value;
    }
    this.setState({ service: updatedService });
  };

  UpdateServiceModal = () => {
    const modalShow = this.state.modalShow;
    const { name, value } = this.state.service;

    return (
      <Modal size="lg" show={modalShow} onHide={this.handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="my-4">
            <Card.Body>
              <Form id="update-form" onSubmit={this.handleSaveModal}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <FormControl
                    type="text"
                    name="name"
                    onChange={this.onChangeModal}
                    value={name}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Value</Form.Label>
                  <FormControl
                    type="number"
                    name="value"
                    onChange={this.onChangeModal}
                    value={value}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleCloseModal}>
            Close
          </Button>
          <Button form="update-form" type="submit" variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  render() {
    const { name, value } = this.state;
    const services = this.props.services;

    return (
      <nav className={styles.sideNav}>
        <Accordion
          defaultActiveKey={services.length !== 0 ? services[0].id : undefined}
        >
          {services.map(service => {
            return (
              <Card key={service.id}>
                <AccordionToggle
                  as={Card.Header}
                  eventKey={service.id}
                  className={styles.toggle}
                >
                  {service.name}
                </AccordionToggle>
                <AccordionCollapse eventKey={service.id}>
                  <Card.Body>
                    <ListGroup>
                      <Button
                        variant="secondary"
                        className={styles.accordionButton}
                        onClick={this.handleOpenModal.bind(this, service)}
                      >
                        Update Service
                      </Button>
                      <Button
                        variant="danger"
                        className={styles.accordionButton}
                        onClick={this.props.deleteService.bind(
                          this,
                          service.id
                        )}
                      >
                        Delete Service
                      </Button>
                    </ListGroup>
                  </Card.Body>
                </AccordionCollapse>
              </Card>
            );
          })}
          <Card>
            <AccordionToggle
              as={Card.Header}
              eventKey="addService"
              className={(styles.toggle, styles.addServiceHeader)}
            >
              Add Service
            </AccordionToggle>
            <AccordionCollapse eventKey="addService">
              <Card.Body>
                <Form onSubmit={this.onSubmit}>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <FormControl
                      type="text"
                      name="name"
                      onChange={this.onChange}
                      value={name}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Value</Form.Label>
                    <FormControl
                      type="number"
                      name="value"
                      onChange={this.onChange}
                      value={value}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Button type="submit" variant="primary">
                      Submit
                    </Button>
                  </Form.Group>
                </Form>
              </Card.Body>
            </AccordionCollapse>
          </Card>
        </Accordion>
        <this.UpdateServiceModal />
      </nav>
    );
  }
}

const mapStateToProps = state => ({
  services: state.services.services
});

export default connect(
  mapStateToProps,
  { getServices, addService, deleteService, updateService }
)(SideNav);
