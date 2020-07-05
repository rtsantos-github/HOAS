import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  Form,
  Image,
  Tabs,
  Tab,
} from "react-bootstrap";
import EmpDetails from "./EmployeeDetails";
import axios from "axios";
import calPic from "../images/calendar.png";
import phonePic from "../images/phone.png";
import emailPic from "../images/email.png";
import malePic from "../images/male.png";
import femalePic from "../images/female.png";
import viewPic from "../images/view.png";
import PersonInfo from "./PersonalInfoMUI";
import profilePic from "../images/ProfilePic.png";

export default function Maintenance() {
  const [Employeelst, setEmployeelst] = useState([]);
  const [IsshowDetailsWin, setshowDetailsWin] = useState(false);
  const [selectedItem, setselectedItem] = useState({
    GenderId: "",
    Gender: [
      {
        GenderId: "M",
        Description: "Male",
      },
    ],
    PersonId: 0,
    LastName: "",
    FirstName: "",
    MiddleName: "",
    Birthdate: "",
    MobileNo: "",
    Email: "",
    Password: "",
    ImagePath: "",
    LastUpdate: new Date(),
    DateCreated: new Date(),
  });
  const [TotalRec, setTotalRect] = useState(0);
  const [SearchName, setSearchName] = useState("");
  const [ActiveTab, setActiveTab] = useState("list");
  const searchRef = useRef();

  //to avoid child components from re-render
  const PersonInfoCom = useMemo(() => <PersonInfo PInfo={selectedItem} />, [
    ActiveTab,
  ]);

  useEffect(() => {
    axios.get("http://localhost:53993/api/Maintenance/gp").then((res) => {
      setEmployeelst(res.data);
      setTotalRect(res.data.length);
    });
  }, []);

  function GetRow(Id) {
    const i = Employeelst.findIndex((e) => e.PersonId === Id); //Finding record in the array
    setselectedItem(Employeelst[i]); //set the selectedItem to record founded based on index
  }

  function fnSearchName(reset) {
    if (reset) setSearchName("");

    axios
      .get("http://localhost:53993/api/Maintenance/gp", {
        params: {
          name: reset ? "" : SearchName,
        },
      })

      .then((e) => {
        setEmployeelst(e.data);
        setTotalRect(e.data.length);
        setActiveTab("list");
      });
  }

  return (
    <Container>
      <Row className="mt-5 mb-2">
        <Col lg={1}>
          <h1>Homeowners</h1>
        </Col>
        <Col lg={5}></Col>
        <Col lg={1}></Col>
        <Col lg={5}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Enter Name"
              value={SearchName}
              onChange={(e) => {
                setSearchName(e.target.value);
              }}
              ref={searchRef}
            />
            <InputGroup.Append>
              <Button variant="primary" onClick={() => fnSearchName(false)}>
                Search
              </Button>
              <Button
                variant="secondary"
                className="ml-1"
                onClick={() => fnSearchName(true)}
              >
                Reset
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="list"
        id="mainTab"
        activeKey={ActiveTab}
        onSelect={(k) => setActiveTab(k)}
      >
        <Tab eventKey="list" title={"List (".concat(TotalRec, ")")}>
          {Employeelst.map((e) => (
            <Row className="mt-2" key={e.PersonId}>
              <Col sm={"auto"}>
                <Image
                  height="100px"
                  width="100px"
                  roundedCircle
                  src={e.ImagePath !== null ? e.ImagePath : profilePic}
                />
              </Col>
              <Col sm={5} className="mt-2">
                <h5>
                  <a
                    href="#"
                    onClick={() => {
                      GetRow(e.PersonId);
                      setActiveTab("details");
                      setshowDetailsWin(true);
                    }}
                  >
                    {e.FirstName.concat(" ", e.MiddleName, " ", e.LastName)}
                  </a>
                </h5>
                <div>
                  <Image src={calPic} height="12px" width="12px" />
                  {" Birthdate:".concat(
                    " ",
                    e.Birthdate !== null
                      ? e.Birthdate.substring(0, 10)
                      : e.Birthdate
                  )}
                </div>
                <div>
                  <Image src={phonePic} height="12px" width="12px" />
                  {" Mobile No:".concat(" ", e.MobileNo)}
                </div>
                <div>
                  <Image src={emailPic} height="12px" width="12px" />
                  {" Email:".concat(" ", e.Email)}
                </div>
                <div>
                  <Image
                    src={
                      e.Gender !== null
                        ? e.Gender.Description === "MALE"
                          ? malePic
                          : femalePic
                        : ""
                    }
                    height="12px"
                    width="12px"
                  />
                  {" Gender:".concat(
                    " ",
                    e.Gender !== null ? e.Gender.Description : ""
                  )}
                </div>
                <hr />
              </Col>

              <Col sm={4} className="mt-2 mb-4">
                <Image
                  src={viewPic}
                  height="12px"
                  width="12px"
                  className="mr-1"
                />
                <a
                  className="mr-2"
                  href="#"
                  onClick={() => {
                    GetRow(e.PersonId);
                    setActiveTab("details");
                    setshowDetailsWin(true);
                  }}
                >
                  Show Details
                </a>
              </Col>
            </Row>
          ))}

          <Row>
            <Col sm={5}></Col>
            <Col sm={6}></Col>
            <Col sm={1}>{"Total:".concat(" ", TotalRec)}</Col>
          </Row>
        </Tab>
        <Tab eventKey="details" title="Details">
          {IsshowDetailsWin ? PersonInfoCom : ""}
        </Tab>
      </Tabs>
      <hr />

      {/* Popup Windows */}
      {/* <EmpUpdate
        show={IsshowUpdateWin}
        onHide={() => setshowUpdateWin(false)}
        selectedrow={selectedItem}
      /> */}
      {/* <EmpDetails
        show={IsshowDetailsWin}
        onHide={() => setshowDetailsWin(false)}
        selectedrow={selectedItem}
      /> */}
      {/* <EmpDeleteRecord
        show={IsShowEmpDelete}
        onHide={() => setIsShowEmpDelete(false)}
        selectedrow={selectedItem}
      />*/}
    </Container>
  );
}
