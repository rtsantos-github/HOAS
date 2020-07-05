import React, { useState, useEffect, useMemo, useContext } from "react";
import Axios from "axios";
import {
  Button,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
  Checkbox,
  Dialog,
  DialogTitle,
} from "@material-ui/core";
import { Edit, Add, School, Clear } from "@material-ui/icons";

// import mobilePic from "../images/phone.png";
// import malePic from "../images/male.png";
// import femalePic from "../images/female.png";
// import emailPic from "../images/email.png";
// import bdayPic from "../images/calendar.png";
// import editPen from "../images/edit.png";
// import removePic from "../images/trashbin.png";
// import addPic from "../images/add.png";
// import collegePic from "../images/College.png";
import BackgroundProcessCom from "./BackgroundProcess";
import MessageContext from "./MessageContext";

export default function EducationalBackground(props) {
  const ShowMessage = useContext(MessageContext);
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
  const [OnProcess, setOnProcess] = useState(false);
  const [SchoolName, setSchoolName] = useState("");
  const [YearFrom, setYearFrom] = useState("");
  const [YearTo, setYearTo] = useState("");
  const [Isgraudated, setIsgraudated] = useState(false);
  const [SchoolYearFromCol, setSchoolYearFromCol] = useState([]);
  const [SchoolYearToCol, setSchoolYearToCol] = useState([]);
  const [Degree, setDegree] = useState("");
  const [ShowAddEduc, setShowAddEduc] = useState(false);
  const [ShowDeleteEduc, setShowDeleteEduc] = useState(false);
  const [ShowEditEduc, setShowEditEduc] = useState(false);
  const [PersonEduc, setPersonEduc] = useState([]);
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

  const DeletePopup = useMemo(
    () => () => (
      <div>
        <Dialog open={ShowDeleteEduc} onClose={() => setShowDeleteEduc(false)}>
          <DialogTitle>
            Record will be deleted. Click Delete to continue.
          </DialogTitle>
          <Grid container>
            <Grid item className="ml-4">
              <div>
                <Typography variant="body1">
                  <School className="mr-2" />
                  {"Studied ".concat(
                    SelectedEduc.EducLevel.Description,
                    " at ",
                    SelectedEduc.SchoolName
                  )}
                </Typography>
              </div>
              {SelectedEduc.EducLevel.EducLevelId === "C" ? (
                <div className="ml-5">
                  <Typography variant="body2">
                    {"Degree Taken ".concat(SelectedEduc.Degree)}
                  </Typography>
                </div>
              ) : (
                ""
              )}
              <div className="ml-5">
                <Typography variant="body2">
                  {"Year ".concat(
                    SelectedEduc.YearFrom,
                    " to ",
                    SelectedEduc.YearTo
                  )}
                </Typography>
              </div>
              <div className="ml-5">
                <Typography variant="body2">
                  {"Graduated: ".concat(
                    SelectedEduc.IsGraduated ? "Yes" : "No",
                    " "
                  )}
                </Typography>{" "}
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item sm={11} className="ml-3 mb-4">
              <hr />
              <Button
                variant="contained"
                color="secondary"
                id="btnDelete"
                onClick={() => DeleteEducServer(SelectedEduc)}
                className="mr-1"
              >
                Delete
              </Button>
              <Button
                variant="contained"
                color="default"
                id="btnDeleteCancel"
                onClick={() => setShowDeleteEduc(false)}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Dialog>
      </div>
    ),
    [ShowDeleteEduc]
  );

  //Generate Year From
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
    getEducLevel();
    getEducData();
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
    if (Id === "C") setDegree("");
  }

  function getEducLevel() {
    Axios.get("gL")
      .then((e) => {
        if (e.status === 200) {
          setLevelCollection(e.data);
        }
      })
      .catch((e) => {
        ShowMessage({
          MsgTitle: "Problem Encountered",
          MsgDetail:
            "Error in loading Educational Level.  Please contact your system administrator",
          MsgSeverity: "warning",
        });
      });
  }

  function getEducData() {
    Axios.get("gpEduc", {
      params: {
        PersonId: props.personid,
      },
    })
      .then((e) => {
        if (e.status === 200) {
          setPersonEduc(e.data);
        }
      })
      .catch((e) => {
        ShowMessage({
          MsgTitle: "Problem Encountered",
          MsgDetail:
            "Error in loading Educational Background.  Please contact your system administrator",
          MsgSeverity: "warning",
        });
      });
  }

  function getSelectedEduc(EducId) {
    const i = PersonEduc.findIndex((e) => e.EducId === EducId);
    setSelectedEduc(PersonEduc[i]);
    //  setSelectedSchlLevel(PersonEduc[i].EducLevel);
  }

  function AddEducBackbroundServer() {
    setOnProcess(true);
    const educItem = {
      EducId: SelectedEduc.EducId,
      PersonId: props.personid,
      EducLevelId: SelectedLevel.EducLevelId,
      SchoolName: SchoolName,
      YearFrom: YearFrom,
      YearTo: YearTo,
      Degree: SelectedLevel.EducLevelId === "C" ? Degree : "",
      IsGraduated: Isgraudated,
      LastUpdate: new Date(),
      EntryDate: new Date(),
      EducLevel: null, //Need to set to null to avoid API to add EducLevel
      Person: null,
    };
    Axios.post("ae", educItem)
      .then((e) => {
        if (e.status === 200) {
          getEducData();
          setShowAddEduc(false);
          setOnProcess(false);
          ShowMessage({
            MsgTitle: "Record Saved",
            MsgDetail: "New Educational Background successfully added.",
            MsgSeverity: "info",
          });
        }
      })
      .catch((e) => {
        ShowMessage({
          MsgTitle: "Problem Encountered",
          MsgDetail:
            "Problem in adding Educational Background.  Please contact your system administrator",
          MsgSeverity: "warning",
        });
      });
  }

  function UpdateEducBackbroundServer() {
    setOnProcess(true);
    const educItem = {
      EducId: SelectedEduc.EducId,
      PersonId: props.personid,
      EducLevelId: SelectedLevel.EducLevelId,
      SchoolName: SchoolName,
      YearFrom: YearFrom,
      YearTo: YearTo,
      Degree: SelectedLevel.EducLevelId === "C" ? Degree : "",
      IsGraduated: Isgraudated,
      LastUpdate: new Date(),
      EntryDate: new Date(),
      EducLevel: null,
      Person: null,
    };
    Axios.post("ue", educItem)
      .then((e) => {
        // UpdateEducBackbroundClient(
        //   SelectedEduc.EducId,
        //   SelectedLevel.EducLevelId
        // );
        if (e.status === 200) {
          getEducData();
          setShowEditEduc(false);
          setOnProcess(false);
          ShowMessage({
            MsgTitle: "Record Saved",
            MsgDetail: "Changes successfully applied.",
            MsgSeverity: "info",
          });
        }
      })
      .catch((e) => {
        ShowMessage({
          MsgTitle: "Problem Encountered",
          MsgDetail:
            "Problem in updating Educational Background.  Please contact your system administrator",
          MsgSeverity: "warning",
        });
      });
  }

  function DeleteEducServer(EducItem) {
    setOnProcess(true);
    Axios.post("gRemoveEduc", EducItem)
      .then((r) => {
        if (r.status === 200) {
          //Delete Client record
          //DeleteEducClient(EducItem);
          getEducData();
          setShowDeleteEduc(false);
          setOnProcess(false);
          ShowMessage({
            MsgTitle: "Record Deleted",
            MsgDetail: "Educational Background successfully deleted.",
            MsgSeverity: "info",
          });
        }
      })
      .catch((e) => {
        ShowMessage({
          MsgTitle: "Problem Encountered",
          MsgDetail:
            "Problem in deleting Educational Background.  Please contact your system administrator",
          MsgSeverity: "warning",
        });
      });
  }

  function DeleteEducClient(EducItem) {
    const i = PersonEduc.findIndex((e) => e.EducId === EducItem.EducId);
    PersonEduc.splice(i, 1);
    setPersonEduc(PersonEduc);
  }

  function UpdateEducBackbroundClient(EducId, EducLevelId) {
    const x = LevelCollection.findIndex((e) => e.EducLevelId === EducLevelId);
    const i = PersonEduc.findIndex((e) => e.EducId === EducId);
    PersonEduc[i].EducLevelId = LevelCollection[x].EducLevelId;
    PersonEduc[i].EducLevel = LevelCollection[x];
    PersonEduc[i].SchoolName = SchoolName;
    PersonEduc[i].Degree = Degree;
    PersonEduc[i].YearFrom = YearFrom;
    PersonEduc[i].YearTo = YearTo;
    PersonEduc[i].IsGraduated = Isgraudated;
    setPersonEduc(PersonEduc);
  }

  function AddEducBackbroundClient(Educ) {
    PersonEduc.push(Educ);
    setPersonEduc(PersonEduc);
  }

  function ResetValues() {
    setSelectedEduc({
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
    setSchoolName("");
    setDegree("");
    setYearFrom("");
    setYearTo("");
    setIsgraudated(false);
    setSelectedLevel({ EducLevelId: "", Description: "" });
  }

  return (
    <div>
      {/* Pop-up for Delete */}
      <DeletePopup />

      {/* Background Process */}
      <BackgroundProcessCom
        open={OnProcess}
        onClose={() => setOnProcess(false)}
      />

      <Grid container>
        <Grid item sm={11}>
          <Typography variant="h6">Educational Background</Typography>
          <hr style={{ margin: 0 }} />
        </Grid>
        <Grid item sm={1}>
          {props.AllowEdit ? (
            <Tooltip title="Add Educational Background">
              <IconButton
                onClick={() => {
                  ResetValues();
                  setShowAddEduc(true);
                }}
                style={{ paddingTop: 5 }}
              >
                <Add />
              </IconButton>
            </Tooltip>
          ) : (
            ""
          )}
        </Grid>
      </Grid>

      {/* Add new Educational Backgrounds */}
      {ShowAddEduc ? (
        <div>
          <Grid container spacing={2}>
            <Grid item>
              <Typography variant="subtitle2">Level</Typography>
              <Select
                id="AddselectLevel"
                value={SelectedLevel.EducLevelId}
                onChange={(e) => GetSelectedEducLevel(e.target.value)}
              >
                {LevelCollection.map((e) => (
                  <MenuItem key={e.EducLevelId} value={e.EducLevelId}>
                    {e.Description}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item>
              <Typography variant="subtitle2">School Name</Typography>
              <TextField
                id="txtAddSchoolName"
                value={SchoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                autoFocus
              />
            </Grid>
            <Grid item>
              {SelectedLevel.EducLevelId === "C" ? (
                <div>
                  <Typography variant="subtitle2">Degree</Typography>
                  <TextField
                    id="txtAddDegree"
                    value={Degree}
                    onChange={(e) => setDegree(e.target.value)}
                  />
                </div>
              ) : (
                ""
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item className="mt-4">
              <Typography variant="subtitle2">Year From</Typography>
              <Select
                id="AddSelectYrFrom"
                value={YearFrom}
                onChange={(e) => {
                  GenerteYrTo(e.target.value);
                  setYearFrom(e.target.value);
                }}
              >
                {SchoolYearFromCol.map((e) => (
                  <MenuItem key={e.YrId} value={e.YrId}>
                    {e.YrDescription}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item className="mt-4">
              <Typography variant="subtitle2">Year To</Typography>
              <Select
                id="AddSelectYrTo"
                value={YearTo}
                onChange={(e) => setYearTo(e.target.value)}
              >
                {SchoolYearToCol.map((e) => (
                  <MenuItem key={e.YrToId} value={e.YrToId}>
                    {e.YrToDescription}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item className="mt-4">
              <Typography variant="subtitle2">Graduated</Typography>
              <Checkbox
                checked={Isgraudated}
                onChange={(e) => setIsgraudated(e.target.checked)}
                color="primary"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item sm={11} className="mb-3">
              <hr />
              <Button
                id="btnAddSaveEduc"
                disableElevation
                onClick={() => AddEducBackbroundServer()}
                color="primary"
                variant="contained"
                style={{ marginRight: 2 }}
              >
                Save
              </Button>
              <Button
                id="btnAddCancelEduc"
                disableElevation
                onClick={() => setShowAddEduc(false)}
                color="secondary"
                variant="contained"
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </div>
      ) : (
        ""
      )}

      {PersonEduc.map((e) =>
        ShowEditEduc && SelectedEduc.EducId == e.EducId ? (
          //Edit Mode
          <div key={e.EducId} className="mt-4">
            <Grid container>
              <Grid item sm={11}>
                <hr />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item>
                <Typography variant="subtitle2">Level</Typography>
                <Select
                  id="selectLevel"
                  value={SelectedLevel.EducLevelId}
                  onChange={(e) => GetSelectedEducLevel(e.target.value)}
                >
                  {LevelCollection.map((e) => (
                    <MenuItem key={e.EducLevelId} value={e.EducLevelId}>
                      {e.Description}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item>
                <Typography variant="subtitle2">School Name</Typography>
                <TextField
                  id="txtSchoolName"
                  value={SchoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  autoFocus
                />
              </Grid>
              <Grid item>
                {SelectedLevel.EducLevelId === "C" ? (
                  <div>
                    <Typography variant="subtitle2">Degree</Typography>
                    <TextField
                      id="txtDegree"
                      value={Degree}
                      onChange={(e) => setDegree(e.target.value)}
                    />
                  </div>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item className="mt-4">
                <Typography variant="subtitle2">Year From</Typography>
                <Select
                  id="SelectYrFrom"
                  value={YearFrom}
                  onChange={(e) => {
                    GenerteYrTo(e.target.value);
                    setYearFrom(e.target.value);
                  }}
                >
                  {SchoolYearFromCol.map((e) => (
                    <MenuItem key={e.YrId} value={e.YrId}>
                      {e.YrDescription}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid item className="mt-4">
                <Typography variant="subtitle2">Year To</Typography>
                <Select
                  id="SelectYrTo"
                  value={YearTo}
                  onChange={(e) => setYearTo(e.target.value)}
                >
                  {SchoolYearToCol.map((e) => (
                    <MenuItem key={e.YrToId} value={e.YrToId}>
                      {e.YrToDescription}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid item className="mt-4">
                <Typography variant="subtitle2">Graduated</Typography>
                <Checkbox
                  checked={Isgraudated}
                  onChange={(e) => setIsgraudated(e.target.checked)}
                  color="primary"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item sm={11} className="mb-3">
                <hr />
                <Button
                  id="btnSaveEduc"
                  disableElevation
                  onClick={() => UpdateEducBackbroundServer()}
                  color="primary"
                  variant="contained"
                  style={{ marginRight: 2 }}
                >
                  Save
                </Button>
                <Button
                  id="btnCancelEduc"
                  disableElevation
                  onClick={() => setShowEditEduc(false)}
                  color="secondary"
                  variant="contained"
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </div>
        ) : (
          <div key={e.EducId}>
            <Grid container>
              <Grid item sm={10}>
                <div>
                  <Typography variant="body1">
                    <School style={{ marginRight: 5 }} />
                    {"Studied ".concat(
                      e.EducLevel.Description,
                      " at ",
                      e.SchoolName
                    )}
                  </Typography>
                </div>
                {e.EducLevel.EducLevelId === "C" ? (
                  <div className="ml-5">
                    <Typography variant="body2">
                      {"Degree Taken ".concat(e.Degree)}
                    </Typography>
                  </div>
                ) : (
                  ""
                )}
                <div className="ml-5">
                  <Typography variant="body2">
                    {"Year ".concat(e.YearFrom, " to ", e.YearTo)}
                  </Typography>
                </div>
                <div className="ml-5">
                  <Typography variant="body2">
                    {"Graduated: ".concat(e.IsGraduated ? "Yes" : "No", " ")}
                  </Typography>{" "}
                </div>
              </Grid>

              <Grid item sm={2}>
                {props.AllowEdit ? (
                  <div className="d-inline ml-4">
                    <IconButton
                      // Set values
                      onClick={() => {
                        setShowEditEduc(true);
                        getSelectedEduc(e.EducId);
                        GetSelectedEducLevel(e.EducLevelId);

                        //Assign values
                        setSchoolName(e.SchoolName);
                        setDegree(e.Degree);
                        setYearFrom(e.YearFrom);
                        GenerteYrTo(e.YearFrom);
                        setYearTo(e.YearTo);
                        setIsgraudated(e.IsGraduated);
                      }}
                    >
                      <Edit />
                    </IconButton>

                    <IconButton
                      onClick={() => {
                        getSelectedEduc(e.EducId);
                        setShowDeleteEduc(true);
                      }}
                    >
                      <Clear />
                    </IconButton>
                  </div>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </div>
        )
      )}
    </div>
  );
}
