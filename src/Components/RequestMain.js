import React, { useState, useEffect, useMemo, useContext } from "react";
import Axios from "axios";
import {
  Grid,
  Paper,
  Button,
  TextField,
  TableContainer,
  TableHead,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Container,
  IconButton,
  Typography,
  Divider,
  Checkbox,
  Tooltip,
  Dialog,
  DialogTitle,
  Select,
  MenuItem,
} from "@material-ui/core";

import FilterListIcon from "@material-ui/icons/FilterList";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import { Subject, Message } from "@material-ui/icons";

import { Rating } from "@material-ui/lab";

import Logo from "../images/Logo.png";
import HOAStyle from "../Css/Hoa.module.css";
import BackgroundProc from "./BackgroundProcess";
import PersonInfo from "./PersonalInfoMUI";
import NewRequestCom from "./NewRequest";
import ViewRequest from "./ViewRequest";
import SearchRequestCom from "./SearchRequest";
import MessageContext from "./MessageContext";

export default function RequestMain(props) {
  const ShowMessage = useContext(MessageContext);

  const [RequestCol, setRequestCol] = useState([]);
  const [OwnersLoginID, setOwnersLoginID] = useState(0);
  const [CurrentPage, setCurrentPage] = useState(0);
  const [RowPerPage, setRowPerPage] = useState(5);
  const [Employee, setEmployee] = useState([]);
  const [OnProcess, setOnProcess] = useState(false);
  const [OpenPersonInfo, setOpenPersonInfo] = useState(false);
  const [SelectedRequestOwnersId, setSelectedRequestOwnersId] = useState(0);
  const [ShowNewRequest, setShowNewRequest] = useState(false);
  const currentMonth = new Date().getMonth() + 1;
  const [OpenViewRequest, setOpenViewRequest] = useState(false);
  const [SelectedRequest, setSelectedRequest] = useState("");
  const [ShowSearch, setShowSearch] = useState(false);

  useEffect(() => {
    handleGetOwnersRequest();
  }, []);

  const handleGetOwnersRequest = () => {
    setOnProcess(true);
    const data = new FormData();
    data.append("referenceNo", "");
    data.append("requestedBy", "");
    data.append("subject", "");
    data.append("dateSubmittedFrom", "");
    data.append("dateSubmittedTo", "");
    data.append("dateReceivedFrom", "");
    data.append("dateReceivedTo", "");
    data.append("dateCancelledFrom", "");
    data.append("dateCancelledTo", "");
    data.append(
      "statusId",
      props.HORequestStatus.length > 0 ? props.HORequestStatus : "None"
    );
    data.append("requestTypeId", "None");
    data.append("responseRate", 0);
    data.append("ownersId", OwnersLoginID);
    Axios.post("hr", data)
      .then((e) => {
        setRequestCol(e.data);
        setOnProcess(false);
      })
      .catch((e) => {
        setOnProcess(false);
        ShowMessage({
          MsgTitle: "Problem Encountered",
          MsgDetail:
            "Problem in Loading Request.  Please contact your system administrator",
          MsgSeverity: "warning",
        });
      });
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const PersonInfoCom = useMemo(
    () => (
      <MessageContext.Provider value={() => ShowMessage()}>
        <PersonInfo
          open={OpenPersonInfo}
          onClose={() => setOpenPersonInfo(false)}
          PInfo={Employee}
          AllowEdit={false}
        />
      </MessageContext.Provider>
    ),
    [OpenPersonInfo]
  );

  const GetEmployeeInfo = (PersonId) => {
    setOnProcess(true);
    Axios.get("gp", {
      params: {
        name: "",
        PersonId: PersonId,
      },
    }).then((e) => {
      setEmployee(e.data[0]);
      setOpenPersonInfo(true);
      setOnProcess(false);
    });
  };

  const UpdateSelectedItem = (requestOwnersId, checkValue) => {
    const i = RequestCol.findIndex((x) => x.OwnerRequestId === requestOwnersId);
    RequestCol[i].IsSelected = checkValue;
    setRequestCol([]); // to clear the previous value of array/  somehow I was a bit comfused
    setRequestCol((prevValue) => [...prevValue, ...RequestCol]); //use callback, the array did not apply the changes if I just call the setRequestCol(newCollection), we need to use call back to apply it
  };

  const ReceivedRequest = () => {
    const lst = JSON.stringify(RequestCol.filter((i) => i.IsSelected === true));
    if (lst.length > 2) {
      setOnProcess(true);
      const data = new FormData();
      data.append("lst", lst);
      data.append("ReceivedByPersonId", props.loginInfo.PersonId);

      Axios.post("rr", data).then((e) => {
        if (e.status === 200) {
          //Update client data
          for (var i = 0; i <= e.data.length - 1; ++i) {
            const x = RequestCol.findIndex(
              (o) => o.OwnerRequestId === e.data[i].ownerRequestId
            );
            RequestCol[x].DateReceived = e.data[i].dateReceived;
            RequestCol[x].Status = "RECEIVED";
            RequestCol[x].StatusId = e.data[i].requestCurrentStatusId;
            RequestCol[x].IsSelected = false;
          }
          setRequestCol([]); // to clear the previous value of array/  somehow I was a bit comfused
          setRequestCol((prevValue) => [...prevValue, ...RequestCol]); //use callback, the array did not apply the changes if I just call the setRequestCol(newCollection), we need to use call back to apply it
          setOnProcess(false);

          ShowMessage({
            MsgTitle: "Received",
            MsgDetail: "Request successfully received.",
            MsgSeverity: "info",
          });
        }
      });
    } else {
      ShowMessage({
        MsgTitle: "No item selected found.",
        MsgDetail: "Please check the request that you want to receive.",
        MsgSeverity: "warning",
      });
    }
  };

  const UpdateRequestData = (newData) => {
    RequestCol.unshift(newData);
    setRequestCol(RequestCol);
    setCurrentPage(0);
  };

  const GenerateReferenceNo = () => {
    return "HOR-".concat(
      currentMonth.toString(),
      new Date().getDate().toString(),
      new Date().getFullYear().toString(),
      new Date().getHours().toString(),
      new Date().getMinutes().toString(),
      new Date().getSeconds().toString(),
      "-",
      props.loginInfo.PersonId.toString()
    );
  };

  const ViewRequestCom = useMemo(
    () => (
      <ViewRequest
        open={OpenViewRequest}
        onClose={() => setOpenViewRequest(false)}
        loginInfo={props.loginInfo}
        selectedRequest={SelectedRequest}
      />
    ),
    [OpenViewRequest]
  );

  const GetSelectedRequest = (ReferenceNo) => {
    const i = RequestCol.findIndex((x) => x.OwnerRequestId == ReferenceNo);
    setSelectedRequest(RequestCol[i]);
  };

  const UpdateListRequest = (e) => {
    setRequestCol(e);
  };

  return (
    <Container className={HOAStyle.Container}>
      {/* Show background process */}
      <BackgroundProc open={OnProcess} onClose={() => setOnProcess(false)} />

      <MessageContext.Provider value={(e) => ShowMessage(e)}>
        <NewRequestCom
          open={ShowNewRequest}
          onClose={() => setShowNewRequest(false)}
          loginInfo={props.loginInfo}
          UpdateRequestData={(e) => UpdateRequestData(e)}
          ReferenceNo={GenerateReferenceNo()}
        />
      </MessageContext.Provider>

      {/* Show request */}
      {OpenViewRequest ? ViewRequestCom : ""}
      {/* Show Personal Info */}
      {OpenPersonInfo ? PersonInfoCom : ""}

      {ShowSearch ? (
        <MessageContext.Provider value={(e) => ShowMessage(e)}>
          <SearchRequestCom
            open={ShowSearch}
            onClose={() => setShowSearch(false)}
            UpdateListRequest={(e) => UpdateListRequest(e)}
          />
        </MessageContext.Provider>
      ) : (
        ""
      )}

      <Paper>
        <div className={HOAStyle.DivToPaper}>
          <Grid container>
            <Grid item>
              <img src={Logo} className={HOAStyle.HOALogoOnPage} />
            </Grid>
          </Grid>

          <Grid container>
            <Grid item sm={12} align="right">
              <Paper>
                <IconButton
                  color="primary"
                  className={HOAStyle.Inline}
                  style={{ paddingRight: 0 }}
                  onClick={() => setShowNewRequest(true)}
                >
                  <Typography variant="caption">New Request</Typography>
                  <InsertDriveFileOutlinedIcon />
                </IconButton>

                <IconButton
                  color="primary"
                  className={HOAStyle.Inline}
                  style={{ paddingRight: 0, paddingLeft: 5 }}
                  onClick={() => ReceivedRequest()}
                >
                  <Typography variant="caption">Receive Request</Typography>
                  <AssignmentTurnedInOutlinedIcon />
                </IconButton>

                <Tooltip title={"Filter Request"}>
                  <IconButton
                    color="primary"
                    className={HOAStyle.Inline}
                    onClick={() => setShowSearch(true)}
                  >
                    <FilterListIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title={"Show All Request"}>
                  <IconButton
                    color="primary"
                    className={HOAStyle.Inline}
                    onClick={() => handleGetOwnersRequest()}
                  >
                    <Subject />
                  </IconButton>
                </Tooltip>
              </Paper>
            </Grid>
          </Grid>

          {/* List of Request */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="left" style={{ width: "auto" }}>
                    Request Type
                  </TableCell>
                  <TableCell align="left" style={{ width: "auto" }}>
                    Reference No.
                  </TableCell>
                  <TableCell align="left" style={{ width: "auto" }}>
                    Requested By
                  </TableCell>
                  <TableCell align="left" style={{ width: "auto" }}>
                    Subject
                  </TableCell>
                  <TableCell align="left">Date Submitted</TableCell>
                  <TableCell align="left">Date Received</TableCell>
                  <TableCell align="left">Date Cancelled</TableCell>
                  <TableCell align="left">Status</TableCell>
                  <TableCell align="left">Response Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {RequestCol.slice(
                  CurrentPage * RowPerPage,
                  CurrentPage * RowPerPage + RowPerPage
                ).map((e) => (
                  <TableRow
                    key={e.OwnerRequestId}
                    hover
                    onClick={() => setSelectedRequestOwnersId(e.OwnerRequestId)}
                    // selected={SelectedRequestOwnersId === e.OwnerRequestId}
                  >
                    <TableCell>
                      {e.StatusId === "N" ? (
                        <Checkbox
                          color="secondary"
                          checked={e.IsSelected}
                          onChange={(c) =>
                            UpdateSelectedItem(
                              e.OwnerRequestId,
                              c.target.checked
                            )
                          }
                        />
                      ) : (
                        <Checkbox disabled />
                      )}
                    </TableCell>
                    <TableCell align="left" style={{ widht: "auto" }}>
                      <p
                        className={
                          e.RequestType.RequestTypeId === "C" &&
                          e.StatusId === "N"
                            ? HOAStyle.RequestComplain
                            : ""
                        }
                      >
                        {e.RequestType.Description}
                      </p>
                    </TableCell>
                    <TableCell align="left" style={{ width: "auto" }}>
                      <a
                        href="#"
                        onClick={() => {
                          GetSelectedRequest(e.OwnerRequestId);
                          setOpenViewRequest(true);
                        }}
                      >
                        {e.OwnerRequestId}
                      </a>
                    </TableCell>
                    <TableCell align="left" style={{ width: "auto" }}>
                      <a href="#" onClick={() => GetEmployeeInfo(e.PersonId)}>
                        {e.FirstName.concat(" ", e.MiddleName, " ", e.LastName)}
                      </a>
                    </TableCell>
                    <TableCell align="left" style={{ width: "auto" }}>
                      {e.Subject}
                    </TableCell>
                    <TableCell>{e.DateSubmitted}</TableCell>
                    <TableCell>{e.DateReceived}</TableCell>
                    <TableCell>{e.DateCancelled}</TableCell>
                    <TableCell>{e.Status}</TableCell>
                    <TableCell>
                      <Rating value={e.Rating} readOnly />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            page={CurrentPage}
            rowsPerPageOptions={[5, 10, 15]}
            rowsPerPage={RowPerPage}
            count={RequestCol.length}
            onChangeRowsPerPage={(e) => {
              setRowPerPage(e.target.value);
              setCurrentPage(0);
            }}
            onChangePage={handleChangePage}
          />
        </div>
      </Paper>
    </Container>
  );
}
