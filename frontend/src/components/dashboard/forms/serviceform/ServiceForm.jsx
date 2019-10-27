import React from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";


export class ServiceForm extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      name: props.name ? props.name : "",
    }
  }
  // TODO This is not needed anymore as we can use keys instead. Remove it later.
  // This might be unsafe but its needed if you switch directly from editing service to adding new one
  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   if (this.props.id !== nextProps.id || this.props.name !== nextProps.name) {
  //     this.setState({
  //       ...this.state,
  //       id: nextProps.id,
  //       name: nextProps.name,
  //     });
  //   }
  //   return true;
  // }

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Group>
          <Form.Label column={"name"}>
            {"Name"}
          </Form.Label>
          <FormControl
            type="text"
            name="name"
            onChange={this.onChange}
            value={this.state.name}
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

    const service = {
      name: this.state.name,
    };
    this.props.onSubmit(service);
  };

}