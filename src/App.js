import React, { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Master from "./Components/Master";
// import MessageContext from "./Components/MessageContext";
import Login from "./Components/LoginMUI";
import Home from "./Components/Home";

function App() {
  // const [Message, setMessage] = useState({
  //   Title: "",
  //   Details: "",
  //   Severity: "",
  //   Show: false,
  // });

  return (
    <div>
      {/* To register route */}
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Master} exact />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
