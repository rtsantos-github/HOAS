import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import {
  Grid,
  Paper,
  TextField,
  Container,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  TablePagination,
} from "@material-ui/core";

import { Clear } from "@material-ui/icons/";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import axios from "axios";
import PersonInfo from "./PersonalInfoMUI";
import profilePic from "../images/ProfilePic.png";
import BackdropCom from "./BackgroundProcess";
import HOLogo from "../images/Logo.png";
import HOAStyle from "../Css/Hoa.module.css";
import MessageContext from "./MessageContext";

export default function Maintenance() {
  const ShowMessage = useContext(MessageContext);

  const useStyles = makeStyles((themes) => ({
    ProfileImg: {
      height: 50,
      width: 50,
    },

    InfoImg: {
      height: 20,
      width: 20,
      paddingLeft: 1,
    },

    Paper: {
      padding: themes.spacing(2),
      paddingBottom: 20,
      margin: "auto",
    },

    Search: { paddingBottom: 20, paddingTop: 20, paddingRight: 20 },
    Maintenance: {
      paddingTop: 70,
    },
    IconButton: {
      padding: 0,
    },
  }));
  const PageStyle = useStyles();
  const [Employeelst, setEmployeelst] = useState([]);
  const [IsshowDetailsWin, IsIsshowDetailsWin] = useState(false);
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
    AboutMe: "",
    LastUpdate: new Date(),
    DateCreated: new Date(),

    Gender: null,
    EducationalBackground: null,
    WorkExperience: null,
  });
  const [TotalRec, setTotalRect] = useState(0);
  const [SearchName, setSearchName] = useState("");
  const [ActiveTab, setActiveTab] = useState("PInfo");
  const searchRef = useRef();
  const [onProcess, setonProcess] = useState(false);
  const [RowPerPage, setRowPerPage] = useState(6);
  const [CurrentPage, setCurrentPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowPerPage(+event.target.value);
  //   setCurrentPage(0);
  // };

  //to avoid child components from re-render
  const PersonInfoCom = useMemo(
    () => (
      <MessageContext.Provider value={(e) => ShowMessage(e)}>
        <PersonInfo
          open={IsshowDetailsWin}
          onClose={() => IsIsshowDetailsWin(false)}
          PInfo={selectedItem}
          AllowEdit={true}
          UpdatePInfo={(e) => UpdatePersonalInfoClient(e)}
        />
      </MessageContext.Provider>
    ),
    [IsshowDetailsWin]
  );

  const HOwnersTable = (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 50 }}></TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Birthdate</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Mobile Number</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Employeelst.slice(
              CurrentPage * RowPerPage,
              CurrentPage * RowPerPage + RowPerPage
            ).map((e) => (
              <TableRow key={e.PersonId}>
                <TableCell style={{ width: 50 }}>
                  <Avatar
                    alt=""
                    src={e.ImagePath ? e.ImagePath : profilePic}
                    className={PageStyle.ProfileImg}
                  />
                </TableCell>
                <TableCell>
                  <a
                    href="#"
                    onClick={() => {
                      GetRow(e.PersonId);
                      IsIsshowDetailsWin(true);
                    }}
                  >
                    {e.FirstName.concat(" ", e.MiddleName, " ", e.LastName)}
                  </a>
                </TableCell>
                <TableCell>{e.Birthdate}</TableCell>
                <TableCell>{e.Email}</TableCell>
                <TableCell>{e.MobileNo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        rowsPerPageOptions={[2, 4, 6]}
        rowsPerPage={RowPerPage}
        count={Employeelst.length}
        page={CurrentPage}
        onChangeRowsPerPage={(e) => {
          setRowPerPage(e.target.value);
          setCurrentPage(0);
        }} //{handleChangeRowsPerPage}
        onChangePage={handleChangePage}
      />
    </div>
  );

  useEffect(() => {
    setonProcess(true);
    axios
      .get("gp")
      .then((res) => {
        if (res.status === 200) {
          setEmployeelst(res.data);
          setTotalRect(res.data.length);
          setonProcess(false);
        }
      })
      .catch((e) => {
        setonProcess(false);
        ShowMessage({
          MsgTitle: "Problem Encountered",
          MsgDetail:
            "Problem in loading homeowner's list.  Please contact your system administrator",
          MsgSeverity: "warning",
        });
      });
  }, []);

  function GetRow(Id) {
    const i = Employeelst.findIndex((e) => e.PersonId === Id); //Finding record in the array
    setselectedItem(Employeelst[i]); //set the selectedItem to record founded based on index
  }

  function fnSearchName(reset) {
    if (reset) setSearchName("");

    axios
      .get("gp", {
        params: { Name: reset ? "" : SearchName },
      })
      .then((e) => {
        if (e.status === 200) {
          setEmployeelst(e.data);
          setTotalRect(e.data.length);
        }
      });
  }

  function UpdatePersonalInfoClient(p) {
    const i = Employeelst.findIndex((e) => e.PersonId === p.PersonId);
    Employeelst[i].AboutMe = p.AboutMe;
    Employeelst[i].LastName = p.LastName;
    Employeelst[i].FirstName = p.FirstName;
    Employeelst[i].MiddleName = p.MiddleName;
    Employeelst[i].GenderId = p.GenderId;
    Employeelst[i].Gender = p.Gender;
    Employeelst[i].Birthdate = p.Birthdate;
    Employeelst[i].MobileNo = p.MobileNo;
    Employeelst[i].Email = p.Email;
    Employeelst[i].ImagePath = p.ImagePath;
    setEmployeelst(Employeelst);
  }

  return (
    <Container className={HOAStyle.Container}>
      {/* Background Process */}
      <BackdropCom open={onProcess} onClose={() => setonProcess(false)} />

      {/*  Pop-up Windows */}
      {IsshowDetailsWin ? PersonInfoCom : ""}

      {/* Search */}
      <Paper>
        <div className={HOAStyle.DivToPaper}>
          <Grid container>
            <Grid item sm={8}>
              <img src={HOLogo} className={HOAStyle.HOALogoOnPage} />
            </Grid>
          </Grid>

          <Grid container>
            <Grid item sm={12} align="right">
              <Paper>
                <TextField
                  className="mb-2"
                  id="txtSearch"
                  label="Search name"
                  color="primary"
                  // variant="outlined"
                  value={SearchName}
                  onChange={(e) => {
                    setSearchName(e.target.value);
                  }}
                  onKeyPress={(e) =>
                    e.key == "Enter" ? fnSearchName(false) : ""
                  }
                  InputProps={{
                    //startAdornment: <Search style={{ color: grey[600] }} />,
                    endAdornment: (
                      <IconButton
                        onClick={() => fnSearchName(true)}
                        className={PageStyle.IconButton}
                      >
                        <Clear />
                      </IconButton>
                    ),
                  }}
                />
              </Paper>
            </Grid>
          </Grid>

          {/* List of Homeowner */}
          {HOwnersTable}
        </div>
      </Paper>
    </Container>
  );
}
