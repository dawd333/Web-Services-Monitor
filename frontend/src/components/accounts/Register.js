import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { register } from "../../actions/auth";
import { createMessage } from "../../actions/messages";
import { Card, Button, Form, FormControl, Col } from "react-bootstrap";

export class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    password2: ""
  };

  static propTypes = {
    register: PropTypes.func.isRequired,
    createMessage: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
  };

  onSubmit = event => {
    event.preventDefault();
    const { username, email, password, password2 } = this.state;
    if (password !== password2) {
      this.props.createMessage({ passwordNotMatch: "Passwords do not match" });
    } else {
      const newUser = {
        username,
        email,
        password
      };
      this.props.register(newUser);
    }
  };

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }

    const { username, email, password, password2 } = this.state;
    return (
      <Col md={6} className="m-auto">
        <Card className="mt-5">
          <Card.Body>
            <h2 className="text-center">Register</h2>
            <Form onSubmit={this.onSubmit}>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <FormControl
                  type="text"
                  name="username"
                  onChange={this.onChange}
                  value={username}
                ></FormControl>
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <FormControl
                  type="email"
                  name="email"
                  onChange={this.onChange}
                  value={email}
                ></FormControl>
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <FormControl
                  type="password"
                  name="password"
                  onChange={this.onChange}
                  value={password}
                ></FormControl>
              </Form.Group>
              <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <FormControl
                  type="password"
                  name="password2"
                  onChange={this.onChange}
                  value={password2}
                ></FormControl>
              </Form.Group>
              <Form.Group>
                <Button variant="primary" type="submit">
                  Register
                </Button>
              </Form.Group>
            </Form>
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </Card.Body>
        </Card>
      </Col>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { register, createMessage }
)(Register);
