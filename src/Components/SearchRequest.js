import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import {
  Grid,
  Button,
  Paper,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  Typography,
  TextField,
  IconButton,
} from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
import BackgroundProc from "./BackgroundProcess";
import HOAStyle from "../Css/Hoa.module.css";
import BlankIcon from "../images/blank.png";
import MessageContext from "./MessageContext";

export default function SearchRequest(props) {
  const ShowMessage = useContext(MessageContext);
  const [OnProcess, setOnProcess] = useState(false);
  const [RequestTypeCol, setRequestTypeCol] = useState([
    {
      DateCreated: new Date(),
      Description: "",
      LastUpdate: new Date(),
      OwnersRequest: null,
      RequestTypeId: "",
    },
  ]);
  const [SelectedRequestType, setSelectedRequestType] = useState({
    DateCreated: new Date(),
    Description: "None",
    LastUpdate: new Date(),
    OwnersRequest: null,
    RequestTypeId: "None",
  });
  const [SrcReferenceNo, setSrcReferenceNo] = useState("");
  const [SrcRequestedBy, setSrcRequestedBy] = useState("");
  const [SrcSubject, setSrcSubject] = useState("");
  const [SrcDateSubmittedFrom, setSrcDateSubmittedFrom] = useState("");
  const [SrcDateSubmittedTo, setSrcDateSubmittedTo] = useState("");
  const [SrcDateReceivedFrom, setSrcDateReceivedFrom] = useState("");
  const [SrcDateReceivedTo, setSrcDateReceivedTo] = useState("");
  const [SrcDateCancelledFrom, setSrcDateCancelledFrom] = useState("");
  const [SrcDateCancelledTo, setSrcDateCancelledTo] = useState("");
  const [SrcResponseRate, setSrcResponseRate] = useState(0);
  const [SelectedSrcStatus, setSelectedSrcStatus] = useState({
    RequestStatusId: "None",
    Description: "None",
  });
  const [RequestStatusCol, setRequestStatusCol] = useState([
    {
      RequestStatusId: "None",
      Description: "None",
    },
  ]);

  useEffect(() => {
    setOnProcess(true);

    //get lookup
    Axios.get("rlookup").then((e) => {
      var requestStatus = JSON.parse(e.data.requestStatus);
      var requestType = JSON.parse(e.data.requestType);
      setRequestTypeCol(requestType);
      setRequestStatusCol(requestStatus);
    });

    setOnProcess(false);
  }, []);

  const GetSelectedRequestType = (RequestTypeId) => {
    if (RequestTypeId !== "None") {
      const i = RequestTypeCol.findIndex(
        (x) => x.RequestTypeId === RequestTypeId
      );
      setSelectedRequestType(RequestTypeCol[i]);
    } else {
      setSelectedRequestType({
        DateCreated: new Date(),
        Description: "None",
        LastUpdate: new Date(),
        OwnersRequest: null,
        RequestTypeId: "None",
      });
    }
  };

  const GetSelectedSearchStatus = (StatusId) => {
    if (StatusId !== "None") {
      const i = RequestStatusCol.findIndex(
        (x) => x.RequestStatusId === StatusId
      );
      setSelectedSrcStatus(RequestStatusCol[i]);
    } else {
      setSelectedSrcStatus({
        RequestStatusId: "None",
        Description: "None",
      });
    }
  };

  const handleReset = () => {
    setSelectedRequestType({
      DateCreated: new Date(),
      Description: "None",
      LastUpdate: new Date(),
      OwnersRequest: null,
      RequestTypeId: "None",
    });
    setSrcReferenceNo("");
    setSrcRequestedBy("");
    setSrcSubject("");
    setSrcDateSubmittedFrom("");
    setSrcDateSubmittedTo("");
    setSrcDateReceivedFrom("");
    setSrcDateReceivedTo("");
    setSrcDateCancelledFrom("");
    setSrcDateCancelledTo("");
    setSrcResponseRate(0);
    setSelectedSrcStatus({
      RequestStatusId: "None",
      Description: "None",
    });
  };

  const handleSearchRequest = () => {
    setOnProcess(true);
    const data = new FormData();
    data.append("referenceNo", SrcReferenceNo);
    data.append("requestedBy", SrcRequestedBy);
    data.append("subject", SrcSubject);
    data.append("dateSubmittedFrom", SrcDateSubmittedFrom);
    data.append("dateSubmittedTo", SrcDateSubmittedTo);
    data.append("dateReceivedFrom", SrcDateReceivedFrom);
    data.append("dateReceivedTo", SrcDateReceivedTo);
    data.append("dateCancelledFrom", SrcDateCancelledFrom);
    data.append("dateCancelledTo", SrcDateCancelledTo);
    data.append("statusId", SelectedSrcStatus.RequestStatusId);
    data.append("requestTypeId", SelectedRequestType.RequestTypeId);
    data.append("responseRate", SrcResponseRate);
    data.append("ownersId", 0);

    Axios.post("hr", data)
      .then((e) => {
        props.UpdateListRequest(e.data);
        props.onClose();
        setOnProcess(false);
      })
      .catch((e) => {
        setOnProcess(false);
        ShowMessage({
          MsgTitle: "Problem Encountered",
          MsgDetail:
            "Problem in Searching Request.  Please contact your system administrator",
          MsgSeverity: "warning",
        });
      });
  };

  return (
    <div>
      <BackgroundProc open={OnProcess} onClose={() => setOnProcess(false)} />

      <Dialog
        open={props.open}
        onClose={() => props.onClose()}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Filter Request</DialogTitle>
        <div className="p-4">
          <Grid container>
            <Grid item sm={12}>
              <div>
                <Typography variant="subtitle2">Request Type</Typography>
                <Select
                  id="selectRequestType"
                  value={SelectedRequestType.RequestTypeId}
                  onChange={(e) => GetSelectedRequestType(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="None" key="None">
                    None
                  </MenuItem>
                  {RequestTypeCol.map((e) => (
                    <MenuItem value={e.RequestTypeId} key={e.RequestTypeId}>
                      {e.Description}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              <div className="mt-3">
                <Typography variant="subtitle2">Status</Typography>
                <Select
                  id="selectSrcStatus"
                  value={SelectedSrcStatus.RequestStatusId}
                  onChange={(e) => GetSelectedSearchStatus(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="None" key="None">
                    None
                  </MenuItem>
                  {RequestStatusCol.map((e) => (
                    <MenuItem value={e.RequestStatusId} key={e.RequestStatusId}>
                      {e.Description}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              <div className="mt-3">
                <TextField
                  label="Reference No"
                  id="txtSrcReferenceNo"
                  value={SrcReferenceNo}
                  onChange={(e) => setSrcReferenceNo(e.target.value)}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => setSrcReferenceNo("")}>
                        <Clear />
                      </IconButton>
                    ),
                  }}
                />
              </div>

              <div className="mt-3">
                <TextField
                  id="txtSrcSubject"
                  label="Subject"
                  value={SrcSubject}
                  onChange={(e) => setSrcSubject(e.target.value)}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => setSrcSubject("")}>
                        <Clear />
                      </IconButton>
                    ),
                  }}
                />
              </div>

              <div className="mt-3">
                <TextField
                  id="txtSrcRequestedBy"
                  label="Requested By"
                  value={SrcRequestedBy}
                  onChange={(e) => setSrcRequestedBy(e.target.value)}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => setSrcRequestedBy("")}>
                        <Clear />
                      </IconButton>
                    ),
                  }}
                />
              </div>

              <div className="mt-3">
                <Typography variant="subtitle2">Date Submitted</Typography>
                <div
                  className={HOAStyle.Inline}
                  style={{ paddingLeft: "20px" }}
                >
                  <Typography variant="subtitle2">From</Typography>
                  <TextField
                    id="txtSrcDateSubmittedFrom"
                    value={SrcDateSubmittedFrom}
                    onChange={(e) => setSrcDateSubmittedFrom(e.target.value)}
                    type="date"
                    InputProps={{
                      endAdornment: (
                        <IconButton disabled>
                          <img
                            src={BlankIcon}
                            style={{ height: "24px", width: "1px" }}
                          />
                        </IconButton>
                      ),
                    }}
                  />
                </div>
                <div
                  className={HOAStyle.Inline}
                  style={{ paddingLeft: "20px" }}
                >
                  <Typography variant="subtitle2">To</Typography>
                  <TextField
                    id="txtSrcDateSubmittedTo"
                    value={SrcDateSubmittedTo}
                    onChange={(e) => setSrcDateSubmittedTo(e.target.value)}
                    type="date"
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => {
                            setSrcDateSubmittedFrom("");
                            setSrcDateSubmittedTo("");
                          }}
                        >
                          <Clear />
                        </IconButton>
                      ),
                    }}
                  />
                </div>
              </div>

              <div className="mt-3">
                <Typography variant="subtitle2">Date Received</Typography>
                <div
                  className={HOAStyle.Inline}
                  style={{ paddingLeft: "20px" }}
                >
                  <Typography variant="subtitle2">From</Typography>
                  <TextField
                    id="txtSrcDateReceivedFrom"
                    value={SrcDateReceivedFrom}
                    onChange={(e) => setSrcDateReceivedFrom(e.target.value)}
                    type="date"
                    InputProps={{
                      endAdornment: (
                        <IconButton disabled>
                          <img
                            src={BlankIcon}
                            style={{ height: "24px", width: "1px" }}
                          />
                        </IconButton>
                      ),
                    }}
                  />
                </div>
                <div
                  className={HOAStyle.Inline}
                  style={{ paddingLeft: "20px" }}
                >
                  <Typography variant="subtitle2">To</Typography>
                  <TextField
                    id="txtSrcDateReceivedTo"
                    value={SrcDateReceivedTo}
                    onChange={(e) => setSrcDateReceivedTo(e.target.value)}
                    type="date"
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => {
                            setSrcDateReceivedFrom("");
                            setSrcDateReceivedTo("");
                          }}
                        >
                          <Clear />
                        </IconButton>
                      ),
                    }}
                  />
                </div>
              </div>

              <div className="mt-3">
                <Typography variant="subtitle2">Date Cancelled</Typography>
                <div
                  className={HOAStyle.Inline}
                  style={{ paddingLeft: "20px" }}
                >
                  <Typography variant="subtitle2">From</Typography>
                  <TextField
                    id="txtSrcDateReceivedFrom"
                    value={SrcDateCancelledFrom}
                    onChange={(e) => setSrcDateCancelledFrom(e.target.value)}
                    type="date"
                    InputProps={{
                      endAdornment: (
                        <IconButton disabled>
                          <img
                            src={BlankIcon}
                            style={{ height: "24px", width: "1px" }}
                          />
                        </IconButton>
                      ),
                    }}
                  />
                </div>
                <div
                  className={HOAStyle.Inline}
                  style={{ paddingLeft: "20px" }}
                >
                  <Typography variant="subtitle2">To</Typography>
                  <TextField
                    id="txtSrcDateReceivedTo"
                    value={SrcDateCancelledTo}
                    onChange={(e) => setSrcDateCancelledTo(e.target.value)}
                    type="date"
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => {
                            setSrcDateCancelledFrom("");
                            setSrcDateCancelledTo("");
                          }}
                        >
                          <Clear />
                        </IconButton>
                      ),
                    }}
                  />
                </div>
              </div>

              <div className="mt-3">
                <Typography variant="subtitle2">Rating</Typography>
                <Rating
                  id="SrcRating"
                  name="SrcRating"
                  value={SrcResponseRate}
                  onChange={(e) =>
                    SrcResponseRate === 1
                      ? setSrcResponseRate(0)
                      : setSrcResponseRate(parseInt(e.target.value))
                  }
                />
              </div>
              <hr />
            </Grid>
          </Grid>

          <Grid container>
            <Grid item sm={6} align="left">
              <Button
                variant="contained"
                color="default"
                onClick={() => handleReset()}
              >
                Reset
              </Button>
            </Grid>

            <Grid item sm={6} align="right">
              <div className={HOAStyle.Inline}>
                <Button
                  variant="contained"
                  color="primary"
                  className="mr-1"
                  onClick={() => handleSearchRequest()}
                >
                  Search
                </Button>
              </div>
              <div className={HOAStyle.Inline}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => props.onClose()}
                >
                  Cancel
                </Button>
              </div>
            </Grid>
          </Grid>
        </div>
      </Dialog>
    </div>
  );
}
