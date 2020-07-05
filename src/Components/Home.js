import React, { useState, useEffect } from "react";
import Axios from "axios";
import {
  Grid,
  Container,
  Paper,
  Typography,
  IconButton,
} from "@material-ui/core/";
import Logo from "../images/Logo.png";
import HOAStyle from "../Css/Hoa.module.css";
import BackgroundProcess from "./BackgroundProcess";

export default function HomeComp(props) {
  const [NewRequest, setNewRequest] = useState(0);
  const [ReceivedRequest, setReceivedRequest] = useState(0);
  const [PendingRequest, setPendingRequest] = useState(0);
  const [CancelledRequest, setCancelledRequest] = useState(0);
  const [ServedRequest, setServerRequest] = useState(0);
  const [OnProcess, setOnProcess] = useState(false);

  useEffect(() => {
    setOnProcess(true);
    Axios.get("rdash")
      .then((e) => {
        const newRequest = e.data[e.data.findIndex((i) => i.StatusId === "N")];
        const receivedRequest =
          e.data[e.data.findIndex((i) => i.StatusId === "R")];
        const pendingRequest =
          e.data[e.data.findIndex((i) => i.StatusId === "P")];
        const cancelledRequest =
          e.data[e.data.findIndex((i) => i.StatusId === "C")];
        const servedRequest =
          e.data[e.data.findIndex((i) => i.StatusId === "S")];

        setNewRequest(newRequest ? newRequest.Total : 0);
        setReceivedRequest(receivedRequest ? receivedRequest.Total : 0);
        setPendingRequest(pendingRequest ? pendingRequest.Total : 0);
        setCancelledRequest(cancelledRequest ? cancelledRequest.Total : 0);
        setServerRequest(servedRequest ? servedRequest.Total : 0);
        setOnProcess(false);
      })
      .catch((e) => {
        setOnProcess(false);
      });
  }, []);

  const handleClickRequest = (RequestStatus) => {
    props.HORequestStatus(RequestStatus);
    props.RedirectToCom({
      page: "REQUEST",
      loginInfo: props.loginInfo,
    });
  };

  return (
    <Container className={HOAStyle.Container}>
      <BackgroundProcess open={OnProcess} onClose={() => setOnProcess(false)} />

      <Paper elevation={3}>
        <div className={HOAStyle.DivToPaper}>
          <Grid container className="mb-5">
            <Grid item sm={12}>
              <img src={Logo} className={HOAStyle.HOALogo} />
            </Grid>
          </Grid>
          <Grid container>
            <span className={HOAStyle.dashBoardTitle}>Homeowners Request</span>
          </Grid>
          <Grid container justify="space-evenly">
            <Grid item>
              <a href="#" onClick={() => handleClickRequest("N")}>
                <div className={HOAStyle.dashBoardNew}>
                  <span>{NewRequest}</span>
                </div>
                <div className={HOAStyle.dashBoardTileText}>
                  <span>New</span>
                </div>
              </a>
            </Grid>

            <Grid item>
              <a href="#" onClick={() => handleClickRequest("R")}>
                <div className={HOAStyle.dashBoardReceived}>
                  <span>{ReceivedRequest}</span>
                </div>
                <div className={HOAStyle.dashBoardTileText}>
                  <span>Received</span>
                </div>
              </a>
            </Grid>

            <Grid item>
              <a href="#" onClick={() => handleClickRequest("P")}>
                <div className={HOAStyle.dashBoardPending}>
                  <span>{PendingRequest}</span>
                </div>
                <div className={HOAStyle.dashBoardTileText}>
                  <span>Pending</span>
                </div>
              </a>
            </Grid>

            <Grid item>
              <a href="#" onClick={() => handleClickRequest("C")}>
                <div className={HOAStyle.dashBoardCancelled}>
                  <span>{CancelledRequest}</span>
                </div>
                <div className={HOAStyle.dashBoardTileText}>
                  <span>Cancelled</span>
                </div>
              </a>
            </Grid>

            <Grid item>
              <a href="#" onClick={() => handleClickRequest("S")}>
                <div className={HOAStyle.dashBoardServed}>
                  <span>{ServedRequest}</span>
                </div>
                <div className={HOAStyle.dashBoardTileText}>
                  <span>Served</span>
                </div>
              </a>
            </Grid>
          </Grid>
        </div>
      </Paper>
    </Container>
  );
}
