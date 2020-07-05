import React, { useState, useEffect, useRef, useContext } from "react";
import Axios from "axios";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  Grid,
  Typography,
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
import BackGroundProcess from "./BackgroundProcess";
import HOAStyle from "../Css/Hoa.module.css";
import MessageContext from "./MessageContext";

export default function NewRequest(props) {
  const ShowMessage = useContext(MessageContext);

  const [Description, setDescription] = useState("");
  const [Subject, setSubject] = useState("");
  const [SelectedRequestType, setSelectedRequestType] = useState({
    DateCreated: new Date(),
    Description: "",
    LastUpdate: new Date(),
    OwnersRequest: null,
    RequestTypeId: "",
  });
  const [OnProcess, setOnProcess] = useState(false);
  const [ReferenceNo, setReferenceNo] = useState(props.ReferenceNo);
  const [FileUploadCol, setFileUploadCol] = useState([]);
  const fileUpload = useRef();
  const [RequestTypeCol, setRequestTypeCol] = useState([
    {
      DateCreated: new Date(),
      Description: "",
      LastUpdate: new Date(),
      OwnersRequest: null,
      RequestTypeId: "",
    },
  ]);

  const handleSubmit = () => {
    if (
      Description.length > 0 &&
      Subject.length > 0 &&
      SelectedRequestType.Description.length > 0
    ) {
      setOnProcess(true);
      const data = new FormData();
      data.append("ReferenceNo", ReferenceNo);
      data.append("RequestByPersonID", props.loginInfo.PersonId);
      data.append("Description", Description);
      data.append("Subject", Subject);
      data.append("RequestTypeId", SelectedRequestType.RequestTypeId);
      //append all files
      for (var i = 0; i <= fileUpload.current.files.length - 1; ++i) {
        data.append("UploadedFiles", fileUpload.current.files[i]);
      }

      Axios.post("sr", data)
        .then((e) => {
          if (e.status === 200) {
            setOnProcess(false);
            props.onClose();

            //Add new array to the first row of the RequestMain grid
            props.UpdateRequestData(e.data[0]);

            ShowMessage({
              MsgTitle: "Request Submitted",
              MsgDetail: "You request was successfully submitted to HOA Admin.",
              MsgSeverity: "info",
            });
          }
        })
        .catch((e) => {
          setOnProcess(false);
          ShowMessage({
            MsgTitle: "Problem Encountered",
            MsgDetail:
              "Problem in submitting request.  Please contact your system administrator",
            MsgSeverity: "warning",
          });
        });
    } else {
      ShowMessage({
        MsgTitle: "Incomplete Entries",
        MsgDetail: "Please complete your request entries",
        MsgSeverity: "warning",
      });
    }
  };

  const handleReferenceNo = () => {
    setReferenceNo(props.ReferenceNo);
    setDescription("");
  };

  useEffect(() => {
    handleReferenceNo();
    setFileUploadCol([]);
    setSubject("");

    //Get Request list
    Axios.get("rt").then((e) => {
      setRequestTypeCol(e.data);
    });
  }, [props.ReferenceNo]);

  const handleFileChange = () => {
    for (var i = 0; i <= fileUpload.current.files.length - 1; ++i) {
      const fReader = new FileReader();

      //onloadend is asyncronous function , this will call after the image loaded, the function handleFileChange already done before this callback function start, it means the for loop
      //also done and we cannot use the variable i because the value is always the last value
      fReader.onloadend = () => {
        FileUploadCol.push({
          fileName: "File(".concat(FileUploadCol.length + 1, ") Dan"),
          base64: fReader.result,
        });
        setFileUploadCol([]);
        setFileUploadCol((prevValue) => [...prevValue, ...FileUploadCol]);
      };

      fReader.readAsDataURL(fileUpload.current.files[i]);
    }
  };

  const handleDelete = (fileName) => {
    const i = FileUploadCol.findIndex((x) => x.fileName === fileName);
    FileUploadCol.splice(i, 1);
    setFileUploadCol([]);
    setFileUploadCol((prevValue) => [...prevValue, ...FileUploadCol]);
  };

  const getSelectedRequestType = (RequestTypeId) => {
    const i = RequestTypeCol.findIndex(
      (x) => x.RequestTypeId === RequestTypeId
    );
    setSelectedRequestType(RequestTypeCol[i]);
  };

  return (
    <Dialog open={props.open} onClose={() => props.onClose()} fullWidth>
      <BackGroundProcess open={OnProcess} onClose={() => setOnProcess(false)} />
      <DialogTitle>New Request</DialogTitle>

      {/* <div>{props.loginInfo.FirstName}</div> */}
      <div className="m-4">
        <Grid container>
          <Grid item sm={12}>
            <div>
              <div className={HOAStyle.Inline}>
                <Typography variant="subtitle2">Reference No.</Typography>
              </div>
              <div className={HOAStyle.Inline}>
                <Typography variant="subtitle1">{ReferenceNo}</Typography>
              </div>
            </div>

            <div>
              <Typography variant="subtitle2">Request Type</Typography>
              <Select
                id="selectRequestType"
                value={SelectedRequestType.RequestTypeId}
                onChange={(e) => getSelectedRequestType(e.target.value)}
                fullWidth
              >
                {RequestTypeCol.map((e) => (
                  <MenuItem value={e.RequestTypeId} key={e.RequestTypeId}>
                    {e.Description}
                  </MenuItem>
                ))}
              </Select>
            </div>

            <div className="mt-2">
              {/* <Typography variant="subtitle2">Subject</Typography> */}
              <TextField
                id="txtSubject"
                label="Subject"
                value={Subject}
                onChange={(e) => setSubject(e.target.value)}
                fullWidth
                // variant="outlined"
                autoFocus
              />
            </div>
            <div className="mt-2">
              <Typography variant="subtitle2">Description</Typography>
              <TextField
                value={Description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={10}
                fullWidth
                variant="outlined"
              />
            </div>

            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                ref={fileUpload}
                style={{ display: "none" }}
                multiple
                onChange={() => handleFileChange()}
              />
              <Button
                id="btnAttachImg"
                variant="contained"
                onClick={() => fileUpload.current.click()}
                className="mb-3"
              >
                Attach Images
              </Button>

              <GridList
                cellHeight={160}
                cols={3}
                className={
                  FileUploadCol.length > 0 ? HOAStyle.RequestGrdList : ""
                }
              >
                {FileUploadCol.map((e) => (
                  <GridListTile cols={3} key={e.fileName}>
                    <img alt="" src={e.base64} />
                    <GridListTileBar
                      title={e.fileName}
                      subtitle={"for upload"}
                      actionIcon={
                        <Tooltip title={"Remove Image"}>
                          <IconButton
                            onClick={() => handleDelete(e.fileName)}
                            color="secondary"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      }
                    />
                  </GridListTile>
                ))}
              </GridList>
            </div>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item sm={12} align="right">
            <hr />
            <div>
              <div className={HOAStyle.Inline}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSubmit()}
                >
                  Submit
                </Button>
              </div>
              <div className={HOAStyle.Inline}>
                <Button
                  variant="contained"
                  color="secondary"
                  className="ml-2"
                  onClick={() => props.onClose()}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </Dialog>
  );
}
