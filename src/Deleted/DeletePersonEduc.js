import React from "react";
import { Row, Col, Modal, Image, Button } from "react-bootstrap";
import axios from "axios";
import collegePic from "../images/College.png";
import blankPic from "../images/blank.png";

export default function DeleteRecord(params) {
  function handleDelete() {
    axios
      .post(
        "http://localhost:53993/api/Maintenance/gRemoveEduc",
        params.selectededucrow
      )
      .then((r) => {
        if (r.data === 1) {
          params.onHide();
          params.refreshdata();
        }
      });
  }

  return (
    <div>
      <Modal show={params.show} onHide={() => params.onHide()}>
        <Modal.Header closeButton>
          <Modal.Title>
            Record will be deleted. Press Delete to continue.
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col sm={"auto"}>
              <div>
                <Image
                  className="ml-3 mr-1"
                  src={collegePic}
                  height="20px"
                  width="20px"
                />
                <small>Level:</small>
                {" ".concat(params.selectedschlevel.Description)}
              </div>
              <div>
                <Image
                  className="ml-3 mr-1"
                  src={blankPic}
                  height="12px"
                  width="12px"
                />
                <small>Shool Name:</small>{" "}
                {" ".concat(params.selectededucrow.SchoolName)}
              </div>
            </Col>
            <Col>
              <div>
                <Image
                  className="ml-3 mr-1"
                  src={blankPic}
                  height="12px"
                  width="12px"
                />
                <small>From:</small>{" "}
                {" ".concat(params.selectededucrow.YearFrom, " ")}
                <small>To:</small> {" ".concat(params.selectededucrow.YearTo)}
              </div>
              <div>
                <Image
                  className="ml-3 mr-1"
                  src={blankPic}
                  height="12px"
                  width="12px"
                />
                <small>Graduated:</small>{" "}
                {" ".concat(
                  params.selectededucrow.IsGraduated ? "Yes" : "No",
                  " "
                )}
              </div>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Row>
            <Col sm={12}>
              <Button
                variant="danger"
                onClick={() => handleDelete()}
                className="mr-2"
              >
                Delete
              </Button>
              <Button variant="secondary" onClick={() => params.onHide()}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
