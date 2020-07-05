import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import axios from "axios";

export default function Street() {
  const [LstStreet, setLstStreet] = useState([]);

  useEffect(() => {
    axios.get("gs").then((e) => {
      setLstStreet(e.data);
    });
  }, []);

  return (
    <Container>
      <Row className="mt-5">
        <Col sm={6}>
          <h1>Street</h1>
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <Table striped bordered hover size="lg">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {LstStreet.map((e) => (
                <tr key={e.Name}>
                  <td>{e.Name}</td>
                  <td>{e.Status.Description}</td>
                  <Button variant="success" className="ml-2 mt-1">
                    Edit
                  </Button>
                  <Button variant="danger" className="ml-2 mt-1">
                    Delete
                  </Button>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
