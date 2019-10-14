import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getServers, deleteServer, updateServer } from "../../actions/servers";
import {
  Button,
  Table,
  Modal,
  Card,
  Form,
  FormControl,
  Col
} from "react-bootstrap";

export class Servers extends Component {
  state = {
    modalShow: false,
    server: {
      id: 0,
      name: "",
      ip: "",
      isActive: true,
      recurringTimeHours: 0,
      recurringTimeMinutes: 0,
      recurringTimeSeconds: 0
    }
  };

  static propTypes = {
    servers: PropTypes.array.isRequired,
    getServers: PropTypes.func.isRequired,
    updateServer: PropTypes.func.isRequired,
    deleteServer: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getServers();
  }

  clearServerState = () => {
    const clearServer = {
      id: 0,
      name: "",
      ip: "",
      isActive: true,
      recurringTimeHours: 0,
      recurringTimeMinutes: 0,
      recurringTimeSeconds: 0
    };
    this.setState({ server: clearServer });
  };

  handleOpenModal = server => {
    const recurringTimeArray = server.recurringTime.split(":");
    const serverToUpdate = {
      id: server.id,
      name: server.name,
      ip: server.ip,
      isActive: server.isActive,
      recurringTimeHours: recurringTimeArray[0],
      recurringTimeMinutes: recurringTimeArray[1],
      recurringTimeSeconds: recurringTimeArray[2]
    };
    this.setState({ modalShow: true, server: serverToUpdate });
  };

  handleSaveModal = event => {
    event.preventDefault();
    const {
      id,
      name,
      ip,
      isActive,
      recurringTimeHours,
      recurringTimeMinutes,
      recurringTimeSeconds
    } = this.state.server;

    const recurringTime = `${recurringTimeHours}:${recurringTimeMinutes}:${recurringTimeSeconds}`;
    const server = { id, name, ip, isActive, recurringTime };

    this.props.updateServer(server);
    this.setState({ modalShow: false });
    this.clearServerState();
  };

  handleCloseModal = () => {
    this.setState({ modalShow: false });
    this.clearServerState();
  };

  onChangeModal = event => {
    const updatedServer = { ...this.state.server };
    if (event.target.type === "checkbox") {
      updatedServer[event.target.name] = event.target.checked;
    } else {
      updatedServer[event.target.name] = event.target.value;
    }
    this.setState({ server: updatedServer });
  };

  UpdateServerModal = () => {
    const modalShow = this.state.modalShow;
    const {
      name,
      ip,
      isActive,
      recurringTimeHours,
      recurringTimeMinutes,
      recurringTimeSeconds
    } = this.state.server;

    return (
      <Modal size="lg" show={modalShow} onHide={this.handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Server</Modal.Title>
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
                  ></FormControl>
                </Form.Group>
                <Form.Group>
                  <Form.Label>IP</Form.Label>
                  <FormControl
                    type="text"
                    name="ip"
                    onChange={this.onChangeModal}
                    value={ip}
                  ></FormControl>
                </Form.Group>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="isActive"
                    onChange={this.onChangeModal}
                    label="isActive"
                    value={isActive}
                    checked={isActive}
                  />
                </Form.Group>
                <Form.Label>Recurring Time</Form.Label>
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>Hours</Form.Label>
                    <FormControl
                      type="number"
                      name="recurringTimeHours"
                      onChange={this.onChangeModal}
                      value={recurringTimeHours}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Minutes</Form.Label>
                    <Form.Control
                      type="number"
                      name="recurringTimeMinutes"
                      onChange={this.onChangeModal}
                      value={recurringTimeMinutes}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Seconds</Form.Label>
                    <Form.Control
                      type="number"
                      name="recurringTimeSeconds"
                      onChange={this.onChangeModal}
                      value={recurringTimeSeconds}
                    />
                  </Form.Group>
                </Form.Row>
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
    return (
      <Fragment>
        <h2>Servers</h2>
        <Table striped hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>IP</th>
              <th>isActive</th>
              <th>Recurring Time</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {this.props.servers.map(server => (
              <tr key={server.id}>
                <td>{server.id}</td>
                <td>{server.name}</td>
                <td>{server.ip}</td>
                <td>{server.isActive.toString()}</td>
                <td>{server.recurringTime}</td>
                <td>
                  <Button variant="secondary" size="sm">
                    View Server
                  </Button>
                  <Button
                    variant="warning"
                    size="sm"
                    className="mx-3"
                    onClick={this.handleOpenModal.bind(this, server)}
                  >
                    Change values
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={this.props.deleteServer.bind(this, server.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <this.UpdateServerModal></this.UpdateServerModal>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  servers: state.servers.servers
});

export default connect(
  mapStateToProps,
  { getServers, deleteServer, updateServer }
)(Servers);
