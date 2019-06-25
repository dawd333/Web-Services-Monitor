import React, { Component } from "react";
import axios from "axios";

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
  }

  urlChange({ target }) {
    this.setState({
      ["urlAddress"]: target.value
    });
  }

  urlClick() {
    this.setState({ hasResponse: false });
    this.setState({ isError: false });

    axios
      .get(this.state.urlAddress)
      .then(response => {
        this.setState({ urlResponse: response });
        this.setState({ hasResponse: true });
        this.setState({ isError: false });
        console.log(this.state);
      })
      .catch(error => {
        this.setState({ urlResponse: error });
        this.setState({ hasResponse: true });
        this.setState({ isError: true });

        console.log(this.state);
      });
  }

  clearResponse() {
    this.setState({ hasResponse: false });
    this.setState({ urlResponse: "" });
    this.setState({ isError: false });
    console.log(this.state);
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

          {this.state.hasResponse ? (
            <h3>Your response</h3>
          ) : (
            <h1>Narazie pusto</h1>
          )}
        </div>
      </div>
    );
  }
}

export default Form;
