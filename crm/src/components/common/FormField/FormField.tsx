import React from "react";
import type { ZodType, ZodError } from "zod";
import { cn } from "../../../lib/cn";
import "./FormField.scss";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  label?: React.ReactNode;
  schema?: ZodType<unknown>;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const createZodValidator = (schema: ZodType<unknown>) => {
  return async (value: unknown) => {
    try {
      schema.parse(value);
      return Promise.resolve();
    } catch (err) {
      const zodErr = err as ZodError;
      const firstError = zodErr.errors?.[0]?.message || "Dữ liệu không hợp lệ";
      return Promise.reject(new Error(firstError));
    }
  };
};

/**
 * FormField chuẩn hóa theo shadcn/ui tích hợp Zod validation và ARIA accessibility
 */
export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  schema: _schema,
  error,
  helperText,
  required = false,
  children,
  className,
  ...props
}) => {
  const errorId = name ? `${name}-error` : undefined;
  const helperId = name ? `${name}-helper` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5 mb-4", className)} {...props}>
      {label && (
        <label
          htmlFor={name}
          className="text-xs md:text-sm font-medium text-ink flex items-center gap-1"
        >
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div>{children}</div>

      {error ? (
        <p id={errorId} role="alert" className="text-xs text-danger font-medium animate-fadeIn">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-ink-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

