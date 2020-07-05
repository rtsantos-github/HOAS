import React, { useState, useEffect, useMemo } from "react";
import {
  Row,
  Col,
  Image,
  Accordion,
  Card,
  Form,
  Button,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";

import mobilePic from "../images/phone.png";
import malePic from "../images/male.png";
import femalePic from "../images/female.png";
import emailPic from "../images/email.png";
import bdayPic from "../images/calendar.png";
import Axios from "axios";
import editPen from "../images/edit.png";
import removePic from "../images/trashbin.png";
import addPic from "../images/add.png";
import collegePic from "../images/College.png";
import blankPic from "../images/blank.png";
import DelPersonEduc from "./DeletePersonEduc";
import profilePic from "../images/ProfilePic.png";
import AddEducCom from "./AddEduc";
import EditEducCom from "./EditEduc";
import workexpPic from "../images/workexp.png";
import EditWorkExpCom from "./EditWorkExp";

export default function PersonalInfo(data) {
  const [HOId, setHOId] = useState(0);
  const [HOFirstName, setHOFirstName] = useState("");
  const [HOMiddleName, setHOMiddleName] = useState("");
  const [HOLastName, setHOLastName] = useState("");
  const [HOBirthdate, setHOBirthdate] = useState("");
  const [HOImagePath, setHOImagePath] = useState("");
  const [HOEmail, setHOEmail] = useState("");
  const [HOMobileNo, setHOMobileNo] = useState("");
  const [HOGender, setHOGender] = useState([]);
  const [PersonEduc, setPersonEduc] = useState([]);
  const [PersonWorkExp, setPersonWorkExp] = useState([]);
  const [ShowDeleteEduc, setShowDeleteEduc] = useState(false);
  const [SelectedEduc, setSelectedEduc] = useState({
    EducId: 0,
    PersonId: 0,
    EducLevelId: { EducLevelId: 0, Description: "" },
    SchoolName: "",
    YearFrom: 0,
    YearTo: 0,
    IsGraduated: false,
    LastUpdate: new Date(),
    EntryDate: new Date(),
    EducLevel: { EducLevelId: "", Description: "" },
    Person: null,
  });
  const [SelectedSchlLevel, setSelectedSchlLevel] = useState([]);
  const [ShowAddEduc, setShowAddEduc] = useState(false);
  const [ShowEditEduc, setShowEditEduc] = useState(false);
  const [ShowEditWorkExp, setShowEditWorkExp] = useState(false);
  const [SelectedWorkExp, setSelectedWorkExp] = useState([]);
  const [ShowPersonalEdit, setShowPersonalEdit] = useState(false);
  const [GenderCol, setGenderCol] = useState([]);

  const DelPopupWin = useMemo(
    () => (
      <DelPersonEduc
        show={ShowDeleteEduc}
        onHide={() => setShowDeleteEduc(false)}
        selectededucrow={SelectedEduc}
        selectedschlevel={SelectedSchlLevel}
        refreshdata={(e) => getEducData()}
      />
    ),
    [ShowDeleteEduc]
  );

  const AddPopWin = useMemo(
    () => (
      <AddEducCom
        show={ShowAddEduc}
        onHide={() => setShowAddEduc(false)}
        personid={HOId}
        refreshdata={() => getEducData()}
      />
    ),
    [ShowAddEduc]
  );

  const EditEducPopWin = useMemo(
    () => (
      <EditEducCom
        show={ShowEditEduc}
        onHide={() => setShowEditEduc(false)}
        selectededucrow={SelectedEduc}
        selectedschlevel={SelectedSchlLevel}
        refreshdata={(e) => getEducData()}
      />
    ),
    [ShowEditEduc]
  );

  const personEditWorkExperience = useMemo(
    () => (
      <EditWorkExpCom
        selectedworkexprow={SelectedWorkExp}
        CancelEdit={() => setShowEditWorkExp(false)}
      />
    ),
    [ShowEditWorkExp]
  );

  useEffect(() => {
    setHOId(data.PInfo.PersonId);
    setHOFirstName(data.PInfo.FirstName);
    setHOMiddleName(data.PInfo.MiddleName);
    setHOLastName(data.PInfo.LastName);
    setHOImagePath(data.PInfo.ImagePath);
    setHOMobileNo(data.PInfo.MobileNo);
    setHOGender(data.PInfo.Gender !== null ? data.PInfo.Gender : []);
    setHOBirthdate(data.PInfo.Birthdate !== null ? data.PInfo.Birthdate : "");
    setHOEmail(data.PInfo.Email);

    Axios.get("g").then((e) => {
      setGenderCol(e.data);
    });
  }, [data.PInfo.FirstName]);

  useEffect(() => {
    //get educational background
    getEducData();

    //get work experience
    getWorkExperience();
  }, [data.PInfo.FirstName]);

  function getWorkExperience() {
    Axios.get("gWorkExp", {
      params: {
        PersonId: data.PInfo.PersonId,
      },
    }).then((e) => {
      setPersonWorkExp(e.data);
    });
  }

  function getEducData() {
    Axios.get("gpEduc", {
      params: {
        Id: data.PInfo.PersonId,
      },
    }).then((e) => {
      setPersonEduc(e.data);
    });
  }

  function updateBasicContactInfo() {
    const p = {
      GenderId: HOGender.GenderId,
      PersonId: data.PInfo.PersonId,
      LastName: data.PInfo.LastName,
      FirstName: data.PInfo.FirstName,
      MiddleName: data.PInfo.MiddleName,
      Birthdate: HOBirthdate,
      MobileNo: HOMobileNo,
      Email: HOEmail,
      Password: data.PInfo.Password,
      ImagePath: data.PInfo.ImagePath,
      LastUpdate: new Date(),
      DateTime: new Date(),

      Gender: null,
      EducationalBackground: null,
      WorkExperience: null,
    };

    Axios.post("sv", p).then((e) => {});
  }

  function getSelectedEduc(EducId) {
    const i = PersonEduc.findIndex((e) => e.EducId === EducId);
    setSelectedEduc(PersonEduc[i]);
    setSelectedSchlLevel(PersonEduc[i].EducLevel);
  }

  function GetSelectedGender(GenderId) {
    const i = GenderCol.findIndex((e) => e.GenderId == GenderId);
    setHOGender(GenderCol[i]);
  }

  function GetSelectedWorkExp(WorkExpId) {
    const i = PersonWorkExp.findIndex((e) => e.WorkExpId === WorkExpId);
    setSelectedWorkExp(PersonWorkExp[i]);
  }

  return (
    <div>
      {/* Pop-up Windows only when the state is true to avoid unnecessary loading of components*/}
      {ShowDeleteEduc ? DelPopupWin : ""}
      {ShowAddEduc ? AddPopWin : ""}
      {ShowEditEduc ? EditEducPopWin : ""}

      <Row className="mt-2">
        <Col sm={"auto"}>
          <Image
            height="100px"
            width="100px"
            roundedCircle
            src={HOImagePath !== null ? HOImagePath : profilePic}
          />
        </Col>
        <Col sm={6} className="mt-2">
          <h5>{HOFirstName.concat(" ", HOMiddleName, " ", HOLastName)}</h5>
          <Form.Control type="file" />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <Accordion defaultActiveKey="0">
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                <h6>Basic Info and Contact </h6>
              </Accordion.Toggle>
              <Card.Body>
                <Row>
                  <Col sm={6}>
                    <div className="mt-2">
                      <Image
                        src={bdayPic}
                        height="20px"
                        width="20px"
                        className="ml-3 mr-2"
                      />
                      <small>Birthdate:</small>
                      {HOBirthdate.substring(0, 10)}
                    </div>

                    <div className="mt-2">
                      <Image
                        src={mobilePic}
                        height="20px"
                        width="20px"
                        className="ml-3 mr-2"
                      />
                      <small>Mobile:</small> {HOMobileNo}
                    </div>

                    <div className="mt-2">
                      <Image
                        src={emailPic}
                        height="20px"
                        width="20px"
                        className="ml-3  mr-2"
                      />
                      <small>Email:</small> {HOEmail}
                    </div>

                    <div className="mt-2">
                      <Image
                        src={
                          HOGender
                            ? HOGender.Description === "MALE"
                              ? malePic
                              : femalePic
                            : profilePic
                        }
                        height="20px"
                        width="20px"
                        className="ml-3 mr-2"
                      />
                      <small>Gender:</small>{" "}
                      {HOGender ? HOGender.Description : "Unknown"}
                    </div>
                  </Col>

                  <Col sm={6}>
                    <Image
                      src={editPen}
                      height="20px"
                      width="20px"
                      className="ml-3 mr-1"
                    />
                    <a href="#" onClick={() => setShowPersonalEdit(true)}>
                      Edit
                    </a>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6}>
                    {/* For Editing */}
                    {ShowPersonalEdit ? (
                      <div>
                        <hr />
                        <Form.Label>Birthdate</Form.Label>
                        <Form.Control
                          type="date"
                          value={HOBirthdate.substring(0, 10)}
                          onChange={(e) => setHOBirthdate(e.target.value)}
                        ></Form.Control>
                        <Form.Label>Mobile No</Form.Label>
                        <Form.Control
                          type="text"
                          value={HOMobileNo}
                          onChange={(e) => setHOMobileNo(e.target.value)}
                        />
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          value={HOEmail}
                          onChange={(e) => setHOEmail(e.target.value)}
                        />
                        <Form.Label>Gender</Form.Label>
                        <DropdownButton
                          title={
                            HOGender ? HOGender.Description : "Select Gender"
                          }
                        >
                          {GenderCol.map((e) => (
                            <Dropdown.Item
                              key={e.GenderId}
                              onClick={() => GetSelectedGender(e.GenderId)}
                            >
                              {e.Description}
                            </Dropdown.Item>
                          ))}
                        </DropdownButton>

                        <hr />
                        <div className="mt-3">
                          <Button
                            variant="primary"
                            id="btnSave"
                            className="mr-1"
                            onClick={() => {
                              updateBasicContactInfo();
                              setShowPersonalEdit(false);
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            variant="secondary"
                            id="btnCancel"
                            onClick={() => setShowPersonalEdit(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                <Row>
                  <Col sm={10}>
                    <h6>Educational Background</h6>
                  </Col>
                  <Col sm={2}>
                    <Image
                      src={addPic}
                      height="20px"
                      width="20px"
                      className="ml-3 mr-1"
                    />
                    <a
                      href="#"
                      id="addEduc"
                      onClick={() => setShowAddEduc(true)}
                    >
                      Add
                    </a>
                  </Col>
                </Row>
              </Accordion.Toggle>
              <Card.Body>
                {PersonEduc.map((e) => (
                  <Row className="mb-3" key={e.EducId}>
                    <Col sm={6}>
                      <div>
                        <Image
                          className="ml-3 mr-1"
                          src={collegePic}
                          height="20px"
                          width="20px"
                        />
                        {"Studied ".concat(
                          e.EducLevel.Description,
                          " at ",
                          e.SchoolName
                        )}
                      </div>
                      {e.EducLevel.EducLevelId === "C" ? (
                        <div className="ml-5">
                          <small>{"Degree ".concat(e.Degree)}</small>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="ml-5">
                        <small>
                          {"Year ".concat(e.YearFrom, " to ", e.YearTo)}
                        </small>
                      </div>
                      <div className="ml-5">
                        <small>Graduated:</small>{" "}
                        {" ".concat(e.IsGraduated ? "Yes" : "No", " ")}
                      </div>
                    </Col>

                    <Col sm={6}>
                      <div>
                        <Image
                          src={editPen}
                          height="20px"
                          width="20px"
                          className="ml-3 mr-1"
                        />
                        <a
                          href="#"
                          id="editEduc"
                          onClick={() => {
                            setShowEditEduc(true);
                            getSelectedEduc(e.EducId);
                          }}
                        >
                          Edit
                        </a>
                        <Image
                          src={removePic}
                          height="20px"
                          width="20px"
                          className="ml-3 mr-1"
                        />
                        <a
                          href="#"
                          id="removeEduc"
                          onClick={() => {
                            getSelectedEduc(e.EducId);
                            setShowDeleteEduc(true);
                          }}
                        >
                          Remove
                        </a>
                      </div>
                    </Col>
                    {ShowDeleteEduc ? <div>test edit</div> : ""}
                  </Row>
                ))}
              </Card.Body>
            </Card>

            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                <Row>
                  <Col sm={10}>
                    <h6>Work Experience</h6>
                  </Col>
                  <Col sm={2}>
                    <Image
                      src={addPic}
                      height="20px"
                      width="20px"
                      className="ml-3 mr-1"
                    />
                    <a
                      href="#"
                      id="addEduc"
                      onClick={() => setShowAddEduc(true)}
                    >
                      Add
                    </a>
                  </Col>
                </Row>
              </Accordion.Toggle>
              <Card.Body>
                {PersonWorkExp.map((e) => (
                  <div key={e.WorkExpId}>
                    <Row key={e.WorkExpId} className="mb-3">
                      <Col sm={6}>
                        {ShowEditWorkExp &&
                        SelectedWorkExp.WorkExpId === e.WorkExpId ? (
                          ""
                        ) : (
                          <div>
                            <Image
                              src={workexpPic}
                              height="20px"
                              width="20px"
                              className="ml-3 mr-2"
                            />
                            {" ".concat(
                              new Date() > e.EndDate ? "" : "Former ",
                              e.Position,
                              " at ",
                              e.CompanyName,
                              " ",
                              e.CityTown ? e.CityTown : ""
                            )}
                            <div className="ml-5">
                              <small>
                                {" ".concat(e.Description ? e.Description : "")}
                              </small>
                            </div>
                            <div className="ml-5">
                              <small>
                                {" ".concat(
                                  e.StartDate
                                    ? e.StartDate.substring(0, 10)
                                    : "",
                                  " To ",
                                  e.EndDate ? e.EndDate.substring(0, 10) : ""
                                )}
                              </small>
                            </div>
                          </div>
                        )}
                      </Col>

                      <Col sm={6}>
                        {ShowEditWorkExp &&
                        SelectedWorkExp.WorkExpId === e.WorkExpId ? (
                          ""
                        ) : (
                          <div>
                            <Image
                              src={editPen}
                              height="20px"
                              width="20px"
                              className="ml-3 mr-1"
                            />
                            <a
                              href="#"
                              id="editWorkExp"
                              onClick={() => {
                                GetSelectedWorkExp(e.WorkExpId);
                                setShowEditWorkExp(true);
                              }}
                            >
                              Edit
                            </a>

                            <Image
                              src={removePic}
                              height="20px"
                              width="20px"
                              className="ml-3 mr-1"
                            />
                            <a
                              href="#"
                              id="removeWorkExp"
                              onClick={() => {
                                GetSelectedWorkExp(e.WorkExpId);
                                // setShowEditWorkExp(true);
                              }}
                            >
                              Remove
                            </a>
                          </div>
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={6}>
                        {ShowEditWorkExp &&
                        SelectedWorkExp.WorkExpId === e.WorkExpId ? (
                          <div>{personEditWorkExperience}</div>
                        ) : (
                          ""
                        )}
                      </Col>
                    </Row>
                  </div>
                ))}

                {/* <Row>
                  <Col sm={6}>
                    {ShowEditWorkExp ? (
                      <div>
                        <hr />
                        {personEditWorkExperience}
                      </div>
                    ) : (
                      ""
                    )}
                  </Col>
                </Row> */}
              </Card.Body>
            </Card>
          </Accordion>
        </Col>
      </Row>
    </div>
  );
}
