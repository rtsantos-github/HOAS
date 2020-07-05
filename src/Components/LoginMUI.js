import React, { useState, useContext } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  IconButton,
  Paper,
} from "@material-ui/core";
import { Copyright, Visibility, Email } from "@material-ui/icons";
import BackgroundProcess from "../Components/BackgroundProcess";
import HOAStyle from "../Css/Hoa.module.css";

import { NavLink } from "react-router-dom";
import SideLogo from "../images/MommyDaddy.png";
//import Logo from "../images/EmployeeLogo.png";
import HOALogo from "../images/Logo.png";
import axios from "axios";
import MessageContext from "./MessageContext";

export default function LoginMUI(props) {
  const [HOEmail, setHOEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ShowProcess, setShowProcess] = useState(false);
  const [ShowPwd, setShowPwd] = useState(false);
  const ShowMessage = useContext(MessageContext); //Asssign Context as a Function

  const VerifyLogin = () => {
    setShowProcess(true);
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (HOEmail.match(mailFormat)) {
      const data = new FormData();
      data.append("Email", HOEmail);
      data.append("Password", Password);
      axios
        .post("vu", data)
        .then((e) => {
          //Invalid Login Info
          //204 No Content
          if (e.status === 204) {
            setShowProcess(false);

            ShowMessage({
              MsgTitle: "Invalid Email or Password!",
              MsgDetail:
                "Please make sure you provide the correct login information.",
              MsgSeverity: "warning",
            });
          }
          //Successfully login
          else {
            setShowProcess(false);
            props.RedirectToCom({
              page: "HOME",
              loginInfo: {
                PersonId: e.data.personId,
                LastName: e.data.lastName,
                FirstName: e.data.firstName,
                MiddleName: e.data.middleName,
                Email: e.data.email,
                MobileNo: e.data.mobileNo,
              },
            });
          }
        })
        .catch((e) => {
          setShowProcess(false);
          ShowMessage({
            MsgTitle: "Connection Problem",
            MsgDetail:
              "There is a problem in connecting to the server.  Please contact your system administrator",
            MsgSeverity: "warning",
          });
        });
    } else {
      setShowProcess(false);

      ShowMessage({
        MsgTitle: "Invalid Email Format",
        MsgDetail: "Please enter you registered email address.",
        MsgSeverity: "warning",
      });
    }
  };

  const ToForgotPW = () => {
    props.RedirectToCom({
      page: "FORGOTPW",
      loginInfo: {
        PersonId: 0,
        LastName: "",
        FirstName: "",
        MiddleName: "",
        Email: "",
        MobileNo: "",
      },
    });
  };

  return (
    <Container>
      {/* Show Background Process */}
      <BackgroundProcess
        open={ShowProcess}
        onClose={() => setShowProcess(false)}
      />

      <Paper elevation={3} className={HOAStyle.Container}>
        <Grid container>
          <Grid item sm={6}>
            <img src={SideLogo} className={HOAStyle.LoginSideLogo} />
          </Grid>
          <Grid item sm={5} className="m-5">
            <img src={HOALogo} className={HOAStyle.HOALogo} />

            <TextField
              id="txtEmail"
              label="Email"
              type="Email"
              value={HOEmail}
              onChange={(e) => setHOEmail(e.target.value)}
              onKeyPress={(e) => (e.key === "Enter" ? VerifyLogin() : "")}
              fullWidth
              InputProps={{
                endAdornment: (
                  <IconButton disabled>
                    <Email />
                  </IconButton>
                ),
              }}
              //   autoFocus
            />

            <TextField
              id="txtPassword"
              label="Password"
              type={ShowPwd ? "text" : "Password"}
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => (e.key === "Enter" ? VerifyLogin() : "")}
              fullWidth
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPwd(!ShowPwd)}>
                    <Visibility />
                  </IconButton>
                ),
              }}
            />
            <div className="text-right mt-3">
              <a href="#" className="mr-3" onClick={() => ToForgotPW()}>
                Forgot Password?
              </a>
              <Button variant="contained" onClick={() => VerifyLogin()}>
                Login
              </Button>
            </div>

            <div className={HOAStyle.AlrightReserve}>
              <div className={HOAStyle.Inline}>
                <small>COPYRIGHT</small>
              </div>
              <div className={HOAStyle.Inline}>
                <Copyright />
              </div>
              <div className={HOAStyle.Inline}>
                <small>Homeowners Association System</small>
              </div>
              <div>
                <p>Introduction COPYRIGHT 2020 Roldan T. Santos</p>
              </div>
              <div>
                <small>All rights reserved.</small>
              </div>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

// function GetValue(props) {
//   const [value, setValue] = useState(props);
//   return { value, onChange: (e) => setValue(e.target.value) };
// }
