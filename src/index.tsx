import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import App from "./App";
import GlobalContexts from "./GlobalContexts";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalContexts>
        <App />
      </GlobalContexts>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
