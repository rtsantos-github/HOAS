import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import axios from "axios";
import config from "react-global-configuration";
import settings from "./Config/ConfigSettings";

config.set(settings);
const apiURL =
  window.location.hostname === "localhost"
    ? config.get("APIUrlDev")
    : config.get("APIUrlProd"); //get the configuration settings

axios.defaults.baseURL = apiURL; //this will apply as a default url for all axios call

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

//How to Deploy project in Git-Hub
//1. Install gh-pages =    npm install gh-pages --save-dev
//2. Create new repository in git-hub,  browse this url given you already login. =    https://github.com/new
//3. Initialized git, in terminal run = git init
//4. Add remote origin to project, in terminal run this command =  git remote add origin https://github.com/rtsantos-github/hoas.git
//5. In package.json, add home page before dependencies entry = "homepage": "http://rsantos-github.github.io/hoas"
//6. In package.json, add predeploy and deploy under Scripts =  "predeploy": "npm run build",
//  "deploy": "gh-pages -d build"
//7. In terminal run = npm run deploy

//additional requirements
//setup your email and user name in terminal type the following
//git config --global user.email "roldantsantos@gmail.com"
//git config --global user.name "rtsantos-github"

//How to commit in github
//1. git add .
//2. git commit -m "your comment"
