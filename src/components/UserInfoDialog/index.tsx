import React, { useMemo, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";

import Abc from "@mui/icons-material/Abc";
import Person from "@mui/icons-material/Person";
import AlternateEmail from "@mui/icons-material/AlternateEmail";
import CameraAlt from "@mui/icons-material/CameraAlt";

import { IUser } from "@interfaces/User";
import { Avt } from "@components/Avatar";
import { useAuth } from "@contexts/AuthContext";
import { usePushMessage } from "@contexts/MessageQueueContext";
import userApi from "@api/userApi";

import LoginInput from "@pages/Auth/Login/LoginInput";
import Dialog, { DialogProps } from "@components/Dialog";

import "./UserInfoDialog.css";
import AvatarCropper from "./AvatarCropper";
import fileApi from "@api/fileApi";

interface UserInfoDialogProps extends Omit<DialogProps, "title"> {
  user: IUser;
}

let updateInfoSchema = Yup.object({
  email: Yup.string().email("E-mail không hợp lệ"),
  lastName: Yup.string().required("Tên không được để trống"),
});

function UserInfoDialog({ user, ...dialogProps }: UserInfoDialogProps) {
  const [avatar, setAvatar] = useState<null | File>(null);
  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);
  const { user: me } = useAuth();

  const croppedAvatarUrl = useMemo(
    () => (croppedAvatar ? URL.createObjectURL(croppedAvatar) : undefined),
    [croppedAvatar]
  );

  const pushMesasge = usePushMessage();

  const form = useFormik({
    initialValues: {
      firstName: user.firstName || "",
      lastName: user.lastName,
      email: user.email,
    },
    validationSchema: updateInfoSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        let avatar: string | undefined;
        if (croppedAvatar) {
          const res = await fileApi.postBlobFile(croppedAvatar);
          avatar = res[0].id;
        }
        await userApi.updateMyInfo({ ...values, avatar });
        pushMesasge("Đã cập nhật thông tin");
        dialogProps.onClose?.();
        window.location.reload();
      } catch {
        pushMesasge("Cập nhật thông tin không thành công", "error");
      }
    },
  });

  async function handleUploadAvatar(blob: Blob) {
    setCroppedAvatar(blob);
  }

  const isMe = me?.username === user.username;
  const isChanged =
    user.firstName !== form.values.firstName ||
    user.lastName !== form.values.lastName ||
    user.email !== form.values.email ||
    croppedAvatar !== null;
  return (
    <Dialog className="UserInfoDialog" title="Thông tin" width={400} {...dialogProps}>
      <div className="UserInfoDialog__Avatar">
        {croppedAvatarUrl ? (
          <img
            src={croppedAvatarUrl}
            width={80}
            height={80}
            alt=""
            style={{ borderRadius: "50%" }}
          />
        ) : (
          <Avt user={user} style={{ width: 80, height: 80 }} />
        )}

        {isMe && (
          <label>
            <CameraAlt className="UserInfoDialog__Avatar-Camera" />
            <input
              type="file"
              hidden
              accept="image/jpeg,image/png"
              onChange={(e) => {
                setAvatar(e.currentTarget.files?.[0] || null);
                e.currentTarget.files = null;
              }}
            />
          </label>
        )}
      </div>

      <div className="UserInfoDialog__Inputs">
        <LoginInput
          Icon={Person}
          label="Username"
          placeholder="username"
          disabled
          value={user.username}
          style={{ background: "var(--main-background-2)" }}
        />

        <div className="UserInfoDialog__Inputs-name">
          <LoginInput
            Icon={Abc}
            label="Họ"
            placeholder="họ"
            name="firstName"
            error={form.errors.firstName}
            value={form.values.firstName}
            onChange={form.handleChange}
            disableMarginBottom
            disabled={!isMe}
            style={{ background: "var(--main-background-2)" }}
          />
          <LoginInput
            Icon={Abc}
            label="Tên"
            placeholder="tên"
            name="lastName"
            error={form.errors.lastName}
            value={form.values.lastName}
            onChange={form.handleChange}
            disableMarginBottom
            disabled={!isMe}
            style={{ background: "var(--main-background-2)" }}
          />
        </div>
        <div className="UserInfoDialog__Inputs-Note">
          {isMe ? "Sử dụng tên thật để bạn bè dễ nhận diện hơn" : ""}
        </div>

        <LoginInput
          Icon={AlternateEmail}
          label="E-mail"
          placeholder="email"
          name="email"
          error={form.errors.email}
          value={form.values.email}
          onChange={form.handleChange}
          disabled={!isMe}
          style={{ background: "var(--main-background-2)" }}
        />
      </div>

      <div className="UserInfoDialog__Buttons">
        {isMe && (
          <>
            <div
              className="Global__BlueButton"
              onClick={isChanged ? () => form.handleSubmit({} as any) : undefined}
            >
              {isChanged ? "Cập nhật" : "Đồng ý"}
            </div>
            <div className="Global__Button" onClick={dialogProps.onClose}>
              Hủy
            </div>
          </>
        )}
        {!isMe && (
          <div className="Global__BlueButton" onClick={dialogProps.onClose}>
            Xác nhận
          </div>
        )}
      </div>

      {avatar && (
        <AvatarCropper
          open={!!avatar}
          onClose={() => setAvatar(null)}
          file={avatar}
          onCrop={handleUploadAvatar}
        />
      )}
    </Dialog>
  );
}

export default UserInfoDialog;
