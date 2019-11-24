import React from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


export class DeleteModal extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  };

  render() {
    return (
      <Modal show={this.props.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.label}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{"This operation cannot be undone!"}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={this.handleDelete}>
            {"Delete permanently"}
          </Button>
          <Button variant="secondary" onClick={this.handleClose}>
            {"Close"}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  handleClose = () => {
    this.props.onClose();
  };

  handleDelete = () => {
    this.props.onDelete();
  }

}
