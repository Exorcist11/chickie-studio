"use client";

import * as React from "react";
import { Controller, useFormContext, FieldPath, FieldValues } from "react-hook-form";
import { TextField, TextFieldProps } from "../TextField";
import { TextArea, TextAreaProps } from "../Textarea";
import { Select, SelectProps } from "../Select";
import { Checkbox, CheckboxProps } from "../Checkbox";
import { CurrencyField, CurrencyFieldProps } from "../CurrencyField";
import { PhoneField, PhoneFieldProps } from "../PhoneField";
import { DatePicker, DatePickerProps } from "../DatePicker";

export interface BaseFormFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>;
}

// 1. FormTextField
export interface FormTextFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<TextFieldProps, "name" | "value" | "onChange" | "error">,
    BaseFormFieldProps<TFieldValues> {}

export const FormTextField = <TFieldValues extends FieldValues = FieldValues>({
  name,
  hint,
  ...props
}: FormTextFieldProps<TFieldValues>) => {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...props}
          {...field}
          value={field.value ?? ""}
          error={fieldState.error?.message}
          hint={hint}
        />
      )}
    />
  );
};

// 2. FormTextArea
export interface FormTextAreaProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<TextAreaProps, "name" | "value" | "onChange" | "error">,
    BaseFormFieldProps<TFieldValues> {}

export const FormTextArea = <TFieldValues extends FieldValues = FieldValues>({
  name,
  hint,
  ...props
}: FormTextAreaProps<TFieldValues>) => {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextArea
          {...props}
          {...field}
          value={field.value ?? ""}
          error={fieldState.error?.message}
          hint={hint}
        />
      )}
    />
  );
};

// 3. FormSelect
export interface FormSelectProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<SelectProps, "name" | "value" | "onChange" | "error">,
    BaseFormFieldProps<TFieldValues> {}

export const FormSelect = <TFieldValues extends FieldValues = FieldValues>({
  name,
  hint,
  ...props
}: FormSelectProps<TFieldValues>) => {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Select
          {...props}
          value={field.value ?? ""}
          onChange={field.onChange}
          error={fieldState.error?.message}
          hint={hint}
        />
      )}
    />
  );
};

// 4. FormCheckbox
export interface FormCheckboxProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<CheckboxProps, "name" | "checked" | "onCheckedChange" | "error">,
    BaseFormFieldProps<TFieldValues> {}

export const FormCheckbox = <TFieldValues extends FieldValues = FieldValues>({
  name,
  hint,
  ...props
}: FormCheckboxProps<TFieldValues>) => {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Checkbox
          {...props}
          checked={Boolean(field.value)}
          onCheckedChange={field.onChange}
          error={fieldState.error?.message}
          hint={hint}
        />
      )}
    />
  );
};

// 5. FormCurrencyField
export interface FormCurrencyFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<CurrencyFieldProps, "name" | "value" | "onChange" | "error">,
    BaseFormFieldProps<TFieldValues> {}

export const FormCurrencyField = <TFieldValues extends FieldValues = FieldValues>({
  name,
  hint,
  ...props
}: FormCurrencyFieldProps<TFieldValues>) => {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <CurrencyField
          {...props}
          value={field.value ?? 0}
          onChange={field.onChange}
          error={fieldState.error?.message}
          hint={hint}
        />
      )}
    />
  );
};

// 6. FormPhoneField
export interface FormPhoneFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<PhoneFieldProps, "name" | "value" | "onChange" | "error">,
    BaseFormFieldProps<TFieldValues> {}

export const FormPhoneField = <TFieldValues extends FieldValues = FieldValues>({
  name,
  hint,
  ...props
}: FormPhoneFieldProps<TFieldValues>) => {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <PhoneField
          {...props}
          value={field.value ?? ""}
          onChange={field.onChange}
          error={fieldState.error?.message}
          hint={hint}
        />
      )}
    />
  );
};

// 7. FormDatePicker
export interface FormDatePickerProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<DatePickerProps, "name" | "value" | "onChange" | "error">,
    BaseFormFieldProps<TFieldValues> {}

export const FormDatePicker = <TFieldValues extends FieldValues = FieldValues>({
  name,
  hint,
  ...props
}: FormDatePickerProps<TFieldValues>) => {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <DatePicker
          {...props}
          value={field.value ?? ""}
          onChange={field.onChange}
          error={fieldState.error?.message}
          hint={hint}
        />
      )}
    />
  );
};
