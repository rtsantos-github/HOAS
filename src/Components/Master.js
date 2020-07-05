import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  Drawer,
  Paper,
  Grid,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Badge,
  Tab,
  Tabs,
  TextField,
  Button,
  Link,
  Container,
} from "@material-ui/core/";
import { Alert, AlertTitle } from "@material-ui/lab";

import { blue, red } from "@material-ui/core/colors";

import {
  People,
  ExpandLess,
  ExpandMore,
  Home,
  Streetview,
  Person,
  ChevronLeft,
  AccountCircle,
  Settings,
  ExitToApp,
  Notifications,
  ListAlt,
  Info,
} from "@material-ui/icons/";

import ListIcon from "@material-ui/icons/List";
import MenuIcon from "@material-ui/icons/Menu";
import "../Css/imgbackground.css";
import HomeCom from "./Home";
import MaintenanceCom from "./MaintenanceMUI";
import StreetCom from "./Street";
import LoginCom from "./LoginMUI";
import ForgotPWCom from "./ForgotPasswordMUI";
import RequestCom from "./RequestMain";
import AboutCom from "./About";

import HOAStyle from "../Css/Hoa.module.css";
import MessageContext from "./MessageContext";

export default function Master() {
  const [NotificationCount, setNotificationCount] = useState(5);
  const [UserName, setUserName] = useState("");
  const [LoginInfo, setLoginInfo] = useState({
    PersonId: 0,
    LastName: "",
    FirstName: "",
    MiddleName: "",
    Email: "",
    MobileNo: "",
  });
  const [MsgTitle, setMsgTitle] = useState("");
  const [MsgDetail, setMsgDetail] = useState("");
  const [MsgSeverity, setMsgSeverity] = useState("info");
  const [ShowMsg, setShowMsg] = useState(false);
  const [PageTitle, setPageTitle] = useState("LOGIN");
  const [OpenSideMenu, setOpenSideMenu] = useState(false);
  const [MaintenanceCollapse, setMaintenanceCollapse] = useState(false);
  const [anchorEl, setanchorEl] = useState(null);
  const [RequestStatus, setRequestStatus] = useState("");

  const useStyles = makeStyles((themes) => ({
    Paper: {
      padding: themes.spacing(2),
      width: 300,
    },

    ChildCollapse: {
      paddingLeft: themes.spacing(3),
    },

    BurgerMenu: {
      padding: themes.spacing(2),
    },

    Drawer: {
      width: 300,
    },

    Typography: {
      paddingLeft: themes.spacing(2),
      paddingRight: themes.spacing(1),
    },

    TextField: {
      color: "white",
    },
  }));

  const PageStyle = useStyles();
  const Menulist = (
    <div>
      <Menu
        id="userProfileMenu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setanchorEl(null)}
      >
        <MenuItem onClick={() => setanchorEl(null)}>
          <Person />
          <Typography variant="subtitle1" className={PageStyle.Typography}>
            {LoginInfo.FirstName}
          </Typography>
          <small>(View Your Profile)</small>
        </MenuItem>
        <MenuItem onClick={() => setanchorEl(null)}>
          <Settings />
          <Typography variant="subtitle1" className={PageStyle.Typography}>
            Account Settings
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            setPageTitle("LOGIN");
            ResetLoginInfo();
            setanchorEl(null);
          }}
        >
          <ExitToApp />
          <Typography variant="subtitle1" className={PageStyle.Typography}>
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </div>
  );
  const FullDrawer = (
    <Drawer
      anchor="left"
      variant="persistent"
      open={OpenSideMenu}
      onClose={() => setOpenSideMenu(false)}
      className={PageStyle.Drawer}
    >
      <IconButton onClick={() => setOpenSideMenu(false)}>
        <Typography variant="h6">HOAM</Typography>
        <ChevronLeft />
      </IconButton>
      <Divider />
      <Paper className={PageStyle.Paper}>
        <List component="nav">
          <ListItem
            button
            onClick={() => {
              setPageTitle("HOME");
              setOpenSideMenu(false);
            }}
          >
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          <ListItem
            button
            onClick={() => setMaintenanceCollapse(!MaintenanceCollapse)}
          >
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary="Maintenance" />
            {MaintenanceCollapse ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse
            in={MaintenanceCollapse}
            timeout="auto"
            unmountOnExit
            className={PageStyle.ChildCollapse}
          >
            <ListItem
              button
              onClick={() => {
                setPageTitle("OWNERS");
                setOpenSideMenu(false);
              }}
            >
              <ListItemIcon>
                <People />
              </ListItemIcon>
              <ListItemText primary="Owners" to="/list" />
            </ListItem>

            <ListItem
              button
              onClick={() => {
                setPageTitle("STREET");
                setOpenSideMenu(false);
              }}
            >
              <ListItemIcon>
                <Streetview />
              </ListItemIcon>
              <ListItemText primary="Street" />
            </ListItem>
          </Collapse>

          <ListItem
            button
            onClick={() => {
              setPageTitle("REQUEST");
              setOpenSideMenu(false);
            }}
          >
            <ListItemIcon>
              <ListAlt />
            </ListItemIcon>
            <ListItemText primary="Request" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              setPageTitle("ABOUT");
              setOpenSideMenu(false);
            }}
          >
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>
          <Divider />

          <ListItem
            button
            onClick={() => {
              setPageTitle("LOGIN");
              ResetLoginInfo();
              setOpenSideMenu(false);
            }}
          >
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Paper>
    </Drawer>
  );

  const ResetLoginInfo = () => {
    setLoginInfo({
      PersonId: 0,
      LastName: "",
      FirstName: "",
      MiddleName: "",
      Email: "",
      MobileNo: "",
    });
  };

  const RedirectToCom = (e) => {
    setPageTitle(e.page);
    setLoginInfo(e.loginInfo);
  };

  const ShowMessage = (e) => {
    setMsgTitle(e.MsgTitle);
    setMsgDetail(e.MsgDetail);
    setMsgSeverity(e.MsgSeverity);
    setShowMsg(true);

    setTimeout(() => {
      setShowMsg(false);
    }, 5000);
    clearTimeout();
  };

  return (
    <div className={HOAStyle.Home}>
      {LoginInfo.FirstName.length > 0 ? FullDrawer : ""}
      {Menulist}

      <AppBar position="relative" color="primary">
        <Toolbar>
          <Grid container>
            <Grid item sm={2} style={{ paddingTop: 10 }}>
              {LoginInfo.FirstName.length > 0 ? (
                <IconButton
                  color="inherit"
                  onClick={() => setOpenSideMenu(!OpenSideMenu)}
                >
                  {OpenSideMenu ? <ChevronLeft /> : <MenuIcon />}
                  <Typography variant="subtitle2" className="ml-2">
                    {PageTitle}
                  </Typography>
                </IconButton>
              ) : (
                ""
              )}
            </Grid>

            <Grid item sm={7}>
              {LoginInfo.FirstName.length > 0 ? (
                <div className="d-none d-lg-block">
                  <Tabs
                    value={PageTitle}
                    textColor="inherit"
                    indicatorColor="primary"
                    onChange={(e) => setPageTitle(e.currentTarget.innerText)}
                  >
                    <Tab label="Home" icon={<Home />} value={"HOME"} />
                    <Tab label="Owners" icon={<People />} value={"OWNERS"} />
                    <Tab
                      label="Street"
                      icon={<Streetview />}
                      value={"STREET"}
                    />
                    <Tab label="Request" icon={<ListAlt />} value={"REQUEST"} />
                    <Tab label="ABOUT" icon={<Info />} value={"ABOUT"} />
                    <Tab value={"LOGIN"} />
                    <Tab value={"FORGOTPW"} />
                  </Tabs>
                </div>
              ) : (
                ""
              )}
            </Grid>

            {LoginInfo.FirstName.length > 0 ? (
              <Grid item sm={3} style={{ paddingTop: 10 }} align="right">
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={(e) => setanchorEl(e.currentTarget)}
                >
                  <AccountCircle />
                  {/* This line will hide div when the screen is smaller than lg display */}
                  <div className="d-none d-lg-block">
                    <Typography
                      variant="subtitle1"
                      className={PageStyle.Typography}
                    >
                      {LoginInfo.FirstName}
                    </Typography>
                  </div>
                </IconButton>
                <IconButton>
                  <Badge badgeContent={NotificationCount} color="secondary">
                    <Notifications />
                  </Badge>
                </IconButton>
              </Grid>
            ) : (
              ""
            )}
          </Grid>
        </Toolbar>
      </AppBar>

      {/* Show Page based on clicked menu  */}
      {PageTitle === "HOME" ? (
        <HomeCom
          loginInfo={LoginInfo}
          RedirectToCom={(e) => RedirectToCom(e)}
          HORequestStatus={(e) => setRequestStatus(e)}
        />
      ) : (
        ""
      )}
      {PageTitle === "OWNERS" ? (
        <MessageContext.Provider value={(e) => ShowMessage(e)}>
          <MaintenanceCom />
        </MessageContext.Provider>
      ) : (
        ""
      )}
      {PageTitle === "REQUEST" ? (
        <MessageContext.Provider value={(e) => ShowMessage(e)}>
          <RequestCom loginInfo={LoginInfo} HORequestStatus={RequestStatus} />
        </MessageContext.Provider>
      ) : (
        ""
      )}
      {PageTitle === "STREET" ? <StreetCom /> : ""}
      {PageTitle === "ABOUT" ? <AboutCom /> : ""}
      {PageTitle === "LOGIN" ? (
        <MessageContext.Provider value={(e) => ShowMessage(e)}>
          <LoginCom RedirectToCom={(e) => RedirectToCom(e)} />
        </MessageContext.Provider>
      ) : (
        ""
      )}
      {PageTitle === "FORGOTPW" ? (
        <ForgotPWCom RedirectToCom={(e) => RedirectToCom(e)} />
      ) : (
        ""
      )}

      <div className={HOAStyle.Msg}>
        {ShowMsg ? (
          <Alert severity={MsgSeverity}>
            <AlertTitle>{MsgTitle}</AlertTitle>
            <hr />
            <Typography variant="subtitle1">{MsgDetail}</Typography>
          </Alert>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
