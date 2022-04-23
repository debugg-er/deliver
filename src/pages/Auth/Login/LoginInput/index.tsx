import React, { useState } from "react";
import { SvgIconComponent } from "@mui/icons-material";

import "./LoginInput.css";

interface LoginInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  Icon: SvgIconComponent;
  label?: string;
  error?: string;
  disableMarginBottom?: boolean;
}

function LoginInput({
  Icon,
  label,
  error,
  className,
  onFocus,
  onBlur,
  disableMarginBottom = false,
  ...inputAttributes
}: LoginInputProps) {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <div
      className={"LoginInput " + (isFocus ? "focus " : "blur ") + (className || "")}
      style={{ "--margin-bottom": disableMarginBottom ? "0" : "12px" } as any}
    >
      <label>
        {label && (
          <div className={"LoginInput__Label " + (error ? "error" : "")}>
            {error && "*"}
            {error || label}
          </div>
        )}
        <div className="LoginInput__Input">
          <Icon className="LoginInput__Input-Icon" />

          <input
            className={"LoginInput__Input-Text " + (className || "")}
            onFocus={(e) => {
              setIsFocus(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocus(false);
              onBlur?.(e);
            }}
            {...inputAttributes}
          />
        </div>
        <div className="LoginInput__Slider"></div>
      </label>
    </div>
  );
}

export default LoginInput;
