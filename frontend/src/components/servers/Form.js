import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addServer } from "../../actions/servers";

export class Form extends Component {
  state = {
    name: "",
    ip: "",
    isActive: true
  };

  static propTypes = {
    addServer: PropTypes.func.isRequired
  };

  onChange = event => {
    if (event.target.type === "checkbox") {
      this.setState({ [event.target.name]: event.target.checked });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  };

  onSubmit = event => {
    event.preventDefault();
    const { name, ip, isActive } = this.state;
    const server = { name, ip, isActive };
    this.props.addServer(server);
    this.setState({
      name: "",
      ip: "",
      isActive: true
    });
  };

  render() {
    const { name, ip, isActive } = this.state;
    return (
      <div className="card card-body my-4">
        <h2>Add Server</h2>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              className="form-control"
              type="text"
              name="name"
              onChange={this.onChange}
              value={name}
            />
          </div>
          <div className="form-group">
            <label>IP</label>
            <input
              className="form-control"
              type="text"
              name="ip"
              onChange={this.onChange}
              value={ip}
            />
          </div>
          <div className="form-group">
            <label>isActive</label>
            <input
              className="form-control"
              type="checkbox"
              name="isActive"
              onChange={this.onChange}
              value={isActive}
              checked={isActive}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(
  null,
  { addServer }
)(Form);
