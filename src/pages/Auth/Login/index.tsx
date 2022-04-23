import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";

import { useAuth } from "@contexts/AuthContext";
import { useSetLoading } from "@contexts/LoadingContext";

import LoginInput from "./LoginInput";

import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameErr, setUsernameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const { login } = useAuth();
  const setLoading = useSetLoading();

  async function handleLogin(e: any) {
    try {
      e.preventDefault();
      setLoading(true);
      await login(username, password);
    } catch (e) {
      const { statusCode } = (e as any).data;
      if (statusCode === 404) {
        setUsernameErr("Tài khoản không tồn tại");
      } else {
        setPasswordErr("Mật khẩu không chính xác");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="Login" onSubmit={handleLogin}>
      <div className="Login__Inputs">
        <LoginInput
          type="text"
          Icon={PersonOutlined}
          label="username"
          placeholder="Tên đăng nhập"
          value={username}
          error={usernameErr}
          onChange={(e) => {
            setUsername(e.target.value);
            setUsernameErr("");
          }}
        />
        <LoginInput
          type="password"
          Icon={LockOutlined}
          label="password"
          placeholder="Mật khẩu"
          value={password}
          error={passwordErr}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordErr("");
          }}
        />
      </div>

      <Link className="Login__ForgotPassword Auth--SmallText" to="/auth/forgot">
        Forgot password?
      </Link>

      <input type="submit" className="Auth--SubmitButton" value="LOGIN" />

      <div className="Auth--SmallText" style={{ margin: "48px 0 12px 0" }}>
        Or Sign Up Using
      </div>
      <div className="Login__OtherMethods">
        <a href="https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?scope=email%20profile&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Faccount%2Fgoogle&client_id=14808220811-1v11kusdsbp1gu6ao7jss24d4h32hco1.apps.googleusercontent.com&flowName=GeneralOAuthFlow">
          <FaGoogle />
        </a>
      </div>

      <Link className="Auth--SmallText Login__SignUpButton" to="/auth/register">
        SIGN UP
      </Link>
    </form>
  );
}

export default Login;
