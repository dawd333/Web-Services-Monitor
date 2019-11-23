import React from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  changeView,
  deleteDjangoHealthCheck
} from "../../../../actions/dashboard";
import { view } from "../../DashboardModel";
import styles from "../../djangohealthcheckoverview/DjangoHealthCheckOverview.less";
import { ButtonToolbar } from "react-bootstrap";
import { DeleteModal } from "../../../common/delete-modal/DeleteModal";

class DjangoHealthCheckForm extends React.Component {
  static propTypes = {
    id: PropTypes.number,
    label: PropTypes.string.isRequired,
    ip: PropTypes.string,
    interval: PropTypes.number,
    isActive: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      ip: props.ip ? props.ip : "",
      interval: props.interval ? props.interval : 1000,
      isActive: props.isActive ? props.isActive : false,
      showDeleteModal: false
    };
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
        </Form.Group>
        <ButtonToolbar className={styles.djangoHealthCheckOverview__nav}>
          <Button type="submit" variant="success">
            {this.props.label}
          </Button>
          {this.props.id && (
            <>
              <Button variant="primary" onClick={this.onDetailsClick}>
                {"Details"}
              </Button>
              <Button variant="danger" onClick={this.onDeleteClick}>
                {"Delete"}
              </Button>
            </>
          )}
        </ButtonToolbar>
        <DeleteModal
          label={"Delete this Django Health Check configuration"}
          show={this.state.showDeleteModal}
          onClose={() =>
            this.setState({ ...this.state, showDeleteModal: false })
          }
          onDelete={this.deleteDjangoHealthCheckConfiguration}
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
      is_active: this.state.isActive
    };
    this.props.onSubmit(configuration);
  };

  onDetailsClick = () => {
    this.props.changeView(view.DJANGO_HEALTH_CHECK_OVERVIEW);
  };

  onDeleteClick = () => {
    this.setState({
      ...this.state,
      showDeleteModal: true
    });
  };

  deleteDjangoHealthCheckConfiguration = async () => {
    await this.props.deleteDjangoHealthCheck(
      this.props.serviceId,
      this.props.id
    );
    this.props.changeView(view.OVERVIEW);
  };
}

const mapStateToProps = state => ({
  serviceId: state.dashboard.selectedServiceId
});

export default connect(mapStateToProps, {
  changeView,
  deleteDjangoHealthCheck
})(DjangoHealthCheckForm);
