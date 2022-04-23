import React from "react";
import { Route, Switch } from "react-router-dom";

import routes from "./pages/routes";

import Sidebar from "@components/Sidebar";
import MiniSidebar from "@components/MiniSidebar";
import PopupWrapper from "@components/PopupWrapper";
import Auth from "@pages/Auth";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/auth" component={Auth} />

        <Route
          path="/"
          component={() => (
            <>
              <div className="App__MiniSidebar">
                <MiniSidebar />
              </div>

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
            </>
          )}
        />
      </Switch>

      <PopupWrapper />
    </div>
  );
}

export default App;
