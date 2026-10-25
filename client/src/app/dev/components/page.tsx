"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import {
  Button,
  Input,
  Select,
  Textarea,
  DateRangeField,
  Chip,
  ChipGroup,
  Badge,
  Rating,
  ColorSwatch,
  ColorSwatchGroup,
  SizeSelector,
  Card,
  ProductCard,
  ServiceCard,
  TestimonialCard,
  SectionHeading,
  Container,
  Section,
  Modal,
  ConfirmModal,
  Drawer,
  Menu,
  MenuItem,
  MenuHeader,
  MenuDivider,
  Popover,
  Tooltip,
  notify,
  Toast,
  Skeleton,
  EmptyState,
  Spinner,
  Logo,
  Header,
  Footer,
  type OrderStatus,
} from "@/components/ui";
import {
  Button as ChickieUIButton,
  TextField as ChickieTextField,
  PasswordField as ChickiePasswordField,
  SearchField as ChickieSearchField,
  TextArea as ChickieTextArea,
  Select as ChickieSelect,
  Checkbox as ChickieCheckbox,
  RadioGroup as ChickieRadioGroup,
  Switch as ChickieSwitch,
  Badge as ChickieBadge,
  Card as ChickieCard,
  CardHeader as ChickieCardHeader,
  CardTitle as ChickieCardTitle,
  CardDescription as ChickieCardDescription,
  CardContent as ChickieCardContent,
  CardFooter as ChickieCardFooter,
  Spinner as ChickieSpinner,
  Skeleton as ChickieSkeleton,
} from "@/components/ui";

export default function DevComponentsPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const [chipVal, setChipVal] = React.useState<string | number>("all");
  const [multiChips, setMultiChips] = React.useState<(string | number)[]>(["S"]);
  const [selectedSize, setSelectedSize] = React.useState("M");
  const [selectedColor, setSelectedColor] = React.useState("#641D2B");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [uiSearch, setUiSearch] = React.useState("");
  const [uiSelect, setUiSelect] = React.useState("aodai");
  const [uiChecked, setUiChecked] = React.useState(true);
  const [uiRadio, setUiRadio] = React.useState("standard");
  const [uiSwitch, setUiSwitch] = React.useState(true);

  const colors = [
    { name: "Burgundy", hex: "#641D2B" },
    { name: "Burgundy Light", hex: "#762538" },
    { name: "Burgundy Dark", hex: "#4C1520" },
    { name: "Gold", hex: "#B8914F" },
    { name: "Rose Beige", hex: "#DCC8BD" },
    { name: "Ivory", hex: "#F8F1E8" },
    { name: "Warm White", hex: "#FFFCF8" },
    { name: "Ink", hex: "#302528" },
    { name: "Ink Muted", hex: "#6B5D60" },
    { name: "Line", hex: "#EADFD6" },
    { name: "Success", hex: "#4F7A5A" },
    { name: "Warning", hex: "#B8791F" },
    { name: "Danger", hex: "#B3362F" },
    { name: "Info", hex: "#4A6A8A" },
  ];

  const orderStatuses: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "DEPOSITED",
    "DELIVERED",
    "RETURNED",
    "COMPLETED",
    "CANCELLED",
    "OVERDUE",
  ];

  return (
    <div className="min-h-screen bg-warm-white pb-24 text-left">
      <Header favoriteCount={2} />

      <Container className="py-10 space-y-16">
        {/* Intro */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-burgundy">
            Developer Preview Only
          </span>
          <h1 className="font-serif text-4xl text-ink font-semibold mt-1">
            Chickie Studio Design System Showcase
          </h1>
          <p className="text-ink-muted text-base mt-2">
            Xem trước toàn bộ component UI dùng chung theo design system, token màu sắc, typography và các trạng thái.
          </p>
        </div>

        {/* 1. Color Palette Tokens */}
        <section className="space-y-4">
          <SectionHeading title="1. Bảng Màu Sắc (Color Tokens)" description="Đọc từ moodboard Chickie Studio với màu chủ đạo Burgundy #641D2B" />
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {colors.map((c) => (
              <div key={c.hex} className="p-3 bg-white rounded-card border border-line shadow-xs flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-full border border-line shadow-inner mb-2 bg-[var(--swatch-color)]"
                  style={{ "--swatch-color": c.hex } as React.CSSProperties}
                />
                <span className="text-xs font-semibold text-ink text-center">{c.name}</span>
                <span className="text-[11px] text-ink-muted uppercase font-mono">{c.hex}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Typography Scale */}
        <section className="space-y-4">
          <SectionHeading title="2. Thang Chữ (Typography Scale)" description="Playfair Display cho Tiêu đề & Inter cho Nội dung" />
          <div className="p-6 bg-white rounded-card border border-line space-y-4">
            <div>
              <span className="text-xs text-ink-muted">Display Hero (Playfair 500)</span>
              <p className="font-serif text-4xl md:text-5xl text-ink font-medium">Tỏa sáng trong mọi khoảnh khắc</p>
            </div>
            <div>
              <span className="text-xs text-ink-muted">Tagline Italic (Playfair Italic)</span>
              <p className="font-serif italic text-2xl text-burgundy">More than just a dress</p>
            </div>
            <div>
              <span className="text-xs text-ink-muted">Heading 1 & 2 (Playfair 500)</span>
              <h2 className="font-serif text-2xl md:text-3xl text-ink font-medium">Bộ sưu tập áo dài kỷ yếu Hà Nội</h2>
            </div>
            <div>
              <span className="text-xs text-ink-muted">Body Regular & Small (Inter 400)</span>
              <p className="text-base text-ink leading-relaxed">
                Chickie Studio chuyên cho thuê váy thiết kế, áo dài cao cấp và combo máy ảnh du lịch sắc nét tại Hà Nội.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Logo */}
        <section className="space-y-4">
          <SectionHeading title="3. Logo & Nhận Diện Thương Hiệu" description="Biến thể ngang, dọc và đơn sắc (mono)" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-card border border-line flex flex-col items-center justify-center min-h-[120px]">
              <span className="text-xs text-ink-muted mb-3">Horizontal</span>
              <Logo variant="horizontal" />
            </div>
            <div className="p-6 bg-white rounded-card border border-line flex flex-col items-center justify-center min-h-[120px]">
              <span className="text-xs text-ink-muted mb-3">Vertical</span>
              <Logo variant="vertical" />
            </div>
            <div className="p-6 bg-ink rounded-card border border-line flex flex-col items-center justify-center min-h-[120px]">
              <span className="text-xs text-rose/60 mb-3">Mono (Nền tối)</span>
              <Logo variant="mono" />
            </div>
          </div>
        </section>

        {/* 4. Buttons */}
        <section className="space-y-4">
          <SectionHeading title="4. Button (Nút Bấm)" description="Các biến thể primary, secondary, tertiary, size md (cao 44), sm, loading, disabled" />
          <div className="p-6 bg-white rounded-card border border-line flex flex-wrap items-center gap-4">
            <Button variant="primary" size="md">Primary MD (44px)</Button>
            <Button variant="secondary" size="md">Secondary MD</Button>
            <Button variant="tertiary" size="md">Tertiary Link</Button>
            <Button variant="primary" size="sm">Primary SM (36px)</Button>
            <Button variant="primary" isLoading>Đang lưu...</Button>
            <Button variant="primary" disabled>Bị vô hiệu hóa</Button>
          </div>
        </section>

        {/* 4b. @chickie/ui Package UI-1 Showcase (Monorepo Standard) */}
        <section className="space-y-6">
          <SectionHeading
            title="4b. Giai Đoạn UI-1: Bộ Nhập Liệu & Hiển Thị Cơ Bản (@chickie/ui)"
            description="Toàn bộ component chuẩn hóa từ package dùng chung @chickie/ui bọc shadcn primitive (Zero Inline CSS, WAI-ARIA 100%, Coverage > 80%)"
          />

          <div className="space-y-6">
            {/* Buttons */}
            <div className="p-6 bg-white rounded-card border border-line space-y-3">
              <span className="text-xs font-semibold text-ink uppercase tracking-wider block">
                1. Nút bấm (Button)
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <ChickieUIButton variant="primary" size="md">
                  Chickie Primary (44px)
                </ChickieUIButton>
                <ChickieUIButton variant="secondary" size="md">
                  Chickie Secondary
                </ChickieUIButton>
                <ChickieUIButton variant="tertiary" size="md">
                  Chickie Tertiary
                </ChickieUIButton>
                <ChickieUIButton variant="primary" size="sm">
                  Primary SM (36px)
                </ChickieUIButton>
                <ChickieUIButton variant="primary" loading>
                  Đang tải...
                </ChickieUIButton>
                <ChickieUIButton variant="secondary" disabled>
                  Bị vô hiệu hóa
                </ChickieUIButton>
              </div>
            </div>

            {/* TextFields */}
            <div className="p-6 bg-white rounded-card border border-line space-y-4">
              <span className="text-xs font-semibold text-ink uppercase tracking-wider block">
                2. Ô nhập văn bản (TextField, PasswordField, SearchField)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ChickieTextField
                  label="Họ tên người thuê"
                  placeholder="Ví dụ: Nguyễn Phương Anh"
                  hint="Nhập đúng theo CCCD"
                  required
                />
                <ChickiePasswordField
                  label="Mật khẩu tài khoản"
                  placeholder="Nhập tối thiểu 8 ký tự"
                  required
                />
                <ChickieSearchField
                  label="Tìm kiếm trang phục"
                  placeholder="Nhập tên váy, áo dài..."
                  value={uiSearch}
                  onChange={(e) => setUiSearch(e.target.value)}
                  onClear={() => setUiSearch("")}
                />
              </div>
            </div>

            {/* TextArea & Select */}
            <div className="p-6 bg-white rounded-card border border-line space-y-4">
              <span className="text-xs font-semibold text-ink uppercase tracking-wider block">
                3. Vùng văn bản & Hộp chọn (TextArea & Select)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ChickieTextArea
                  label="Ghi chú yêu cầu chỉnh sửa số đo"
                  placeholder="Nhập số đo 3 vòng, chiều cao, chiều dài mong muốn..."
                  maxLength={200}
                  showCount
                  hint="Thợ may sẽ hỗ trợ bóp eo/nới tà miễn phí"
                />
                <ChickieSelect
                  label="Danh mục trang phục dự tiệc"
                  value={uiSelect}
                  onChange={(e) => setUiSelect(e.target.value)}
                  options={[
                    { value: "aodai", label: "Áo dài truyền thống & cách tân" },
                    { value: "maxi", label: "Đầm maxi tơ tằm chụp ngoại cảnh" },
                    { value: "evening", label: "Váy dạ hội cao cấp đính kết" },
                    { value: "camera", label: "Combo máy ảnh du lịch Sony" },
                  ]}
                  hint="Chọn nhóm đồ để hiển thị bảng size phù hợp"
                />
              </div>
            </div>

            {/* Checkbox, RadioGroup & Switch */}
            <div className="p-6 bg-white rounded-card border border-line space-y-4">
              <span className="text-xs font-semibold text-ink uppercase tracking-wider block">
                4. Lựa chọn & Công tắc (Checkbox, RadioGroup & Switch)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <ChickieCheckbox
                    label="Đồng ý xuất hóa đơn VAT"
                    hint="Gửi hóa đơn điện tử trong 24h"
                    checked={uiChecked}
                    onCheckedChange={setUiChecked}
                  />
                </div>
                <div>
                  <ChickieRadioGroup
                    label="Hình thức nhận trang phục"
                    name="delivery-method"
                    value={uiRadio}
                    onValueChange={setUiRadio}
                    options={[
                      { value: "standard", label: "Nhận tại cửa hàng (Miễn phí)" },
                      { value: "express", label: "Giao hỏa tốc nội thành (+50.000₫)" },
                    ]}
                  />
                </div>
                <div>
                  <ChickieSwitch
                    label="Tự động gia hạn thêm 1 ngày"
                    hint="Áp dụng ưu đãi giảm 20% ngày thứ 2"
                    checked={uiSwitch}
                    onCheckedChange={setUiSwitch}
                  />
                </div>
              </div>
            </div>

            {/* Badges, Spinners & Skeletons */}
            <div className="p-6 bg-white rounded-card border border-line space-y-4">
              <span className="text-xs font-semibold text-ink uppercase tracking-wider block">
                5. Huy hiệu ngữ nghĩa & Trạng thái tải (Badge, Spinner & Skeleton)
              </span>
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-ink-muted block mb-2">Semantic Badges:</span>
                  <div className="flex flex-wrap gap-2 items-center">
                    <ChickieBadge variant="primary">Mới về (Primary)</ChickieBadge>
                    <ChickieBadge variant="secondary">Đã cọc (Secondary)</ChickieBadge>
                    <ChickieBadge variant="accent">Hot Trend (Accent)</ChickieBadge>
                    <ChickieBadge variant="success">Sẵn sàng thuê (Success)</ChickieBadge>
                    <ChickieBadge variant="warning">Đang giặt ủi (Warning)</ChickieBadge>
                    <ChickieBadge variant="destructive">Hết hàng (Destructive)</ChickieBadge>
                    <ChickieBadge variant="outline">Size S - M (Outline)</ChickieBadge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <span className="text-xs text-ink-muted block">Spinners (xs, sm, md, lg):</span>
                    <div className="flex items-center gap-4">
                      <ChickieSpinner size="xs" />
                      <ChickieSpinner size="sm" />
                      <ChickieSpinner size="md" />
                      <ChickieSpinner size="lg" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs text-ink-muted block">Skeletons (Presets):</span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <ChickieSkeleton shape="circular" className="h-10 w-10 shrink-0" />
                        <div className="space-y-1 w-full">
                          <ChickieSkeleton shape="text" className="w-1/2" />
                          <ChickieSkeleton shape="text" className="w-3/4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compound Card */}
            <div className="p-6 bg-white rounded-card border border-line space-y-4">
              <span className="text-xs font-semibold text-ink uppercase tracking-wider block">
                6. Thẻ ghép cấu trúc (Compound Card: Header, Title, Description, Content, Footer)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ChickieCard variant="default">
                  <ChickieCardHeader>
                    <ChickieCardTitle>Card Mặc Định</ChickieCardTitle>
                    <ChickieCardDescription>Viền thanh mảnh và bóng nhẹ</ChickieCardDescription>
                  </ChickieCardHeader>
                  <ChickieCardContent>
                    <p className="text-sm text-ink-muted">Nội dung thẻ mô tả dịch vụ thuê đồ studio.</p>
                  </ChickieCardContent>
                  <ChickieCardFooter>
                    <ChickieUIButton variant="primary" size="sm">Xem chi tiết</ChickieUIButton>
                  </ChickieCardFooter>
                </ChickieCard>

                <ChickieCard variant="elevated" interactive>
                  <ChickieCardHeader>
                    <ChickieCardTitle>Card Nổi Bật (Interactive)</ChickieCardTitle>
                    <ChickieCardDescription>Hiệu ứng nâng thẻ khi di chuột</ChickieCardDescription>
                  </ChickieCardHeader>
                  <ChickieCardContent>
                    <p className="text-sm text-ink-muted">Tương tác trực quan hỗ trợ focus ring WAI-ARIA.</p>
                  </ChickieCardContent>
                  <ChickieCardFooter>
                    <ChickieBadge variant="accent">Best Seller</ChickieBadge>
                  </ChickieCardFooter>
                </ChickieCard>

                <ChickieCard variant="outline">
                  <ChickieCardHeader>
                    <ChickieCardTitle>Card Viền Mảnh</ChickieCardTitle>
                    <ChickieCardDescription>Dạng outline phẳng</ChickieCardDescription>
                  </ChickieCardHeader>
                  <ChickieCardContent>
                    <p className="text-sm text-ink-muted">Thích hợp cho danh sách bảng biểu phụ trợ.</p>
                  </ChickieCardContent>
                  <ChickieCardFooter>
                    <ChickieUIButton variant="secondary" size="sm">Tùy chọn</ChickieUIButton>
                  </ChickieCardFooter>
                </ChickieCard>
              </div>
            </div>
          </div>
        </section>


        {/* 5. Inputs & Form Controls */}
        <section className="space-y-4">
          <SectionHeading title="5. Form Controls" description="Input, Select, Textarea và DateRangeField cho đặt thuê" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-card border border-line">
            <Input label="Họ và tên" placeholder="Nhập tên người thuê đồ" helperText="Ví dụ: Nguyễn Phương Anh" />
            <Input label="Số điện thoại" placeholder="0987654321" error="Số điện thoại không đúng định dạng" />
            <Select
              label="Chọn loại trang phục"
              options={[
                { label: "Váy thiết kế dự tiệc", value: "party" },
                { label: "Áo dài cách tân", value: "aodai" },
                { label: "Combo máy ảnh Sony", value: "camera" },
              ]}
            />
            <Textarea label="Ghi chú số đo" placeholder="Nhập chiều cao, cân nặng, yêu cầu riêng..." />
            <div className="md:col-span-2">
              <DateRangeField
                label="Khoảng thời gian đặt thuê đồ"
                startLabel="Ngày nhận đồ"
                endLabel="Ngày trả đồ"
                helperText="Cộng thêm 1 ngày đệm giặt ủi tự động"
              />
            </div>
          </div>
        </section>

        {/* 6. Chips & Badges */}
        <section className="space-y-4">
          <SectionHeading title="6. Chip, Status Badges & Rating" description="Lọc sản phẩm, trạng thái đơn theo bảng màu chuẩn và đánh giá sao vàng" />
          <div className="p-6 bg-white rounded-card border border-line space-y-6">
            <div>
              <span className="text-xs text-ink-muted block mb-2">Chip Filter (Đơn chọn & Đa chọn):</span>
              <ChipGroup
                options={[
                  { label: "Tất cả", value: "all" },
                  { label: "Mới nhất", value: "new" },
                  { label: "Váy dạ hội", value: "evening" },
                  { label: "Áo dài", value: "aodai" },
                  { label: "Vest nữ", value: "suit" },
                ]}
                value={chipVal}
                onChange={setChipVal}
              />
            </div>

            <div>
              <span className="text-xs text-ink-muted block mb-2">Multi-Select Chip Group (Chọn nhiều size):</span>
              <ChipGroup
                options={[
                  { label: "Size XS", value: "XS" },
                  { label: "Size S", value: "S" },
                  { label: "Size M", value: "M" },
                  { label: "Size L", value: "L" },
                ]}
                value={multiChips}
                multiple
                onChange={setMultiChips}
              />
            </div>

            <div>
              <span className="text-xs text-ink-muted block mb-2">Order Status Badges (Luôn có chữ + chấm màu):</span>
              <div className="flex flex-wrap gap-2.5 items-center">
                {orderStatuses.map((st) => (
                  <Badge key={st} status={st} />
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs text-ink-muted block mb-2">Rating Component:</span>
              <Rating score={4.9} reviewCount={128} size="md" />
            </div>
          </div>
        </section>

        {/* 7. Color Swatch & Size Selector */}
        <section className="space-y-4">
          <SectionHeading title="7. Color Swatch & Size Selector" description="Chọn màu sắc và kích cỡ có trạng thái hết hàng" />
          <div className="p-6 bg-white rounded-card border border-line grid grid-cols-1 md:grid-cols-2 gap-8">
            <ColorSwatchGroup
              colors={[
                { name: "Đỏ Burgundy", hex: "#641D2B" },
                { name: "Trắng Ngọc Trai", hex: "#FFFFFF" },
                { name: "Hồng Nude", hex: "#DCC8BD" },
                { name: "Đen Dạ Tiệc", hex: "#302528" },
              ]}
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
              showName
            />

            <SizeSelector
              sizes={[
                { value: "XS", disabled: false },
                { value: "S", disabled: false },
                { value: "M", disabled: false },
                { value: "L", disabled: true },
                { value: "XL", disabled: true },
              ]}
              value={selectedSize}
              onChange={setSelectedSize}
              sizeGuideAction="Bảng hướng dẫn chọn size"
            />
          </div>
        </section>

        {/* 8. Cards */}
        <section className="space-y-4">
          <SectionHeading title="8. Cards (Thẻ Sản Phẩm, Dịch Vụ & Đánh Giá)" description="Card bo 16, bóng shadow-card, ảnh 3:4 và nút tim toggle" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard
              id="p1"
              name="Đầm maxi voan xòe tiểu thư dáng dài chụp ngoại cảnh"
              slug="dam-maxi-voan-xoe"
              imageUrl="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop"
              price={180000}
              rating={4.9}
              reviewCount={42}
              colors={[
                { name: "Trắng", hex: "#FFFFFF" },
                { name: "Đỏ", hex: "#641D2B" },
              ]}
            />

            <ServiceCard
              title="Thuê máy ảnh chụp kỷ yếu"
              description="Thiết bị hiện đại Sony, Canon ống kính chân dung xóa phông sắc nét."
              imageUrl="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop"
              href="/cameras"
            />

            <TestimonialCard
              quote="Váy tại Chickie Studio form siêu tôn dáng, chất lụa mềm mại. Chụp ảnh kỷ yếu ai cũng khen!"
              authorName="Nguyễn Thu Trang"
              authorRole="Khách thuê váy kỷ yếu"
              rating={5}
            />
          </div>
        </section>

        {/* 9. Feedback & Modals */}
        <section className="space-y-4">
          <SectionHeading title="9. Phản Hồi & Hộp Thoại (Modal, Toast, Spinner, Empty)" description="Modal có focus trap đóng bằng Esc, Toast 4 trạng thái" />
          <div className="p-6 bg-white rounded-card border border-line space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Button onClick={() => setIsModalOpen(true)}>Mở Modal xem thử</Button>
              <Button variant="secondary" onClick={() => setIsConfirmOpen(true)}>Mở ConfirmModal</Button>
              <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>Mở Drawer</Button>

              <Menu trigger={<Button variant="secondary">Menu tác vụ</Button>}>
                <MenuHeader>Thao tác nhanh</MenuHeader>
                <MenuItem onClick={() => notify.info("Đã chọn xem chi tiết")}>Xem chi tiết</MenuItem>
                <MenuItem onClick={() => notify.success("Đã sao chép liên kết!")}>Sao chép link</MenuItem>
                <MenuDivider />
                <MenuItem danger onClick={() => notify.error("Hủy yêu cầu thành công")}>Hủy giữ đồ</MenuItem>
              </Menu>

              <Popover trigger={<Button variant="secondary">Mở Popover</Button>}>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-ink">Ưu đãi mùa kỷ yếu</h4>
                  <p className="text-xs text-ink-muted">Giảm ngay 15% khi thuê combo váy và máy ảnh trong tuần này.</p>
                  <Button size="sm" onClick={() => notify.success("Đã áp dụng mã!")}>Áp dụng mã</Button>
                </div>
              </Popover>

              <Tooltip content="Mẹo: Click để kích hoạt thông báo">
                <Button
                  size="sm"
                  onClick={() => notify.success("Chào mừng bạn đến với Chickie Studio!", { title: "Xin chào" })}
                >
                  Bắn Toast Notify
                </Button>
              </Tooltip>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Toast variant="success" title="Đặt cọc thành công" message="Tiệm đã nhận được tiền cọc giữ đồ của bạn." />
              <Toast variant="warning" title="Sắp hết hạn" message="Vui lòng hoàn tất đặt cọc trước 15:00." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <EmptyState
                title="Giỏ đồ đang trống"
                description="Bạn chưa chọn mẫu trang phục hoặc máy ảnh nào."
                action={<Button size="sm">Khám phá ngay</Button>}
              />

              <div className="space-y-3 p-6 bg-ivory rounded-card">
                <span className="text-xs text-ink-muted">Skeleton loading placeholders:</span>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <div className="pt-2 flex items-center gap-3">
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>

      {/* Modals demo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Bảng Quy Đổi Kích Cỡ Váy (Size Guide)"
        description="Số đo chuẩn áp dụng cho toàn bộ váy thiết kế Chickie Studio"
        footer={<Button onClick={() => setIsModalOpen(false)}>Đã hiểu</Button>}
      >
        <div className="text-sm space-y-3 text-ink-muted">
          <p>• <strong>Size S</strong>: Ngực 82-86cm, Eo 62-66cm, Mông 86-90cm (Phù hợp 42-48kg)</p>
          <p>• <strong>Size M</strong>: Ngực 86-90cm, Eo 66-70cm, Mông 90-94cm (Phù hợp 48-54kg)</p>
          <p>• <strong>Size L</strong>: Ngực 90-94cm, Eo 70-74cm, Mông 94-98cm (Phù hợp 54-60kg)</p>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => setIsConfirmOpen(false)}
        title="Xác nhận hủy đơn giữ lịch"
        content="Sau khi hủy, thời gian giữ đồ sẽ được mở lại cho các khách hàng khác. Bạn có chắc chắn muốn hủy không?"
        confirmText="Đồng ý hủy"
        cancelText="Giữ lại đơn"
        variant="danger"
      />

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Ngăn kéo giỏ đồ & Đặt cọc"
        description="Xem trước danh sách trang phục đang chọn"
        footer={<Button onClick={() => setIsDrawerOpen(false)}>Hoàn tất</Button>}
      >
        <div className="space-y-4 text-sm text-ink-muted">
          <p>• 1x Váy dạ hội Lụa Burgundy (Size M)</p>
          <p>• 1x Máy ảnh Canon EOS R5 + Lens 50mm</p>
          <p className="font-semibold text-ink pt-2 border-t border-line">Tổng tiền thuê tạm tính: 750.000₫</p>
        </div>
      </Drawer>

      <Footer />
    </div>
  );
}
