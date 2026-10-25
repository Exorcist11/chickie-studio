import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { FilterBar } from "./FilterBar";

describe("FilterBar Component", () => {
  const categories = [
    { label: "Tất cả", value: "all" },
    { label: "Váy dạ hội", value: "evening" },
    { label: "Áo dài", value: "aodai" },
  ];

  const sortOptions = [
    { label: "Mới nhất", value: "newest" },
    { label: "Giá tăng dần", value: "price_asc" },
  ];

  it("renders search input, categories and sort options", () => {
    render(
      <FilterBar
        categories={categories}
        sortOptions={sortOptions}
        selectedCategory="evening"
      />
    );

    expect(screen.getByRole("search")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Tìm kiếm trang phục, mã đầm...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Váy dạ hội" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Áo dài" })).toHaveAttribute("aria-pressed", "false");
  });

  it("handles search input change and clear", async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    render(<FilterBar onSearchChange={onSearchChange} />);

    const input = screen.getByPlaceholderText("Tìm kiếm trang phục, mã đầm...");
    await user.type(input, "Váy trắng");

    expect(onSearchChange).toHaveBeenCalled();

    const clearBtn = screen.getByRole("button", { name: "Xóa nội dung tìm kiếm" });
    await user.click(clearBtn);
    expect(onSearchChange).toHaveBeenLastCalledWith("");
  });

  it("handles category click", async () => {
    const user = userEvent.setup();
    const onCategoryChange = vi.fn();
    render(
      <FilterBar
        categories={categories}
        selectedCategory="all"
        onCategoryChange={onCategoryChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Áo dài" }));
    expect(onCategoryChange).toHaveBeenCalledWith("aodai");
  });

  it("handles sort change and reset button", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    const onReset = vi.fn();

    render(
      <FilterBar
        sortOptions={sortOptions}
        selectedSort="price_asc"
        onSortChange={onSortChange}
        onReset={onReset}
      />
    );

    const resetBtn = screen.getByRole("button", { name: "Đặt lại" });
    await user.click(resetBtn);
    expect(onReset).toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <FilterBar
        categories={categories}
        selectedCategory="evening"
        sortOptions={sortOptions}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
