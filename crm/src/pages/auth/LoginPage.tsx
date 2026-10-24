import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Sparkles, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { FormField } from "../../components/common/FormField";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import "./LoginPage.scss";

const loginSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tên đăng nhập hoặc email"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof LoginFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await login(result.data);
      navigate("/", { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("auth.invalidCredentials");
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page" data-testid="login-page">
      <div className="login-page__container">
        <div className="login-page__brand">
          <div className="login-page__logo">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-burgundy">Chickie Studio</h1>
          <p className="text-xs uppercase tracking-wider text-champagne-gold font-medium mt-1">
            Rental Management System
          </p>
        </div>

        <Card className="login-page__card">
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-serif text-xl font-semibold text-ink">
              {t("auth.loginTitle")}
            </CardTitle>
            <p className="text-sm text-ink-muted mt-1">{t("auth.loginSubtitle")}</p>
          </CardHeader>

          <CardContent>
            {serverError && (
              <div className="login-page__alert" data-testid="login-error-alert">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <FormField
                label={t("auth.usernameLabel")}
                error={errors.username}
                required
              >
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder={t("auth.usernamePlaceholder")}
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField
                label={t("auth.passwordLabel")}
                error={errors.password}
                required
              >
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder={t("auth.passwordPlaceholder")}
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    disabled={isSubmitting}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="login-page__toggle-pw"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </FormField>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center mt-6"
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
