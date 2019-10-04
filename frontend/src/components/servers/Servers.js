import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getServers, deleteServer } from "../../actions/servers";

export class Servers extends Component {
  static propTypes = {
    servers: PropTypes.array.isRequired,
    getServers: PropTypes.func.isRequired,
    deleteServer: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getServers();
  }

  render() {
    return (
      <Fragment>
        <h2>Servers</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>IP</th>
              <th>isActive</th>
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
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={this.props.deleteServer.bind(this, server.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  servers: state.servers.servers
});

export default connect(
  mapStateToProps,
  { getServers, deleteServer }
)(Servers);
