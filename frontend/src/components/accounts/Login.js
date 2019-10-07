import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";
import { Card, Button, Form, FormControl, Col } from "react-bootstrap";

export class Login extends Component {
  state = {
    username: "",
    password: ""
  };

  static propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
  };

  onSubmit = event => {
    event.preventDefault();
    this.props.login(this.state.username, this.state.password);
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

    const { username, password } = this.state;
    return (
      <Col md={6} className="m-auto">
        <Card className="mt-5">
          <Card.Body>
            <h2 className="text-center">Login</h2>
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
                <Form.Label>Password</Form.Label>
                <FormControl
                  type="password"
                  name="password"
                  onChange={this.onChange}
                  value={password}
                ></FormControl>
              </Form.Group>
              <Form.Group>
                <Button variant="primary" type="submit">
                  Login
                </Button>
              </Form.Group>
            </Form>
            <p>
              Don't have an account? <Link to="/register">Register</Link>
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
  { login }
)(Login);
