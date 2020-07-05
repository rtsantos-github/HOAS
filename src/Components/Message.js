import React from "react";
import { Row, Col, Image } from "react-bootstrap";
import logo from "../images/Registered.png";
import { useLocation } from "react-router";

export default function RegMessage() {
  const location = useLocation();

  return (
    <div>
      <Row>
        <Col>
          <Image src={logo} height="100%" width="100%" />
        </Col>
        <Col>
          <h1>{location.state.FName}</h1>
          <h2>Thank you. You have successfully registered.</h2>
        </Col>
      </Row>
    </div>
  );
}
