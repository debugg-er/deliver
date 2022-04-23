import React from "react";
import { Route, Switch } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";

import "./Auth.css";

function Auth() {
  const path = window.location.pathname;
  return (
    <div className="Auth">
      <div className="Auth__Background"> </div>
      <div className="Auth__Form">
        <h2 className="Auth__Header">
          {path.startsWith("/auth/login")
            ? "Login"
            : path.startsWith("/auth/register")
            ? "Register"
            : "Forgot Password"}
        </h2>
        <Switch>
          <Route path="/auth/login" component={Login} />
          <Route path="/auth/register" component={Register} />
          <Route path="/auth/forgot" component={ForgotPassword} />
        </Switch>
      </div>
    </div>
  );
}

export default Auth;
