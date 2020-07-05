import React from "react";
import { Grid, Container, Paper } from "@material-ui/core/";
import Logo from "../images/Logo.png";
import HOAStyle from "../Css/Hoa.module.css";

export default function About() {
  return (
    <Container className={HOAStyle.Container}>
      <Paper elevation={3}>
        <div className={HOAStyle.DivToPaper}>
          <Grid container>
            <Grid item sm={12}>
              <img src={Logo} className={HOAStyle.HOALogo} />
            </Grid>
          </Grid>
        </div>
      </Paper>
    </Container>
  );
}
