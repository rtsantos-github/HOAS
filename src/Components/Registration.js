import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router";
import logo from "../images/EmployeeLogo.png";
import axios from "axios";

export default function RegForm() {
  const FirstName = GetInputValue("");
  const LastName = GetInputValue("");
  const Email = GetInputValue("");
  const Password = GetInputValue("");
  const history = useHistory();

  useEffect(() => {
    document.title = "Employee Registration";
  });

  function handleSubmit() {
    const RegDTO = {
      FirstName: FirstName.value,
      MiddleName: "",
      LastName: LastName.value,
      MobileNo: "",
      Email: Email.value,
      Password: Password.value,
      CreatedDate: new Date(),
      LastUpdate: new Date(),
      GenderId: null,
    };

    axios.post("a", RegDTO).then((e) => {
      if (e.data === "Added") {
        history.push({
          pathname: "/RMsg",
          state: { FName: FirstName.value },
        });
      }
    });
  }

  return (
    <Container>
      <Row>
        <h1>Registration</h1>
      </Row>
      <Row>
        <Col sm={8}>
          <Image src={logo} height="100%" width="100%" />
        </Col>
        <Col sm={4}>
          <Form onSubmit={() => handleSubmit()}>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter First Name"
              required
              {...FirstName}
            />
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Last Name"
              required
              {...LastName}
            />

            <Form.Label>Email</Form.Label>
            <Form.Control
              type="Email"
              placeholder="Enter Email"
              {...Email}
              required
            />
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              required
              {...Password}
            />

            <div className="text-right mt-3">
              <NavLink to="/Login" className="mr-3">
                Already Registered?
              </NavLink>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

function GetInputValue(props) {
  const [value, setValue] = useState(props);
  return { value, onChange: (e) => setValue(e.target.value) };
}
