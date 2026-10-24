import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { TextField, type TextFieldProps } from "./TextField";

export interface PasswordFieldProps extends Omit<TextFieldProps, "type" | "endIcon"> {
  /** Nhãn trợ năng khi bấm hiện mật khẩu */
  showPasswordLabel?: string;
  /** Nhãn trợ năng khi bấm ẩn mật khẩu */
  hidePasswordLabel?: string;
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    {
      showPasswordLabel = "Hiện mật khẩu",
      hidePasswordLabel = "Ẩn mật khẩu",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const toggleButton = (
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm p-1 transition-colors"
        aria-label={showPassword ? hidePasswordLabel : showPasswordLabel}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    );

    return (
      <TextField
        ref={ref}
        type={showPassword ? "text" : "password"}
        endIcon={toggleButton}
        {...props}
      />
    );
  }
);

PasswordField.displayName = "PasswordField";
