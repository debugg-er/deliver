import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";

import routes from "./pages/routes";

import Sidebar from "@components/Sidebar";

function App() {
  return (
    <div className="App">
      <div className="App__Sidebar">
        <Sidebar />
      </div>

      <div className="App__Main">
        <Switch>
          {routes.map((route, i) => (
            <Route key={i} {...route} />
          ))}
        </Switch>
      </div>
    </div>
  );
}

export default App;
