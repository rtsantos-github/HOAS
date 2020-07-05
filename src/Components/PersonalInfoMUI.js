import React, { useState, useEffect, useMemo, useRef, useContext } from "react";
import {
  Grid,
  Paper,
  Typography,
  Avatar,
  Container,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  Divider,
  IconButton,
  Button,
  Tooltip,
  TextField,
  Select,
  MenuItem,
} from "@material-ui/core";

import jsPDF from "jspdf";

import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@material-ui/lab";

import { makeStyles } from "@material-ui/core/styles";
import { blue, grey } from "@material-ui/core/colors";
import { Clear, Edit, Print } from "@material-ui/icons";

import Axios from "axios";
import profilePic from "../images/ProfilePic.png";
import EducBackgroundCom from "./EducationalBackgroundMUI";
import WorkExperienceCom from "./WorkExperienceMUI";
import BackgroundProcess from "./BackgroundProcess";
import MessageContext from "./MessageContext";

export default function PersonalInfo(props) {
  const ShowMessage = useContext(MessageContext);
  const ProfilePicRef = useRef();
  const [onProcess, setonProcess] = useState(false);
  const colorBlue = blue[800];

  const colorWhite = grey[50];
  const useStyles = makeStyles((themes) => ({
    Paper: {
      padding: themes.spacing(2),
      width: 300,
    },

    Typography: {
      paddingLeft: themes.spacing(2),
      paddingRight: themes.spacing(2),
    },

    profilePic: {
      height: themes.spacing(15),
      width: themes.spacing(15),
    },
  }));

  const PageStyle = useStyles();

  const [HOId, setHOId] = useState(0);
  const [HOFirstName, setHOFirstName] = useState("");
  const [HOMiddleName, setHOMiddleName] = useState("");
  const [HOLastName, setHOLastName] = useState("");
  const [HOBirthdate, setHOBirthdate] = useState("");
  const [HOImagePath, setHOImagePath] = useState("");
  const [HOEmail, setHOEmail] = useState("");
  const [HOMobileNo, setHOMobileNo] = useState("");
  const [HOAboutMe, setHOAboutMe] = useState("");
  const [HOGender, setHOGender] = useState([]);
  const [ShowAboutMeEdit, setShowAboutMeEdit] = useState(false);
  const [ShowBasicContactEdit, setShowBasicContactEdit] = useState(false);
  const [GenderCol, setGenderCol] = useState([]);
  const [HOUploadPhoto, setHOUploadPhoto] = useState(false);
  const [DialOpen, setDialOpen] = useState(false);

  const EducationalBackgroundCom = useMemo(
    () => (
      <MessageContext.Provider value={(e) => ShowMessage(e)}>
        <EducBackgroundCom personid={HOId} AllowEdit={props.AllowEdit} />
      </MessageContext.Provider>
    ),
    [HOId]
  );

  const WorkExpCom = useMemo(
    () => (
      <MessageContext.Provider value={(e) => ShowMessage(e)}>
        <WorkExperienceCom personid={HOId} AllowEdit={props.AllowEdit} />
      </MessageContext.Provider>
    ),
    [HOId]
  );

  useEffect(() => {
    setHOId(props.PInfo.PersonId);
    setHOFirstName(props.PInfo.FirstName);
    setHOMiddleName(props.PInfo.MiddleName);
    setHOLastName(props.PInfo.LastName);
    setHOImagePath(props.PInfo.ImagePath);
    setHOMobileNo(props.PInfo.MobileNo);
    setHOGender(props.PInfo.Gender !== null ? props.PInfo.Gender : []);
    setHOBirthdate(props.PInfo.Birthdate !== null ? props.PInfo.Birthdate : "");
    setHOEmail(props.PInfo.Email);
    setHOAboutMe(props.PInfo.AboutMe !== null ? props.PInfo.AboutMe : "");

    Axios.get("g").then((e) => {
      if (e.status === 200) {
        setGenderCol(e.data);
      }
    });
  }, [props.PInfo.FirstName]);

  const updateBasicContactInfo = () => {
    setonProcess(true);

    const data = new FormData();
    data.append("GenderId", HOGender.GenderId);
    data.append("PersonId", props.PInfo.PersonId);
    data.append("LastName", HOLastName);
    data.append("FirstName", HOFirstName);
    data.append("MiddleName", HOMiddleName);
    data.append("Birthdate", HOBirthdate);
    data.append("MobileNo", HOMobileNo);
    data.append("Email", HOEmail);

    Axios.post("sv", data)
      .then((e) => {
        if (e.status === 200) {
          props.UpdatePInfo(e.data);
          setShowBasicContactEdit(false);
          setonProcess(false);
          ShowMessage({
            MsgTitle: "Record Saved.",
            MsgDetail: "Record successfully saved.",
            MsgSeverity: "info",
          });
        }
      })
      .catch((e) => {
        setonProcess(false);
        ShowMessage({
          MsgTitle: "Connection Error CONTEXT",
          MsgDetail:
            "There is a problem in connecting to the server.  Please contact your system administrator",
          MsgSeverity: "warning",
        });
      });
  };

  const UpdateAboutMe = () => {
    setonProcess(true);
    const data = new FormData();
    data.append("PersonId", props.PInfo.PersonId);
    data.append("AboutMe", HOAboutMe);

    Axios.post("uab", data)
      .then((e) => {
        if (e.status === 200) {
          setShowAboutMeEdit(false);
          props.UpdatePInfo(e.data);
          setonProcess(false);
          ShowMessage({
            MsgTitle: "Record Saved.",
            MsgDetail: "Record successfully saved.",
            MsgSeverity: "info",
          });
        }
      })
      .catch((e) => {
        setonProcess(false);
        ShowMessage({
          MsgTitle: "Connection Error CONTEXT ITO",
          MsgDetail:
            "There is a problem in connecting to the server.  Please contact your system administrator",
          MsgSeverity: "warning",
        });
      });
  };

  const GetSelectedGender = (GenderId) => {
    const i = GenderCol.findIndex((e) => e.GenderId == GenderId);
    setHOGender(GenderCol[i]);
  };

  const TagFocus = (eName) => {
    window.location.hash = eName;
  };

  const GetBase64 = () => {
    const file = ProfilePicRef.current.files[0];
    const fileReader = new FileReader();

    fileReader.onloadend = () => {
      setHOImagePath(fileReader.result); //Display image that currently uploading but not yet saved
      setHOUploadPhoto(true);
    };
    fileReader.readAsDataURL(file);
  };

  const UploadPhoto = () => {
    setonProcess(true);
    const file = ProfilePicRef.current.files[0];
    const data = new FormData();
    data.append("PersonId", HOId);
    data.append("profilePicfile", file);
    Axios.post("uppic", data).then((e) => {
      if (e.status === 200) {
        const p = {
          GenderId: HOGender.GenderId,
          PersonId: props.PInfo.PersonId,
          LastName: props.PInfo.LastName,
          FirstName: props.PInfo.FirstName,
          MiddleName: props.PInfo.MiddleName,
          Birthdate: HOBirthdate,
          MobileNo: HOMobileNo,
          AboutMe: HOAboutMe,
          Email: HOEmail,
          Password: props.PInfo.Password,
          AboutMe: HOAboutMe,
          ImagePath: e.data, //from server update
          LastUpdate: new Date(),
          DateTime: new Date(),

          Gender: HOGender,
          EducationalBackground: props.Workexp,
          WorkExperience: null,
        };

        props.UpdatePInfo(p);
        setHOUploadPhoto(false);
        setonProcess(false);
      }
    });
  };

  const HandleExportToPDF = () => {
    const doc = new jsPDF("portrait", "pt", "legal"); //orientation, unit of measurement, paper size
    doc.fromHTML("<div><h1>Test</h1> </div>");
    doc.addPage();
    doc.fromHTML("<div> Second Page </div>");
    doc.save("File.pdf");
  };

  return (
    <div>
      <Dialog
        id="PersonInfoDiag"
        onClose={() => props.onClose()}
        open={props.open}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle id="PersonInfoDiagTitle">
          <BackgroundProcess
            open={onProcess}
            onClose={() => setonProcess(false)}
          />
          <Grid container>
            <Grid item sm={2}>
              <Typography variant="h6"> Personal Information</Typography>
            </Grid>
            <Grid item sm={10} align="right">
              <IconButton
                onClick={() => props.onClose()}
                style={{ paddingTop: 5, paddingLeft: 20, paddingRight: 20 }}
              >
                <Clear />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>

        {/* Header Image and Name */}

        <Grid
          container
          style={{ margin: 0, padding: 0, backgroundColor: colorBlue }}
        >
          <Grid
            item
            // align="center" //I put this code because Grid item cannot recognized the align center in style
          >
            <Grid container justify="center">
              <Grid item>
                <div style={{ marginTop: 30, border: "none" }}>
                  <Tooltip title="Change your photo">
                    <IconButton onClick={() => ProfilePicRef.current.click()}>
                      <Avatar
                        alt=""
                        src={HOImagePath !== null ? HOImagePath : profilePic}
                        className={PageStyle.profilePic}
                      />
                      <input
                        id="changeprofilepic"
                        type="file"
                        style={{ display: "none" }}
                        ref={ProfilePicRef}
                        accept="image/*"
                        onChange={(e) => GetBase64()}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
                {HOUploadPhoto ? (
                  <div>
                    {props.AllowEdit ? (
                      <Button
                        id="btnSavePhoto"
                        color="default"
                        onClick={() => UploadPhoto()}
                        variant="contained"
                      >
                        Save Changes
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}
              </Grid>
              <Grid item className="d-lg-none" align="left">
                <div style={{ marginTop: 50, border: "none" }}>
                  <Typography variant="h5" color="inherit">
                    Hi! I'm
                  </Typography>
                  <Typography variant="h4" color="initial">
                    {HOFirstName.concat(" ", HOMiddleName, " ", HOLastName)}
                  </Typography>
                </div>
              </Grid>
            </Grid>

            <List
              id="lstAbout"
              style={{ color: colorWhite }}
              className="d-none d-lg-block"
            >
              <ListItem divider={true}></ListItem>
              <ListItem button onClick={() => TagFocus("#divAboutMe")}>
                ABOUT ME
              </ListItem>
              <ListItem button onClick={() => TagFocus("#divBasic")}>
                BASIC INFO AND CONTACT
              </ListItem>
              <ListItem button onClick={() => TagFocus("#divEduc")}>
                EDUCATIONAL BACKGROUND
              </ListItem>
              <ListItem button onClick={() => TagFocus("#divWorkExp")}>
                WORK EXPERIENCE
              </ListItem>
            </List>
          </Grid>

          {/* Body */}
          <Grid
            item
            sm={9}
            style={{ marginBottom: 50, backgroundColor: colorWhite }}
          >
            <Paper elevation={3} style={{ padding: 20 }}>
              <div className="d-none d-lg-block">
                <Grid container>
                  <Grid item sm={11}>
                    <Typography variant="h5" color="textPrimary">
                      Hi! I'm
                    </Typography>
                    <Typography variant="h4" color="initial">
                      {HOFirstName.concat(" ", HOMiddleName, " ", HOLastName)}
                    </Typography>

                    <hr />
                  </Grid>
                  <Grid item sm={1}>
                    <SpeedDial
                      ariaLabel="options"
                      open={DialOpen}
                      onOpen={() => setDialOpen(true)}
                      onClose={() => setDialOpen(false)}
                      icon={<SpeedDialIcon openIcon={<Edit />} />}
                      direction="down"
                      style={{ position: "absolute" }}
                    >
                      <SpeedDialAction
                        key="1"
                        tooltipTitle="Print to PDF"
                        icon={<Print />}
                        onClick={() => HandleExportToPDF()}
                      />
                    </SpeedDial>
                  </Grid>
                </Grid>
              </div>

              {/* About Me ------------------------------------------------------------*/}

              <Grid id="divAboutMe" container>
                <Grid item sm={11}>
                  <Typography variant="h6">About Me</Typography>
                </Grid>
                <Grid item sm={1}>
                  {props.AllowEdit ? (
                    <Tooltip title="Edit About Me">
                      <IconButton
                        onClick={() => setShowAboutMeEdit(true)}
                        style={{ paddingTop: 5 }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>

              <Grid container style={{ paddingBottom: 20 }}>
                <Grid item sm={11}>
                  {!ShowAboutMeEdit ? (
                    //View Mode
                    <div>
                      <Typography
                        variant="subtitle1"
                        style={{ paddingBottom: 20 }}
                      >
                        {HOAboutMe}
                      </Typography>
                    </div>
                  ) : (
                    //Edit Mode
                    <div>
                      <div style={{ paddingBottom: 20 }}>
                        <TextField
                          label=""
                          fullWidth
                          multiline
                          rows={5}
                          value={HOAboutMe}
                          onChange={(e) => setHOAboutMe(e.target.value)}
                        />
                      </div>
                      <div>
                        <Button
                          variant="contained"
                          disableElevation
                          color="primary"
                          style={{ marginRight: 2 }}
                          onClick={() => UpdateAboutMe()}
                        >
                          Save
                        </Button>
                        <Button
                          variant="contained"
                          disableElevation
                          color="secondary"
                          onClick={() => setShowAboutMeEdit(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </Grid>
              </Grid>

              {/*Basic Info and Contact  --------------------------------------------------------*/}

              <Grid id="divBasic" container>
                <Grid item sm={11}>
                  <Typography variant="h6">Basic Info and Contact</Typography>
                  <hr style={{ margin: 0 }} />
                </Grid>
                <Grid item sm={1}>
                  {props.AllowEdit ? (
                    <Tooltip title="Edit Basic Info and Contact">
                      <IconButton
                        onClick={() => setShowBasicContactEdit(true)}
                        style={{ paddingTop: 5 }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>

              <Grid container style={{ paddingBottom: 20 }}>
                <Grid item sm={12}>
                  {!ShowBasicContactEdit ? (
                    //View Mode
                    <div>
                      <div style={{ paddingBottom: 10 }}>
                        <Grid container spacing={2}>
                          <Grid item sm={3}>
                            <Typography variant="subtitle2">
                              First Name
                            </Typography>
                            <Typography variant="subtitle1">
                              {HOFirstName}
                            </Typography>
                          </Grid>
                          <Grid item sm={3}>
                            <Typography variant="subtitle2">
                              Middle Name
                            </Typography>
                            <Typography variant="subtitle1">
                              {HOMiddleName}
                            </Typography>
                          </Grid>
                          <Grid item sm={3}>
                            <Typography variant="subtitle2">
                              Last Name
                            </Typography>
                            <Typography variant="subtitle1">
                              {HOLastName}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container spacing={2} style={{ paddingTop: 10 }}>
                          <Grid item sm={3}>
                            <Typography variant="subtitle2">
                              Birthdate:
                            </Typography>
                            <Typography variant="subtitle1">
                              {HOBirthdate ? HOBirthdate.substring(0, 10) : ""}
                            </Typography>
                          </Grid>
                          <Grid item sm={3}>
                            <Typography variant="subtitle2">Email:</Typography>
                            <Typography variant="subtitle1">
                              {HOEmail}
                            </Typography>
                          </Grid>
                          <Grid item sm={3}>
                            <Typography variant="subtitle2">
                              Mobile No
                            </Typography>
                            <Typography variant="subtitle1">
                              {HOMobileNo}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container spacing={2} style={{ paddingTop: 10 }}>
                          <Grid item sm={3}>
                            <Typography variant="subtitle2">Gender:</Typography>
                            <Typography variant="subtitle1">
                              {HOGender ? HOGender.Description : ""}
                            </Typography>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  ) : (
                    //Edit Mode
                    <div>
                      <div style={{ paddingBottom: 20 }}>
                        <Grid container spacing={2}>
                          <Grid item>
                            <Typography variant="subtitle2">
                              First Name
                            </Typography>
                            <TextField
                              id="txtFirstName"
                              value={HOFirstName}
                              onChange={(e) => setHOFirstName(e.target.value)}
                            />
                          </Grid>
                          <Grid item>
                            <Typography variant="subtitle2">
                              Middle Name
                            </Typography>
                            <TextField
                              id="txtMiddleName"
                              value={HOMiddleName}
                              onChange={(e) => setHOMiddleName(e.target.value)}
                            />
                          </Grid>
                          <Grid item>
                            <Typography variant="subtitle2">
                              Last Name
                            </Typography>
                            <TextField
                              id="txtLastName"
                              value={HOLastName}
                              onChange={(e) => setHOLastName(e.target.value)}
                            />
                          </Grid>
                        </Grid>

                        <Grid container spacing={2} style={{ paddingTop: 20 }}>
                          <Grid item>
                            <Typography variant="subtitle2">
                              Birthdate:
                            </Typography>
                            <TextField
                              id="dtHOBirthdate"
                              value={
                                HOBirthdate ? HOBirthdate.substring(0, 10) : ""
                              }
                              onChange={(e) => setHOBirthdate(e.target.value)}
                              type="date"
                            />
                          </Grid>
                          <Grid item>
                            <Typography variant="subtitle2">Email:</Typography>
                            <TextField
                              id="txtEmail"
                              value={HOEmail ? HOEmail : ""}
                              onChange={(e) => setHOEmail(e.target.value)}
                            />
                          </Grid>
                          <Grid item>
                            <Typography variant="subtitle2">
                              Mobile No
                            </Typography>
                            <TextField
                              id="txtMobileNo"
                              value={HOMobileNo}
                              onChange={(e) => setHOMobileNo(e.target.value)}
                            />
                          </Grid>
                        </Grid>

                        <Grid container spacing={2} style={{ paddingTop: 20 }}>
                          <Grid item>
                            <Typography variant="subtitle2">Gender:</Typography>
                            <Select
                              value={HOGender.GenderId ? HOGender.GenderId : ""}
                              onChange={(e) =>
                                GetSelectedGender(e.target.value)
                              }
                            >
                              {GenderCol.map((e) => (
                                <MenuItem key={e.GenderId} value={e.GenderId}>
                                  {e.Description}
                                </MenuItem>
                              ))}
                            </Select>
                          </Grid>
                        </Grid>
                      </div>

                      <hr />
                      <Button
                        variant="contained"
                        disableElevation
                        color="primary"
                        style={{ marginRight: 2 }}
                        onClick={() => updateBasicContactInfo()}
                      >
                        Save
                      </Button>
                      <Button
                        variant="contained"
                        disableElevation
                        color="secondary"
                        onClick={() => setShowBasicContactEdit(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </Grid>
              </Grid>

              {/* Educational Background */}
              <div id="divEduc">{EducationalBackgroundCom}</div>

              {/* Work Experience */}
              <div id="divWorkExp">{WorkExpCom}</div>
            </Paper>
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
}
