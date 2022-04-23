import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Person from "@mui/icons-material/Person";
import Password from "@mui/icons-material/Password";

import accountApi from "@api/accountApi";

import LoginInput from "../Login/LoginInput";

import "./ForgotPassword.css";
import useQuery from "@hooks/useQuery";
import { usePushMessage } from "@contexts/MessageQueueContext";

function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [usernameErr, setUsernameErr] = useState("");

  const [password, setPassword] = useState("");

  const { token } = useQuery();
  const history = useHistory();
  const pushMessage = usePushMessage();

  async function handleSendForgotPasswordRequest() {
    try {
      await accountApi.forgotPassword(username);
      pushMessage(
        "An email was sent to your email address, follow the link in that email to reset your password"
      );
    } catch {
      setUsernameErr("Tên đăng nhập không tồn tại!");
    }
  }

  async function handleResetPassword() {
    if (!token) return;
    await accountApi.resetPassword(token, password);
    pushMessage("Change password successfuly");
    history.push("/auth/login");
  }

  return (
    <form
      className="ForgotPassword"
      onSubmit={(e) => {
        e.preventDefault();
        if (token) {
          handleResetPassword();
        } else {
          handleSendForgotPasswordRequest();
        }
      }}
    >
      <div className="ForgotPassword__Inputs">
        {!token ? (
          <LoginInput
            type="text"
            Icon={Person}
            label="your username"
            placeholder="Tên đăng nhập của bạn"
            value={username}
            error={usernameErr}
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameErr("");
            }}
          />
        ) : (
          <LoginInput
            type="password"
            Icon={Password}
            label="new password"
            placeholder="Mật khẩu mới"
            value={password}
            error={usernameErr}
            onChange={(e) => {
              setPassword(e.target.value);
              setUsernameErr("");
            }}
          />
        )}
      </div>

      <input type="submit" className="Auth--SubmitButton" value={token ? "UPDATE" : "SUBMIT"} />

      <div style={{ flexGrow: 1 }}></div>

      <Link className="Auth--SmallText Login__SignUpButton" to="/auth/login">
        LOGIN
      </Link>
    </form>
  );
}

export default ForgotPassword;
