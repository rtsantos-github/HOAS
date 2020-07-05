import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import {
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  TextField,
  GridList,
  GridListTile,
  GridListTileBar,
  Paper,
  IconButton,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";

import BackgroundProcess from "./BackgroundProcess";
import HOAStyle from "../Css/Hoa.module.css";
import MessageContext from "./MessageContext";

export default function NewRequest(props) {
  const ShowMessage = useContext(MessageContext);
  const [ImageCol, setImageCol] = useState([]);
  const [ShowProcess, setShowProcess] = useState(false);
  const [SelectedImageUrl, setSelectedImageUrl] = useState("");

  useEffect(() => {
    setShowProcess(true);
    Axios.get("hri", {
      params: {
        OwnerId: props.selectedRequest.PersonId,
        ReferenceNo: props.selectedRequest.OwnerRequestId,
      },
    })
      .then((e) => {
        setImageCol(e.data);
        setSelectedImageUrl(e.data[0] ? e.data[0].FileNameUrl : "");
        setShowProcess(false);
      })
      .catch((e) => {
        setShowProcess(false);
        ShowMessage({
          MsgTitle: "Problem Encountered",
          MsgDetail:
            "Problem in viewing Request.  Please contact your system administrator",
          MsgSeverity: "warning",
        });
      });
  }, []);

  return (
    <div>
      <BackgroundProcess
        open={ShowProcess}
        onClose={() => setShowProcess(false)}
      />

      <Dialog
        open={props.open}
        onClose={() => props.onClose()}
        fullWidth
        maxWidth="lg"
      >
        <Grid container>
          <Grid item sm={2}>
            <DialogTitle>View Request</DialogTitle>
          </Grid>
          <Grid item sm={10} align="right">
            <IconButton onClick={() => props.onClose()}>
              <Close />
            </IconButton>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item sm={12}>
            <hr />
          </Grid>
        </Grid>
        <div className="m-4">
          <Grid container>
            <Grid item sm={4}>
              <div>
                <div className={HOAStyle.Inline}>
                  <Typography variant="subtitle2" className="mr-2">
                    Request Type
                  </Typography>
                </div>
                <div className={HOAStyle.Inline}>
                  <Typography variant="subtitle1">
                    {props.selectedRequest.RequestType.Description}
                  </Typography>
                </div>
              </div>

              <div>
                <div className={HOAStyle.Inline}>
                  <Typography variant="subtitle2" className="mr-2">
                    Requested By:
                  </Typography>
                </div>
                <div className={HOAStyle.Inline}>
                  <Typography variant="subtitle1">
                    {props.selectedRequest.FirstName.concat(
                      " ",
                      props.selectedRequest.MiddleName,
                      " ",
                      props.selectedRequest.LastName
                    )}
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item sm={4}>
              <div>
                <div className={HOAStyle.Inline}>
                  <Typography variant="subtitle2" className="mr-2">
                    Subject:
                  </Typography>
                </div>
                <div className={HOAStyle.Inline}>
                  <Typography variant="subtitle1">
                    {props.selectedRequest.Subject}
                  </Typography>
                </div>
              </div>
              <div>
                <div className={HOAStyle.Inline}>
                  <Typography variant="subtitle2" className="mr-2">
                    Date Submitted:
                  </Typography>
                </div>
                <div className={HOAStyle.Inline}>
                  <Typography variant="subtitle1">
                    {props.selectedRequest.DateSubmitted}
                  </Typography>
                </div>
              </div>
            </Grid>

            <Grid item sm={4}>
              {props.selectedRequest.DateReceived ? (
                <div>
                  <div className={HOAStyle.Inline}>
                    <Typography variant="subtitle2" className="mr-2">
                      Date Received:
                    </Typography>
                  </div>
                  <div className={HOAStyle.Inline}>
                    <Typography variant="subtitle1">
                      {props.selectedRequest.DateReceived}
                    </Typography>
                  </div>
                </div>
              ) : (
                ""
              )}
              {props.selectedRequest.DateCancelled ? (
                <div>
                  <div className={HOAStyle.Inline}>
                    <Typography variant="subtitle2" className="mr-2">
                      Date Cancelled:
                    </Typography>
                  </div>
                  <div className={HOAStyle.Inline}>
                    <Typography variant="subtitle1">
                      {props.selectedRequest.DateCancelled}
                    </Typography>
                  </div>
                </div>
              ) : (
                ""
              )}
            </Grid>
          </Grid>

          <Grid container className="mt-3">
            <Grid item sm={12}>
              <Typography variant="subtitle2">Description</Typography>
              <TextField
                value={props.selectedRequest.Description}
                multiline
                variant="outlined"
                fullWidth
              />
              <hr />
            </Grid>
          </Grid>

          {ImageCol.length > 0 ? (
            <div>
              <Typography variant="subtitle2">Attached Images</Typography>
              <Paper elevation={3} className="mt-3">
                <Grid container>
                  <Grid item sm={12} align="center">
                    <img
                      alt=""
                      src={SelectedImageUrl}
                      className={HOAStyle.ImgRequest}
                    />
                  </Grid>
                </Grid>
                <Grid container className="mt-2">
                  <Grid item sm={12} align="center">
                    <GridList
                      cellHeight={160}
                      cols={7}
                      className={HOAStyle.RequestGrdList}
                    >
                      {ImageCol.map((data) => (
                        <GridListTile key={data.FileName}>
                          <a
                            href="#"
                            onClick={() =>
                              setSelectedImageUrl(data.FileNameUrl)
                            }
                          >
                            <img alt="" src={data.FileNameUrl} />
                          </a>
                          <GridListTileBar title={data.FileName} />
                        </GridListTile>
                      ))}
                    </GridList>
                  </Grid>
                </Grid>
              </Paper>
            </div>
          ) : (
            ""
          )}
        </div>
      </Dialog>
    </div>
  );
}
