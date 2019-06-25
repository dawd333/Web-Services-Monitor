import React, { Component } from "react";

export class Form extends Component {
  render() {
    return (
      <div className="row">
        <div className="col center-block text-center m-3 form-group">
          <h3>Please enter URL you want to check</h3>
          <input
            type="text"
            className="form-control mt-3"
            id="urlAddress"
            aria-describedby="urlHelp"
            placeholder="Enter URL"
          />
          <blockquote className="text-left">
            <small id="urlHelp" className="form-text text-muted">
              Make sure your url is valid !
            </small>
          </blockquote>
          <button
            type="submit"
            className="btn btn btn-outline-secondary float-right"
          >
            Check site!
          </button>
        </div>
      </div>
    );
  }
}

export default Form;
