import React from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";


export class PingForm extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    ip: PropTypes.string,
    interval: PropTypes.number,
    isActive: PropTypes.bool,
    timeout: PropTypes.number,
    numberOfRequests: PropTypes.number,
    onSubmit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      ip: props.ip ? props.ip : "",
      interval: props.interval ? props.interval : 1000,
      isActive: props.isActive ? props.isActive : false,
      numberOfRequests: props.numberOfRequests ? props.numberOfRequests : 0,
      timeout: props.timeout ? props.timeout : 0,
    }
  }

  // This might be unsafe but its needed if you switch directly from editing service to adding new one
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (this.props.ip !== nextProps.ip) {
      this.setState({
        ...this.state,
        ip: nextProps.ip,
        interval: nextProps.interval,
        isActive: nextProps.isActive,
        numberOfRequests: nextProps.numberOfRequests,
        timeout: nextProps.timeout,
      });
    }
    return true;
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Group>
          <Form.Label column={"ip"}>
            {"Ip"}
          </Form.Label>
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
          <Form.Label column={"is_active"}>
            {"Is active:"}
          </Form.Label>
          <FormControl
            type="checkbox"
            name="isActive"
            onChange={this.onChange}
            value={this.state.isActive}
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
          <Form.Label column={"timeout"}>
            {"Timeout:"}
          </Form.Label>
          <FormControl
            type="number"
            name="timeout"
            onChange={this.onChange}
            value={this.state.timeout}
          />
        </Form.Group>
        <Form.Group>
          <Button type="submit" variant="primary">
            {this.props.label}
          </Button>
        </Form.Group>
      </Form>
    )
  };

  onChange = event => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
    })
  };

  onSubmit = event => {
    event.preventDefault();

    const configuration = {
      ip: this.state.ip,
      interval: this.state.interval,
      is_active: this.state.isActive,
      number_of_requests: this.state.numberOfRequests,
      timeout: this.state.timeout,
    };
    this.props.onSubmit(configuration);
  };

}