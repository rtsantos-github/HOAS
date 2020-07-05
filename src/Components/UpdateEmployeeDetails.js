import React, { useState, useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  Modal,
  Image,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import axios from "axios";

export default function UpdateEmployee(ShowValue) {
  const [FirstName, setFirstName] = useState("");
  const [MiddleName, setMiddleName] = useState("");
  const [LastName, setLastName] = useState("");
  const [MobileNo, setMobileNo] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [EmpGender, setEmpGender] = useState([]);
  const [GenderCol, setGenderCol] = useState([]);
  const [Birthday, setBirthday] = useState("");
  const [ProfPic, setProfPic] = useState("");

  //Get gender list
  useEffect(() => {
    axios
      .get("g")
      .then((r) => {
        setGenderCol(r.data);
      })
      .catch((e) => {
        alert(e.data);
      });
  }, []);

  //set initial values from parent maintenance page
  useEffect(() => {
    setFirstName(ShowValue.selectedrow.FirstName);
    setMiddleName(ShowValue.selectedrow.MiddleName);
    setLastName(ShowValue.selectedrow.LastName);
    setMobileNo(ShowValue.selectedrow.MobileNo);
    setEmail(ShowValue.selectedrow.Email);
    setPassword(ShowValue.selectedrow.Password);
    setEmpGender(ShowValue.selectedrow.Gender);
    setBirthday(
      ShowValue.selectedrow.Birthdate !== null
        ? ShowValue.selectedrow.Birthdate.substring(0, 10)
        : ""
    );
    setProfPic(ShowValue.selectedrow.ImagePath);
  }, [ShowValue.selectedrow.FirstName]);

  function selectGender(GenderId) {
    const i = GenderCol.findIndex((e) => e.GenderId === GenderId);
    setEmpGender(GenderCol[i]);
  }

  function handleSubmit() {
    //event.preventDefault();

    const personData = {
      GenderId: EmpGender.GenderId,
      PersonId: ShowValue.selectedrow.PersonId,
      LastName: LastName,
      FirstName: FirstName,
      MiddleName: MiddleName,
      Birthdate: Birthday,
      MobileNo: MobileNo,
      Email: Email,
      Password: Password,
      LastUpdate: new Date(),
      DateCreated: new Date(),
      ImagePath: "",
    };
    axios.post("sv", personData).then((e) => {
      if (e.data === "Updated") {
        // history.push("/");
        // history.push("/list");
      }
    });
  }

  return (
    <Modal {...ShowValue} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Employee Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          <Col sm={6}>
            <Image src={ProfPic} height="100px" width="100px" roundedCircle />
            <Form.Control
              type="file"
              className="mt-2"
              accept="image/*|MIME_Type"
            />
          </Col>
        </Row>
        <hr />
        <Row className="mt-3">
          <Col sm={6}>
            <Form onSubmit={() => handleSubmit()}>
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter First name"
                  required
                  value={FirstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Middle Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Middle name"
                  required
                  value={MiddleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Last name"
                  required
                  value={LastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Birthday</Form.Label>
                <Form.Control
                  type="date"
                  value={Birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Mobile No</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter Mobile No"
                  required
                  value={MobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="Email"
                  placeholder="Enter Email"
                  required
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="Password"
                  placeholder="Enter Password"
                  required
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Gender</Form.Label>
                <DropdownButton
                  title={
                    EmpGender != null ? EmpGender.Description : "Select Gender"
                  }
                  id="drpGender"
                  variant="success"
                >
                  {GenderCol.map((e) => (
                    <Dropdown.Item
                      key={e.GenderId}
                      onClick={() => selectGender(e.GenderId)}
                    >
                      {e.Description}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </Form.Group>

              <Form.Group>
                <Button variant="primary" type="submit" className="mr-2">
                  Submit
                </Button>
                <Button variant="danger" onClick={() => ShowValue.onHide()}>
                  Close
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer className="text-align:left">
        <h6>Please fill out all requierd information.</h6>
      </Modal.Footer>
    </Modal>
  );
}
