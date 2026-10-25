import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { axe } from "vitest-axe";
import {
  FormTextField,
  FormTextArea,
  FormSelect,
  FormCheckbox,
  FormCurrencyField,
  FormPhoneField,
  FormDatePicker,
} from "./FormComponents";

const formSchema = z.object({
  fullName: z.string().min(2, "Họ tên tối thiểu 2 ký tự"),
  note: z.string().optional(),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  agreeVat: z.boolean().refine((val) => val === true, "Bạn phải đồng ý điều khoản"),
  deposit: z.number().min(100000, "Cọc tối thiểu 100.000₫"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  rentalDate: z.string().min(1, "Vui lòng chọn ngày"),
});

type FormValues = z.infer<typeof formSchema>;

interface TestFormProps {
  onSubmit: (values: FormValues) => void;
}

const TestForm: React.FC<TestFormProps> = ({ onSubmit }) => {
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      note: "",
      category: "",
      agreeVat: false,
      deposit: 0,
      phone: "",
      rentalDate: "",
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormTextField<FormValues>
          name="fullName"
          label="Họ và tên"
          placeholder="Nhập họ tên"
        />
        <FormTextArea<FormValues>
          name="note"
          label="Ghi chú số đo"
          placeholder="Chiều cao, cân nặng"
        />
        <FormSelect<FormValues>
          name="category"
          label="Loại trang phục"
          options={[
            { label: "Váy dạ hội", value: "evening-dress" },
            { label: "Áo dài", value: "ao-dai" },
          ]}
        />
        <FormCheckbox<FormValues>
          name="agreeVat"
          label="Tôi đồng ý với điều khoản thuê"
        />
        <FormCurrencyField<FormValues>
          name="deposit"
          label="Tiền cọc"
          placeholder="Nhập tiền cọc"
        />
        <FormPhoneField<FormValues>
          name="phone"
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
        />
        <FormDatePicker<FormValues>
          name="rentalDate"
          label="Ngày nhận đồ"
        />
        <button type="submit">Gửi thông tin</button>
      </form>
    </FormProvider>
  );
};

describe("FormComponents (UI-003)", () => {
  it("renders all form controls with labels", () => {
    render(<TestForm onSubmit={vi.fn()} />);

    expect(screen.getByText("Họ và tên")).toBeInTheDocument();
    expect(screen.getByText("Ghi chú số đo")).toBeInTheDocument();
    expect(screen.getByText("Loại trang phục")).toBeInTheDocument();
    expect(screen.getByText("Tôi đồng ý với điều khoản thuê")).toBeInTheDocument();
    expect(screen.getByText("Tiền cọc")).toBeInTheDocument();
    expect(screen.getByText("Số điện thoại")).toBeInTheDocument();
    expect(screen.getByText("Ngày nhận đồ")).toBeInTheDocument();
  });

  it("displays validation errors on invalid submit", async () => {
    const handleSubmit = vi.fn();
    render(<TestForm onSubmit={handleSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "Gửi thông tin" }));

    await waitFor(() => {
      expect(screen.getByText("Họ tên tối thiểu 2 ký tự")).toBeInTheDocument();
      expect(screen.getByText("Vui lòng chọn danh mục")).toBeInTheDocument();
      expect(screen.getByText("Bạn phải đồng ý điều khoản")).toBeInTheDocument();
      expect(screen.getByText("Cọc tối thiểu 100.000₫")).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("submits valid values successfully", async () => {
    const handleSubmit = vi.fn();
    render(<TestForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByPlaceholderText("Nhập họ tên"), {
      target: { value: "Nguyễn Văn A" },
    });
    fireEvent.change(screen.getByPlaceholderText("Chiều cao, cân nặng"), {
      target: { value: "Cao 1m65 nặng 50kg" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "evening-dress" },
    });
    fireEvent.click(screen.getByRole("checkbox"));

    // Deposit
    const depositInput = screen.getByPlaceholderText("Nhập tiền cọc");
    fireEvent.change(depositInput, { target: { value: "500000" } });

    // Phone
    const phoneInput = screen.getByPlaceholderText("Nhập số điện thoại");
    fireEvent.change(phoneInput, { target: { value: "0987654321" } });

    // Rental date: click to open and pick a date
    const dateBtn = screen.getByRole("button", { name: "Ngày nhận đồ" });
    fireEvent.click(dateBtn);
    const dayBtn = screen.getByRole("button", { name: "15" });
    fireEvent.click(dayBtn);

    fireEvent.click(screen.getByRole("button", { name: "Gửi thông tin" }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        fullName: "Nguyễn Văn A",
        category: "evening-dress",
        agreeVat: true,
        deposit: 500000,
        phone: "0987654321",
      }),
      expect.anything()
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TestForm onSubmit={vi.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
