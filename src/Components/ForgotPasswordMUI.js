import React, { useState } from "react";
import { Grid, Paper, Container, TextField, Button } from "@material-ui/core";
// import { NavLink } from "react-router-dom";
import Logo from "../images/Logo.png";
import HOStyle from "../Css/Hoa.module.css";

export default function ForgotPassword(props) {
  const [Email, setEmail] = useState("");

  const BackToLogin = () => {
    return props.RedirectToCom({
      page: "LOGIN",
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
    <Container className={HOStyle.Container}>
      <Paper
        elevation={3}
        className={HOStyle.CenterContent}
        style={{ padding: "50px" }}
      >
        <Grid container>
          <Grid item sm={3}></Grid>
          <Grid item sm={6}>
            <img src={Logo} className={HOStyle.HOALogo} />
          </Grid>
          <Grid item sm={3}></Grid>
        </Grid>
        <Grid container>
          <Grid item sm={3}></Grid>
          <Grid item sm={6}>
            <TextField
              id="txtEmail"
              label="Enter Registered Email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item sm={3}></Grid>
        </Grid>
        <Grid container>
          <Grid item sm={3}></Grid>
          <Grid item sm={6} align="right" className="mt-3">
            <div className="d-inline mr-3">
              <a href="#" onClick={() => BackToLogin()}>
                Back to Login
              </a>
            </div>
            <div className="d-inline">
              <Button variant="contained" onClick={() => alert()}>
                Submit
              </Button>
            </div>
          </Grid>
          <Grid item sm={3}></Grid>
        </Grid>
        {/*         
        <Row>
          <Col sm={3} />
          <Col sm={6}>
            <h1>Forgot Password</h1>
          </Col>
          <Col sm={3} />
        </Row>
        <Row className="text-center">
          <Col sm={3} />
          <Col sm={6}>
            <Image src={Logo} height="100%" width="100%" />
          </Col>
          <Col sm={3} />
        </Row>
        <Row className="mt-2">
          <Col sm={3} />
          <Col sm={6}>
            <Form>
              <Form.Label>Enter Email</Form.Label>
              <Form.Control
                type="Email"
                placeholder="Enter Registered Email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="text-right mt-3">
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </div>
            </Form>
          </Col>
          <Col sm={3} />
        </Row> */}
      </Paper>
    </Container>
  );
}
