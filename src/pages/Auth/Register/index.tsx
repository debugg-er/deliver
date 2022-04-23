import React from "react";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import LockReset from "@mui/icons-material/LockReset";
import Abc from "@mui/icons-material/Abc";
import AlternateEmail from "@mui/icons-material/AlternateEmail";

import accountApi from "@api/accountApi";
import { useSetLoading } from "@contexts/LoadingContext";

import LoginInput from "../Login/LoginInput";

import "./Register.css";

let registerSchema = Yup.object({
  username: Yup.string()
    .required("Không được để trống")
    .min(5, "Tên đăng nhập phải có ít nhất 5 kí tự")
    .max(32, "Tên đăng nhập không có quá 32 kí tự"),
  password: Yup.string()
    .required("Không được để trống")
    .min(5, "Mật khẩu phải có ít nhất 5 kí tự")
    .max(32, "Mật khẩu không có quá 32 kí tự"),
  repassword: Yup.string().oneOf([Yup.ref("password"), null], "Mật khẩu nhập lại không chính xác"),
  email: Yup.string().email("E-mail không hợp lệ"),
});

function Register() {
  const setLoading = useSetLoading();

  const form = useFormik({
    initialValues: {
      username: "",
      password: "",
      repassword: "",
      firstName: "",
      lastName: "",
      email: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setErrors }) => {
      values.firstName = values.firstName.trim().replace(/\s+/, " ");
      values.lastName = values.lastName.trim().replace(/\s+/, " ");
      const data = Object.assign(values, { female: false });
      try {
        setLoading(true);
        const response = await accountApi.register(data);
        window.localStorage.setItem("token", response.token);
        window.location.href = "/messages";
      } catch (e) {
        const message = (e as any).data.message;
        if (message === "username is already taken") {
          setErrors({ username: "Tên đăng nhập đã có người sử dụng" });
          return;
        }
        alert("Internal server error");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form className="Register" onSubmit={form.handleSubmit}>
      <LoginInput
        type="text"
        name="username"
        Icon={PersonOutlined}
        label="username"
        placeholder="Tên đăng nhập"
        error={form.errors.username}
        value={form.values.username}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />
      <LoginInput
        type="password"
        name="password"
        Icon={LockOutlined}
        label="password"
        placeholder="Mật khẩu"
        error={form.errors.password}
        value={form.values.password}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />
      <LoginInput
        type="password"
        name="repassword"
        Icon={LockReset}
        label="confirm password"
        placeholder="Xác nhận mật khẩu"
        error={form.errors.repassword}
        value={form.values.repassword}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />
      <LoginInput
        type="text"
        name="firstName"
        Icon={Abc}
        label="first name"
        placeholder="Họ"
        error={form.errors.firstName}
        value={form.values.firstName}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />
      <LoginInput
        type="text"
        name="lastName"
        Icon={Abc}
        label="last name"
        placeholder="Tên"
        error={form.errors.lastName}
        value={form.values.lastName}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />
      <LoginInput
        type="text"
        name="email"
        Icon={AlternateEmail}
        label="e-mail"
        placeholder="E-mail"
        error={form.errors.email}
        value={form.values.email}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />

      <input className="Auth--SubmitButton" type="submit" value="REGISTER" />

      <div style={{ flexGrow: 1 }}></div>

      <Link className="Auth--SmallText Login__SignUpButton" to="/auth/login">
        SIGN IN
      </Link>
    </form>
  );
}

export default Register;
