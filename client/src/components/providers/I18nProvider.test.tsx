import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useTranslations } from "next-intl";
import { I18nProvider } from "./I18nProvider";

function TestConsumer() {
  const t = useTranslations("common");
  return <div>{t("rentNow")}</div>;
}

describe("I18nProvider", () => {
  it("provides Vietnamese translations by default", () => {
    render(
      <I18nProvider locale="vi">
        <TestConsumer />
      </I18nProvider>
    );

    expect(screen.getByText("Thuê ngay")).toBeInTheDocument();
  });

  it("provides English translations when locale is 'en'", () => {
    render(
      <I18nProvider locale="en">
        <TestConsumer />
      </I18nProvider>
    );

    expect(screen.getByText("Rent now")).toBeInTheDocument();
  });

  it("supports custom messages override", () => {
    render(
      <I18nProvider
        locale="en"
        messages={{
          common: {
            rentNow: "Custom Rent Now Text",
          },
        }}
      >
        <TestConsumer />
      </I18nProvider>
    );

    expect(screen.getByText("Custom Rent Now Text")).toBeInTheDocument();
  });
});
