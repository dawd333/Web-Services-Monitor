import React from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {changeView, deletePing} from "../../../../actions/dashboard";
import {view} from "../../DashboardModel";
import styles from "../../pingoverview/PingOverview.less";
import {ButtonToolbar, Container} from "react-bootstrap";
import {DeleteModal} from "../../../common/DeleteModal/DeleteModal";

export class PingForm extends React.Component {
  static propTypes = {
    id: PropTypes.number,
    label: PropTypes.string.isRequired,
    ip: PropTypes.string,
    interval: PropTypes.number,
    isActive: PropTypes.bool,
    timeout: PropTypes.number,
    numberOfRequests: PropTypes.number,
    onSubmit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      ip: props.ip ? props.ip : "",
      interval: props.interval ? props.interval : 1000,
      isActive: props.isActive ? props.isActive : false,
      numberOfRequests: props.numberOfRequests ? props.numberOfRequests : 4,
      timeout: props.timeout ? props.timeout : 15,
      showDeleteModal: false,
    }
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Group>
          <Form.Label column={"ip"}>{"Ip"}</Form.Label>
          <FormControl
            type="text"
            name="ip"
            onChange={this.onChange}
            value={this.state.ip}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label column={"interval"}>
            {"Interval (in seconds):"}
          </Form.Label>
          <FormControl
            type="number"
            name="interval"
            onChange={this.onChange}
            value={this.state.interval}
          />
          <Form.Label column={"is_active"}>{"Is active:"}</Form.Label>
          <FormControl
            type="checkbox"
            name="isActive"
            onChange={this.onChangeBoolean}
            checked={this.state.isActive}
          />
          <Form.Label column={"number_of_requests"}>
            {"Number of requests:"}
          </Form.Label>
          <FormControl
            type="number"
            name="numberOfRequests"
            onChange={this.onChange}
            value={this.state.numberOfRequests}
          />
          <Form.Label column={"timeout"}>{"Timeout:"}</Form.Label>
          <FormControl
            type="number"
            name="timeout"
            onChange={this.onChange}
            value={this.state.timeout}
          />
        </Form.Group>
        <ButtonToolbar className={styles.pingOverview__nav}>
          <Button type="submit" variant="success">
            {this.props.label}
          </Button>
          {this.props.id &&
          <>
            <Button variant="primary" onClick={this.onDetailsClick}>
              {"Details"}
            </Button>
            <Button variant="danger" onClick={this.onDeleteClick}>
              {"Delete"}
            </Button>
          </>
          }
        </ButtonToolbar>
        <DeleteModal
          label={"Delete this ping configuration"}
          show={this.state.showDeleteModal}
          onClose={() => this.setState({...this.state, showDeleteModal: false})}
          onDelete={this.deletePingConfiguration}
        />
      </Form>
    );
  }

  onChange = event => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    });
  };

  onChangeBoolean = event => {
    this.setState({
      ...this.state,
      [event.target.name]: !this.state[event.target.name]
    });
  };

  onSubmit = event => {
    event.preventDefault();

    const configuration = {
      ip: this.state.ip,
      interval: this.state.interval,
      is_active: this.state.isActive,
      number_of_requests: this.state.numberOfRequests,
      timeout: this.state.timeout
    };
    this.props.onSubmit(configuration);
  };

  onDetailsClick = () => {
    this.props.changeView(view.PING_OVERVIEW)
  };

  onDeleteClick = () => {
    this.setState({
      ...this.state,
      showDeleteModal: true,
    })
  };

  deletePingConfiguration = async () => {
    await this.props.deletePing(this.props.serviceId, this.props.id);
    this.props.changeView(view.OVERVIEW);
  };

}

const mapStateToProps = state => ({
  serviceId: state.dashboard.selectedServiceId
});

export default connect(
  mapStateToProps,
  {changeView, deletePing},
)(PingForm);