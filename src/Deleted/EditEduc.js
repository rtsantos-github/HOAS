import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";
import {
  Col,
  Button,
  Modal,
  Form,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
// import "../Css/dropdown.css";

export default function EditEducational(props) {
  const [SelectedLevel, setSelectedLevel] = useState({
    EducLevelId: "",
    Description: "",
    SeqNo: 0,
    LastUpdate: new Date(),
    EntryDate: new Date(),
    EducationalBackground: null,
  });
  const [LevelCollection, setLevelCollection] = useState([
    {
      EducLevelId: "",
      Description: "",
      SeqNo: 0,
      LastUpdate: new Date(),
      EntryDate: new Date(),
      EducationalBackground: null,
    },
  ]);
  const [SchoolName, setSchoolName] = useState("");
  const [YearFrom, setYearFrom] = useState({ YrId: 0, YrDescription: 0 });
  const [YearTo, setYearTo] = useState({ YrToId: 0, YrToDescription: 0 });
  const [Isgraudated, setIsgraudated] = useState(false);
  const [SchoolYearFromCol, setSchoolYearFromCol] = useState([]);
  const [SchoolYearToCol, setSchoolYearToCol] = useState([]);
  const SchoolRef = useRef();
  const [Degree, setDegree] = useState("");

  //set initial values
  useEffect(() => {
    setSchoolName(props.selectededucrow.SchoolName);
    setYearFrom({
      YrId: props.selectededucrow.YearFrom,
      YrDescription: props.selectededucrow.YearFrom,
    });
    setYearTo({
      YrToId: props.selectededucrow.YearTo,
      YrToDescription: props.selectededucrow.YearTo,
    });
    setIsgraudated(props.selectededucrow.IsGraduated);
    setSelectedLevel(props.selectededucrow.EducLevel);
    setDegree(props.selectededucrow.Degree ? props.selectededucrow.Degree : "");
  }, [props.selectededucrow.SchoolName]);

  useEffect(() => {
    const YrItemCol = [];
    let i;
    for (i = 1940; i <= 2020; i++) {
      const YrItem = { YrId: i, YrDescription: i };
      YrItemCol.push(YrItem);
    }
    setSchoolYearFromCol(YrItemCol);
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:53993/api/Maintenance/gL").then((e) => {
      setLevelCollection(e.data);
    });
  }, []);

  function GenerteYrTo(YrFrom) {
    const YrToCol = [];
    const CurrentYr = new Date().getFullYear();

    let i;
    for (i = YrFrom; i <= CurrentYr; ++i) {
      const yrItem = { YrToId: i, YrToDescription: i };
      YrToCol.push(yrItem);
    }
    setSchoolYearToCol(YrToCol);
  }

  function GetSelectedEducLevel(Id) {
    const i = LevelCollection.findIndex((e) => e.EducLevelId === Id);
    setSelectedLevel(LevelCollection[i]);
    if (Id == "C") setDegree("");
    SchoolRef.current.focus();
  }

  function HandleSubmit() {
    const educItem = {
      EducId: props.selectededucrow.EducId,
      PersonId: props.selectededucrow.PersonId,
      EducLevelId: SelectedLevel.EducLevelId,
      SchoolName: SchoolName,
      YearFrom: YearFrom.YrDescription,
      YearTo: YearTo.YrToDescription,
      Degree: Degree,
      IsGraduated: Isgraudated,
      LastUpdate: new Date(),
      EntryDate: new Date(),
      EducLevel: null,
      Person: null,
    };
    Axios.post("http://localhost:53993/api/Maintenance/ue", educItem).then(
      (e) => {
        props.onHide();
        props.refreshdata();
      }
    );
  }
  return (
    <div>
      <Modal show={props.show} onHide={() => props.onHide()}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Educational Background</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Level</Form.Label>
              <DropdownButton
                id="dbLevel"
                title={
                  SelectedLevel ? SelectedLevel.Description : "Select Level"
                }
              >
                {LevelCollection.map((e) => (
                  <div key={e.EducLevelId}>
                    <Dropdown.Item
                      key={e.EducLevelId}
                      onClick={() => {
                        GetSelectedEducLevel(e.EducLevelId);
                      }}
                    >
                      {e.Description}
                    </Dropdown.Item>
                  </div>
                ))}
              </DropdownButton>
            </Form.Group>
            <Form.Group>
              <Form.Label>School Name</Form.Label>
              <Form.Control
                ref={SchoolRef}
                type="text"
                value={SchoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
            </Form.Group>
            {SelectedLevel.EducLevelId == "C" ? (
              <Form.Group>
                <Form.Label>Degree</Form.Label>
                <Form.Control
                  type="text"
                  value={Degree}
                  onChange={(e) => setDegree(e.target.value)}
                />
              </Form.Group>
            ) : (
              ""
            )}
            <Form.Group>
              <Form.Row>
                <Col sm={3}>
                  <Form.Label>From</Form.Label>
                  <DropdownButton
                    id="dpYear"
                    title={YearFrom ? YearFrom.YrDescription : "Select Year"}
                  >
                    {SchoolYearFromCol.map((e) => (
                      <div key={e.YrId}>
                        <Dropdown.Item
                          key={e.YrId}
                          onClick={() => {
                            setYearFrom(e);
                            setYearTo([]);
                            GenerteYrTo(e.YrId);
                          }}
                        >
                          {e.YrDescription}
                        </Dropdown.Item>
                      </div>
                    ))}
                  </DropdownButton>
                </Col>
                <Col sm={4}>
                  <Form.Label>To</Form.Label>
                  <DropdownButton
                    title={
                      YearTo.YrToDescription
                        ? YearTo.YrToDescription
                        : "Select Year"
                    }
                  >
                    {SchoolYearToCol.map((e) => (
                      <Dropdown.Item
                        key={e.YrToId}
                        onClick={() => setYearTo(e)}
                      >
                        {e.YrToDescription}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </Col>
              </Form.Row>
            </Form.Group>

            <Form.Group>
              <Form.Label>
                {"Did you graduate".concat(
                  " ",
                  SelectedLevel ? SelectedLevel.Description : "",
                  "?"
                )}
              </Form.Label>
              <Form.Check
                type="radio"
                name="rdGraduated"
                checked={Isgraudated ? true : false}
                onChange={(e) =>
                  setIsgraudated(
                    e.target.checked === true ? e.target.checked : false
                  )
                }
                label="Yes"
              />
              <Form.Check
                type="radio"
                name="rdGraduated"
                checked={Isgraudated ? false : true}
                onChange={(e) =>
                  setIsgraudated(
                    e.target.checked === true ? false : e.target.checked
                  )
                }
                label="No"
              />
            </Form.Group>

            <hr />
            <Button
              variant="primary"
              className="mr-1"
              onClick={() => HandleSubmit()}
            >
              Save
            </Button>
            <Button variant="secondary" onClick={() => props.onHide()}>
              Cancel
            </Button>
          </Form>
        </Modal.Body>

        {/* <Modal.Footer></Modal.Footer> */}
      </Modal>
    </div>
  );

  // return (
  //   <div>
  //     <Modal show={props.show} onHide={() => props.onHide()}>
  //       <Modal.Header closeButton>
  //         <Modal.Title>Edit Educational Background</Modal.Title>
  //       </Modal.Header>

  //       <Modal.Body>
  //         <Form>
  //           <Form.Group>
  //             <Form.Label>Level</Form.Label>
  //             <DropdownButton
  //               id="dbLevel"
  //               title={
  //                 SelectedLevel ? SelectedLevel.Description : "Select Level"
  //               }
  //             >
  //               {LevelCollection.map((e) => (
  //                 <div key={e.EducLevelId}>
  //                   <Dropdown.Item
  //                     key={e.EducLevelId}
  //                     onClick={() => {
  //                       GetSelectedEducLevel(e.EducLevelId);
  //                     }}
  //                   >
  //                     {e.Description}
  //                   </Dropdown.Item>
  //                 </div>
  //               ))}
  //             </DropdownButton>
  //           </Form.Group>
  //           <Form.Group>
  //             <Form.Label>School Name</Form.Label>
  //             <Form.Control
  //               ref={SchoolRef}
  //               type="text"
  //               value={SchoolName}
  //               onChange={(e) => setSchoolName(e.target.value)}
  //             />
  //           </Form.Group>
  //           <Form.Group>
  //             <Form.Row>
  //               <Col sm={3}>
  //                 <Form.Label>From</Form.Label>
  //                 <DropdownButton
  //                   id="dpYear"
  //                   title={YearFrom ? YearFrom.YrDescription : "Select Year"}
  //                 >
  //                   {SchoolYearFromCol.map((e) => (
  //                     <div key={e.YrId}>
  //                       <Dropdown.Item
  //                         key={e.YrId}
  //                         onClick={() => {
  //                           setYearFrom(e);
  //                           setYearTo([]);
  //                           GenerteYrTo(e.YrId);
  //                         }}
  //                       >
  //                         {e.YrDescription}
  //                       </Dropdown.Item>
  //                     </div>
  //                   ))}
  //                 </DropdownButton>
  //               </Col>
  //               <Col sm={4}>
  //                 <Form.Label>To</Form.Label>
  //                 <DropdownButton
  //                   title={
  //                     YearTo.YrToDescription
  //                       ? YearTo.YrToDescription
  //                       : "Select Year"
  //                   }
  //                 >
  //                   {SchoolYearToCol.map((e) => (
  //                     <Dropdown.Item
  //                       key={e.YrToId}
  //                       onClick={() => setYearTo(e)}
  //                     >
  //                       {e.YrToDescription}
  //                     </Dropdown.Item>
  //                   ))}
  //                 </DropdownButton>
  //               </Col>
  //             </Form.Row>
  //           </Form.Group>

  //           <Form.Group>
  //             <Form.Label>
  //               {"Did you graduate".concat(
  //                 " ",
  //                 SelectedLevel ? SelectedLevel.Description : "",
  //                 "?"
  //               )}
  //             </Form.Label>
  //             <Form.Check
  //               type="radio"
  //               name="rdGraduated"
  //               checked={Isgraudated ? true : false}
  //               onChange={(e) =>
  //                 setIsgraudated(
  //                   e.target.checked === true ? e.target.checked : false
  //                 )
  //               }
  //               label="Yes"
  //             />
  //             <Form.Check
  //               type="radio"
  //               name="rdGraduated"
  //               checked={Isgraudated ? false : true}
  //               onChange={(e) =>
  //                 setIsgraudated(
  //                   e.target.checked === true ? false : e.target.checked
  //                 )
  //               }
  //               label="No"
  //             />
  //           </Form.Group>

  //           <hr />
  //           <Button
  //             variant="primary"
  //             className="mr-1"
  //             onClick={() => HandleSubmit()}
  //           >
  //             Save
  //           </Button>
  //           <Button variant="secondary" onClick={() => props.onHide()}>
  //             Cancel
  //           </Button>
  //         </Form>
  //       </Modal.Body>

  //       {/* <Modal.Footer></Modal.Footer> */}
  //     </Modal>
  //   </div>
  // );
}
