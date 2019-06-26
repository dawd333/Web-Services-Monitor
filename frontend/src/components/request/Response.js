import React, { Component } from "react";

export class Response extends Component {
  render() {
    if (this.props.hasResponse) {
      if (!this.props.isError) {
        return (
          <div>
            <br />
            <br />
            <hr />
            <h3>Your request was successful</h3>
            <h4 className="text-success">
              Status code: {this.props.urlResponse.status}
            </h4>
            {this.props.urlResponse.statusText.length > 0 && (
              <h4>Message included: {this.props.urlResponse.statusText}</h4>
            )}
          </div>
        );
      } else {
        return (
          <div>
            <br />
            <br />
            <hr />
            <h3>Your request was unsuccessful</h3>
            {this.props.urlResponse.response && (
              <h4 className="text-danger">
                Error code: {this.props.urlResponse.response.status}
              </h4>
            )}
            {this.props.urlResponse.message.length > 0 && (
              <h4 className="text-warning">
                Message included: {this.props.urlResponse.message}
              </h4>
            )}
          </div>
        );
      }
    } else {
      return null;
    }
  }
}

export default Response;
