import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import { Navbar, Nav, Button } from "react-bootstrap";

export class Header extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <Nav className="mr-auto mt-2 mt-lg-0">
        <Navbar.Text className="mr-3">
          <strong>{user ? `Welcome ${user.username}` : ""}</strong>
        </Navbar.Text>
        <Nav.Item>
          <Button
            variant="info"
            size="sm"
            onClick={this.props.logout}
            className="text-light nav-link"
          >
            Logout
          </Button>
        </Nav.Item>
      </Nav>
    );

    const guestLinks = (
      <Nav className="mr-auto mt-2 mt-lg-0">
        <Link to="/register" className="nav-link">
          Register
        </Link>
        <Link to="/login" className="nav-link">
          Login
        </Link>
      </Nav>
    );

    return (
      <Navbar variant="light" expand="md" bg="light">
        <Navbar.Collapse>
          <Navbar.Brand href="#">Inżynierka</Navbar.Brand>
        </Navbar.Collapse>
        {isAuthenticated ? authLinks : guestLinks}
      </Navbar>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logout }
)(Header);
