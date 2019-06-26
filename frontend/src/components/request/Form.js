import React, { Component } from "react";
import axios from "axios";
import Response from "./Response";

export class Form extends Component {
  constructor() {
    super();
    this.state = {
      urlAddress: "",
      urlResponse: "",
      hasResponse: false,
      isError: false
    };

    this.urlChange = this.urlChange.bind(this);
    this.urlClick = this.urlClick.bind(this);
    this.clearResponse = this.clearResponse.bind(this);
  }

  urlChange({ target }) {
    this.setState({
      ["urlAddress"]: target.value
    });
  }

  urlClick() {
    this.setState({ hasResponse: false, isError: false });

    axios
      .get(this.state.urlAddress)
      .then(response => {
        this.setState({ urlResponse: response, hasResponse: true });
      })
      .catch(error => {
        this.setState({ urlResponse: error, hasResponse: true, isError: true });
      });
  }

  clearResponse() {
    this.setState({ hasResponse: false, urlResponse: "", isError: false });
  }

  render() {
    return (
      <div className="row">
        <div className="col center-block text-center m-3 form-group">
          <h3>Please enter URL you want to check</h3>
          <input
            type="text"
            className="form-control mt-3"
            aria-describedby="urlHelp"
            placeholder="Enter URL"
            value={this.urlAddress}
            onChange={this.urlChange}
          />
          <blockquote className="text-left">
            <small id="urlHelp" className="form-text text-muted">
              Make sure your url is valid !
            </small>
          </blockquote>
          <button
            type="submit"
            className="btn btn btn-outline-secondary ml-2 float-right"
            onClick={this.clearResponse}
          >
            Clear response
          </button>
          <button
            type="submit"
            className="btn btn btn-outline-secondary float-right"
            onClick={this.urlClick}
            disabled={!this.state.urlAddress}
          >
            Check site!
          </button>
          <Response
            urlResponse={this.state.urlResponse}
            hasResponse={this.state.hasResponse}
            isError={this.state.isError}
          />
        </div>
      </div>
    );
  }
}

export default Form;
