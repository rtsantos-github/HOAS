import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import "../Css/hoa.css";

export default function EditWorkExperience(data) {
  const [Position, setPosition] = useState(data.selectedworkexprow.Position);
  const [Company, setCompany] = useState(data.selectedworkexprow.CompanyName);
  const [CityTown, setCityTown] = useState(
    data.selectedworkexprow.CityTown ? data.selectedworkexprow.CityTown : ""
  );
  const [Description, setDescription] = useState(
    data.selectedworkexprow.Description
      ? data.selectedworkexprow.Description
      : ""
  );
  const [StartDate, setStartDate] = useState(
    data.selectedworkexprow.StartDate
      ? data.selectedworkexprow.StartDate.substring(0, 10)
      : ""
  );
  const [EndDate, setEndDate] = useState(
    data.selectedworkexprow.EndDate
      ? data.selectedworkexprow.EndDate.substring(0, 10)
      : ""
  );
  const [IsCurrentlyEmployed, setIsCurrentlyEmployed] = useState(
    data.selectedworkexprow.IsCurrentlyEmployed
  );

  return (
    <div className="ml-1">
      <hr />
      <Row>
        <Form.Group as={Col}>
          <Form.Label>Position</Form.Label>
          <Form.Control
            type="input"
            value={Position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Company</Form.Label>
          <Form.Control
            type="text"
            value={Company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col}>
          <Form.Label>City/Town</Form.Label>
          <Form.Control
            type="text"
            value={CityTown}
            onChange={(e) => setCityTown(e.target.value)}
          />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col}>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows="3"
            value={Description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col}>
          <Form.Label>Time Period</Form.Label>
          <Form.Check
            type="checkbox"
            label="I currently work here"
            checked={IsCurrentlyEmployed}
            onChange={(e) => setIsCurrentlyEmployed(e.target.checked)}
          />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col}>
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            value={StartDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Form.Group>

        <Form.Group as={Col}>
          {IsCurrentlyEmployed ? (
            <div>
              <Form.Label></Form.Label>
              <Form.Label>To Present</Form.Label>
            </div>
          ) : (
            <div>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={EndDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          )}
        </Form.Group>
      </Row>

      <hr />
      <Row className="mb-3">
        <Col sm={"auto"}>
          <Button variant="primary" id="btnSave" className="mr-1">
            Save
          </Button>
          <Button
            variant="secondary"
            id="btnCancel"
            onClick={() => data.CancelEdit()}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </div>
  );
}
