import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import "./ForbiddenPage.scss";

export const ForbiddenPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="forbidden-page" data-testid="forbidden-page">
      <div className="forbidden-page__card">
        <div className="forbidden-page__icon-box">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <h1 className="font-serif text-2xl font-bold text-ink mb-2">
          {t("permission.accessDeniedTitle")}
        </h1>

        <p className="text-sm text-ink-muted mb-6">
          {t("permission.accessDeniedMessage")}
        </p>

        <Link to="/">
          <Button variant="primary" className="w-full justify-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("permission.backHome")}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ForbiddenPage;
