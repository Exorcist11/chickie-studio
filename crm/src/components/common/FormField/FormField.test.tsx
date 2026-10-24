import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { z } from "zod";
import { FormField, createZodValidator } from "./FormField";

describe("FormField component (CRM)", () => {
  it("renders with label, input, and explicit error with role alert", () => {
    render(
      <FormField name="price" label="Giá thuê" error="Giá thuê phải lớn hơn 0" required>
        <input id="price" />
      </FormField>
    );

    expect(screen.getByText("Giá thuê")).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Giá thuê phải lớn hơn 0");
  });

  it("renders with helperText when no error", () => {
    render(
      <FormField name="name" label="Tên sản phẩm" helperText="Nhập đầy đủ tên">
        <input id="name" />
      </FormField>
    );

    expect(screen.getByText("Tên sản phẩm")).toBeInTheDocument();
    expect(screen.getByText("Nhập đầy đủ tên")).toBeInTheDocument();
  });

  describe("createZodValidator", () => {
    it("resolves when value satisfies schema", async () => {
      const schema = z.string().min(3);
      const validator = createZodValidator(schema);

      await expect(validator("valid-text")).resolves.toBeUndefined();
    });

    it("rejects with zod error message when value fails schema", async () => {
      const schema = z.string().min(3, "Tối thiểu 3 ký tự");
      const validator = createZodValidator(schema);

      await expect(validator("ab")).rejects.toThrow("Tối thiểu 3 ký tự");
    });
  });
});
