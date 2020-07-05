import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function EmployeeDetails(showValue) {
  return (
    <div>
      <Modal {...showValue} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>{showValue.selectedrow.FirstName} </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary">Add</Button>
          <Button variant="danger" onClick={() => showValue.onHide()}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
