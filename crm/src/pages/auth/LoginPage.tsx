import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLoginMutation } from "../../hooks/queries/useLoginMutation";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  TextField,
  PasswordField,
} from "../../components/ui";
import "./LoginPage.scss";

const usernameSchema = z.string().min(1, "Vui lòng nhập tên đăng nhập hoặc email");
const passwordSchema = z.string().min(1, "Vui lòng nhập mật khẩu");

const getErrorMessage = (error: unknown): string | undefined => {
  if (!error) return undefined;
  if (typeof error === "string") return error;
  if (typeof error === "object" && "message" in (error as Record<string, unknown>)) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
};

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const loginMutation = useLoginMutation();

  const [serverError, setServerError] = useState<string | null>(null);

  // Xác định trang đích nếu trước đó bị Route Guard chuyển hướng đến login
  const fromLocation = (location.state as { from?: { pathname?: string; search?: string } })?.from;
  const destination = fromLocation
    ? `${fromLocation.pathname || ""}${fromLocation.search || ""}` || "/"
    : "/";

  // Nếu người dùng đã đăng nhập từ trước, tự động chuyển hướng về trang đích
  useEffect(() => {
    if (isAuthenticated) {
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, destination]);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        await loginMutation.mutateAsync(value);
        navigate(destination, { replace: true });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : t("auth.invalidCredentials");
        setServerError(message);
      }
    },
  });

  const isSubmitting = loginMutation.isPending || form.state.isSubmitting;

  return (
    <div className="login-page" data-testid="login-page">
      <div className="login-page__container">
        <div className="login-page__brand">
          <div className="login-page__logo">
            <Sparkles className="login-page__logo-icon" />
          </div>
          <h1 className="login-page__title">Chickie Studio</h1>
          <p className="login-page__subtitle">Rental Management System</p>
        </div>

        <Card className="login-page__card">
          <CardHeader className="login-page__header">
            <CardTitle className="login-page__card-title">
              {t("auth.loginTitle")}
            </CardTitle>
            <CardDescription className="login-page__card-desc">
              {t("auth.loginSubtitle")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {serverError && (
              <div className="login-page__alert" data-testid="login-error-alert">
                <AlertCircle className="login-page__alert-icon" />
                <span>{serverError}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              noValidate
              className="login-page__form"
            >
              <form.Field
                name="username"
                validators={{
                  onChange: usernameSchema,
                  onSubmit: usernameSchema,
                }}
              >
                {(field) => {
                  const errorMessage = getErrorMessage(field.state.meta.errors[0]);

                  return (
                    <TextField
                      id="username"
                      name={field.name}
                      type="text"
                      autoComplete="username"
                      label={t("auth.usernameLabel")}
                      placeholder={t("auth.usernamePlaceholder")}
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        if (serverError) setServerError(null);
                      }}
                      onBlur={field.handleBlur}
                      error={errorMessage}
                      required
                      disabled={isSubmitting}
                    />
                  );
                }}
              </form.Field>

              <form.Field
                name="password"
                validators={{
                  onChange: passwordSchema,
                  onSubmit: passwordSchema,
                }}
              >
                {(field) => {
                  const errorMessage = getErrorMessage(field.state.meta.errors[0]);

                  return (
                    <PasswordField
                      id="password"
                      name={field.name}
                      autoComplete="current-password"
                      label={t("auth.passwordLabel")}
                      placeholder={t("auth.passwordPlaceholder")}
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        if (serverError) setServerError(null);
                      }}
                      onBlur={field.handleBlur}
                      error={errorMessage}
                      required
                      disabled={isSubmitting}
                    />
                  );
                }}
              </form.Field>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="login-page__submit-btn"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {t("auth.loginButton")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
