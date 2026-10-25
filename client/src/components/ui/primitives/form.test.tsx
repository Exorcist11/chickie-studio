import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "./form";

const testSchema = z.object({
  username: z.string().min(3, "Tên người dùng tối thiểu 3 ký tự"),
});

type TestValues = z.infer<typeof testSchema>;

const TestFormComponent: React.FC<{ onSubmit?: (data: TestValues) => void }> = ({
  onSubmit = vi.fn(),
}) => {
  const form = useForm<TestValues>({
    resolver: zodResolver(testSchema),
    defaultValues: { username: "" },
    mode: "onBlur",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên người dùng</FormLabel>
              <FormControl>
                <input placeholder="Nhập tên" {...field} />
              </FormControl>
              <FormDescription>Gợi ý nhập tên của bạn</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Gửi</button>
      </form>
    </Form>
  );
};

describe("Shadcn Form Primitive Component", () => {
  it("renders form controls, labels, and description properly", () => {
    render(<TestFormComponent />);
    expect(screen.getByLabelText("Tên người dùng")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nhập tên")).toBeInTheDocument();
    expect(screen.getByText("Gợi ý nhập tên của bạn")).toBeInTheDocument();
  });

  it("displays validation error message when submitting invalid data", async () => {
    const user = userEvent.setup();
    render(<TestFormComponent />);

    await user.click(screen.getByRole("button", { name: "Gửi" }));
    expect(
      await screen.findByText("Tên người dùng tối thiểu 3 ký tự")
    ).toBeInTheDocument();
  });

  it("submits valid data cleanly", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<TestFormComponent onSubmit={handleSubmit} />);

    await user.type(screen.getByPlaceholderText("Nhập tên"), "chickie");
    await user.click(screen.getByRole("button", { name: "Gửi" }));

    expect(handleSubmit).toHaveBeenCalledWith(
      { username: "chickie" },
      expect.anything()
    );
  });
});
