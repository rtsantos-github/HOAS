import React, { useState, useEffect, useMemo, useContext } from "react";
import Axios from "axios";
import {
  Button,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  TextField,
  Tooltip,
  IconButton,
  Checkbox,
} from "@material-ui/core";

import { Clear, Edit, Add, Work } from "@material-ui/icons";
import BackgroundProcessCom from "./BackgroundProcess";
import MessageContext from "./MessageContext";

export default function WorkExperienceCom(props) {
  const ShowMessage = useContext(MessageContext);
  const [PersonWorkExp, setPersonWorkExp] = useState([]);
  const [ShowAddWorkExp, setShowAddWorkExp] = useState(false);
  const [ShowEditWorkExp, setShowEditWorkExp] = useState(false);
  const [ShowDeleteWorkExp, setShowDeleteWorkExp] = useState(false);
  const [SelectedWorkExp, setSelectedWorkExp] = useState([]);
  const [OnProcess, setOnProcess] = useState(false);
  const [HOPosition, setHOPosition] = useState("");
  const [HOCompany, setHOCompany] = useState("");
  const [HODescription, setHODescription] = useState("");
  const [HOCityTown, setHOCityTown] = useState("");
  const [HOStartDate, setHOStartDate] = useState("");
  const [HOEndDate, setHOEndDate] = useState("");
  const [HOIsCurrentlyEmployed, setHOIsCurrentlyEmployed] = useState(false);

  const DeletePopup = useMemo(
    () => () => (
      <div>
        <Dialog
          open={ShowDeleteWorkExp}
          onClose={() => setShowDeleteWorkExp(false)}
        >
          <DialogTitle>
            Record will be deleted. Click Delete to continue.
          </DialogTitle>
          <Grid container>
            <Grid item sm={11} className="ml-3">
              <Work />
              {" ".concat(
                new Date() > SelectedWorkExp.EndDate ? "" : "Former ",
                SelectedWorkExp.Position,
                " at ",
                SelectedWorkExp.CompanyName,
                " ",
                SelectedWorkExp.CityTown ? SelectedWorkExp.CityTown : ""
              )}
              <div className="ml-5">
                <small>
                  {" ".concat(
                    SelectedWorkExp.Description
                      ? SelectedWorkExp.Description
                      : ""
                  )}
                </small>
              </div>
              <div className="ml-5">
                <small>
                  {" ".concat(
                    SelectedWorkExp.StartDate
                      ? SelectedWorkExp.StartDate.substring(0, 10)
                      : "",
                    " To ",
                    SelectedWorkExp.IsCurrentlyEmployed
                      ? "  present"
                      : SelectedWorkExp.EndDate
                      ? SelectedWorkExp.EndDate.substring(0, 10)
                      : ""
                  )}
                </small>
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
                onClick={() => DeleteWorkExpServer(SelectedWorkExp)}
                className="mr-1"
              >
                Delete
              </Button>
              <Button
                variant="contained"
                color="default"
                id="btnDeleteCancel"
                onClick={() => setShowDeleteWorkExp(false)}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Dialog>
      </div>
    ),
    [ShowDeleteWorkExp]
  );

  useEffect(() => {
    getWorkExpData();
  }, [PersonWorkExp.Count]);

  function GetSelectedWorkExp(WorkExpId) {
    const i = PersonWorkExp.findIndex((e) => e.WorkExpId === WorkExpId);
    setSelectedWorkExp(PersonWorkExp[i]);
  }

  function getWorkExpData() {
    Axios.get("gWorkExp", {
      params: {
        PersonId: props.personid,
      },
    })
      .then((e) => {
        if (e.status === 200) {
          setPersonWorkExp(e.data);
        }
      })
      .catch((e) => {
        ShowMessage({
          MsgTitle: "Problem Encountered",
          MsgDetail:
            "Error in loading Work Experience.  Please contact your administrator",
          MsgSeverity: "warning",
        });
      });
  }

  function DeleteWorkExpServer(WorkExpItem) {
    setOnProcess(true);
    Axios.post("dexp", WorkExpItem)
      .then((r) => {
        if (r.status === 200) {
          getWorkExpData();
          setShowDeleteWorkExp(false);
          setOnProcess(false);
          ShowMessage({
            MsgTitle: "Record Deleted",
            MsgDetail: "Work Experience successfully deleted.",
            MsgSeverity: "info",
          });
        }
      })
      .catch((e) => {
        setOnProcess(false);
        ShowMessage({
          MsgTitle: "Problem Encountered",
          MsgDetail:
            "Error in deleting Work Experience.  Please contact your system administrator.",
          MsgSeverity: "warning",
        });
      });
  }

  function AddWorkExpServer() {
    setOnProcess(true);
    const WorkExpItem = {
      PersonId: props.personid,
      WorkExpId: 0,
      Position: HOPosition,
      CompanyName: HOCompany,
      Description: HODescription,
      CityTown: HOCityTown,
      StartDate: HOStartDate,
      EndDate: HOEndDate.length > 0 ? HOEndDate : null,
      IsCurrentlyEmployed: HOIsCurrentlyEmployed,
      ContactPersonName: "",
      ContactPersonMobileNo: "",
      LastUpdate: new Date(),
      EntryDate: new Date(),
      Person: null,
    };

    Axios.post("aexp", WorkExpItem)
      .then((e) => {
        if (e.status === 200) {
          getWorkExpData();
          setOnProcess(false);
          ResetValues();
          setShowAddWorkExp(false);
          ShowMessage({
            MsgTitle: "Record Saved",
            MsgDetail: "Work Experience successfully added.",
            MsgSeverity: "info",
          });
        }
      })
      .catch((e) => {
        setOnProcess(false);
        ShowMessage({
          MsgTitle: "Problem Encountered",
          MsgDetail:
            "Error in saving record.  Please contact your system administrator.",
          MsgSeverity: "info",
        });
      });
  }

  function UpdateWorkExpServer() {
    setOnProcess(true);
    const WorkExpItem = {
      PersonId: props.personid,
      WorkExpId: SelectedWorkExp.WorkExpId,
      Position: HOPosition,
      CompanyName: HOCompany,
      Description: HODescription,
      CityTown: HOCityTown,
      StartDate: HOStartDate,
      EndDate: HOEndDate.length > 0 ? HOEndDate : null,
      IsCurrentlyEmployed: HOIsCurrentlyEmployed,
      ContactPersonName: "",
      ContactPersonMobileNo: "",
      LastUpdate: new Date(),
      EntryDate: new Date(),
      Person: null,
    };
    Axios.post("uexp", WorkExpItem)
      .then((e) => {
        if (e.status === 200) {
          getWorkExpData();
          setShowEditWorkExp(false);
          setOnProcess(false);
          ShowMessage({
            MsgTitle: "Record Updated",
            MsgDetail: "Work Experience successfully updated.",
            MsgSeverity: "info",
          });
        }
      })
      .catch((e) => {
        ShowMessage({
          MsgTitle: "Problem Encountered",
          MsgDetail:
            "Error in updating Work Experience.  Please contact your system administrator.",
          MsgSeverity: "warning",
        });
      });
  }

  function ResetValues() {
    setSelectedWorkExp(null);
    setHOPosition("");
    setHOCompany("");
    setHODescription("");
    setHOStartDate("");
    setHOEndDate("");
    setHOCityTown("");
    setHOIsCurrentlyEmployed(false);
  }

  return (
    <div className="mt-4">
      {/* Pop-up for Delete */}
      <DeletePopup />

      {/* Background Process */}
      <BackgroundProcessCom
        open={OnProcess}
        onClose={() => setOnProcess(false)}
      />

      <Grid container>
        <Grid item sm={11}>
          <Typography variant="h6">Work Experience</Typography>
          <hr style={{ margin: 0 }} />
        </Grid>
        <Grid item sm={1}>
          {props.AllowEdit ? (
            <Tooltip title="Add Work Experience">
              <IconButton
                onClick={() => {
                  ResetValues();
                  setShowAddWorkExp(true);
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
      {ShowAddWorkExp ? (
        <div>
          <Grid container spacing={2}>
            <Grid item>
              <Typography variant="subtitle2">Position</Typography>
              <TextField
                id="txtAddPosition"
                value={HOPosition}
                onChange={(e) => setHOPosition(e.target.value)}
                autoFocus
              />
            </Grid>
            <Grid item>
              <Typography variant="subtitle2">Company</Typography>
              <TextField
                id="txtAddCompany"
                value={HOCompany}
                onChange={(e) => setHOCompany(e.target.value)}
              />
            </Grid>
            <Grid item>
              <Typography variant="subtitle2">City/Town</Typography>
              <TextField
                id="txtAddCityTown"
                value={HOCityTown}
                onChange={(e) => setHOCityTown(e.target.value)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item className="mt-4">
              <Typography variant="subtitle2">
                <Checkbox
                  checked={HOIsCurrentlyEmployed}
                  onChange={(e) => setHOIsCurrentlyEmployed(e.target.checked)}
                  color="primary"
                />
                I currently work here
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item>
              <Typography variant="subtitle2">Start Date</Typography>
              <TextField
                id="dteAddStartDate"
                type="date"
                value={HOStartDate}
                onChange={(e) => setHOStartDate(e.target.value)}
              />
            </Grid>
            <Grid item>
              {HOIsCurrentlyEmployed ? (
                <Typography variant="subtitle2">to present</Typography>
              ) : (
                <div>
                  <Typography variant="subtitle2">End Date</Typography>
                  <TextField
                    id="dteEndStartDate"
                    type="date"
                    value={HOEndDate}
                    onChange={(e) => setHOEndDate(e.target.value)}
                  />
                </div>
              )}
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item sm={11} className="mt-4">
              <Typography variant="subtitle2">Description</Typography>
              <TextField
                id="txtDescription"
                value={HODescription}
                onChange={(e) => setHODescription(e.target.value)}
                multiline
                rows={4}
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item sm={11} className="mb-3">
              <hr />
              <Button
                id="btnAddSaveWorkExp"
                disableElevation
                onClick={() => AddWorkExpServer()}
                color="primary"
                variant="contained"
                style={{ marginRight: 2 }}
              >
                Save
              </Button>
              <Button
                id="btnAddCancelWorkExp"
                disableElevation
                onClick={() => setShowAddWorkExp(false)}
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

      {PersonWorkExp.map((e) =>
        ShowEditWorkExp && SelectedWorkExp.WorkExpId == e.WorkExpId ? (
          //Edit Mode
          <div key={e.WorkExpId} className="mt-3">
            <Grid container>
              <Grid item sm={11}>
                <hr />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item>
                <Typography variant="subtitle2">Position</Typography>
                <TextField
                  id="txtAddPosition"
                  value={HOPosition}
                  onChange={(e) => setHOPosition(e.target.value)}
                  autoFocus
                />
              </Grid>
              <Grid item>
                <Typography variant="subtitle2">Company</Typography>
                <TextField
                  id="txtAddCompany"
                  value={HOCompany}
                  onChange={(e) => setHOCompany(e.target.value)}
                />
              </Grid>
              <Grid item>
                <Typography variant="subtitle2">City/Town</Typography>
                <TextField
                  id="txtAddCityTown"
                  value={HOCityTown}
                  onChange={(e) => setHOCityTown(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item className="mt-3">
                <Typography variant="subtitle2">
                  <Checkbox
                    checked={HOIsCurrentlyEmployed}
                    onChange={(e) => setHOIsCurrentlyEmployed(e.target.checked)}
                    color="primary"
                  />
                  I currently work here
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item>
                <Typography variant="subtitle2">Start Date</Typography>
                <TextField
                  id="dteAddStartDate"
                  type="date"
                  value={HOStartDate}
                  onChange={(e) => setHOStartDate(e.target.value)}
                />
              </Grid>
              <Grid item>
                {HOIsCurrentlyEmployed ? (
                  <Typography variant="subtitle2">to present</Typography>
                ) : (
                  <div>
                    <Typography variant="subtitle2">End Date</Typography>
                    <TextField
                      id="dteEndStartDate"
                      type="date"
                      value={HOEndDate}
                      onChange={(e) => setHOEndDate(e.target.value)}
                    />
                  </div>
                )}
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item sm={11} className="mt-4">
                <Typography variant="subtitle2">Description</Typography>
                <TextField
                  id="txtDescription"
                  value={HODescription}
                  onChange={(e) => setHODescription(e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item sm={11} className="mb-3">
                <hr />
                <Button
                  id="btnEditSaveWorkExp"
                  disableElevation
                  onClick={() => UpdateWorkExpServer()}
                  color="primary"
                  variant="contained"
                  style={{ marginRight: 2 }}
                >
                  Save
                </Button>
                <Button
                  id="btnEditCancelWorkExp"
                  disableElevation
                  onClick={() => setShowEditWorkExp(false)}
                  color="secondary"
                  variant="contained"
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </div>
        ) : (
          //View Mode
          <Grid container key={e.WorkExpId}>
            <Grid item sm={10}>
              <div>
                <Work />
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
                      e.StartDate ? e.StartDate.substring(0, 10) : "",
                      " To ",
                      e.IsCurrentlyEmployed
                        ? "  present"
                        : e.EndDate
                        ? e.EndDate.substring(0, 10)
                        : ""
                    )}
                  </small>
                </div>
              </div>
            </Grid>
            <Grid item sm={2}>
              {props.AllowEdit ? (
                <div className="d-inline ml-4">
                  <IconButton
                    // Set values
                    onClick={() => {
                      setShowEditWorkExp(true);
                      GetSelectedWorkExp(e.WorkExpId);

                      //Assign values
                      setHOPosition(e.Position);
                      setHOCompany(e.CompanyName);
                      setHOCityTown(e.CityTown);
                      setHODescription(e.Description);
                      setHOStartDate(e.StartDate.substring(0, 10));
                      setHOEndDate(e.EndDate ? e.EndDate.substring(0, 10) : "");
                      setHOIsCurrentlyEmployed(e.IsCurrentlyEmployed);
                    }}
                  >
                    <Edit />
                  </IconButton>

                  <IconButton
                    onClick={() => {
                      GetSelectedWorkExp(e.WorkExpId);
                      setShowDeleteWorkExp(true);
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
        )
      )}
    </div>
  );
}
