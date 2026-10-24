# Design System Chickie Studio

Nguồn: bảng moodboard "Chickie Studio sang trọng". Phong cách: thanh lịch, nữ tính, ấm, tối giản, dùng nhiều ảnh lớn. Tagline thương hiệu: *More than just a dress*.

> Mã màu được đọc từ ảnh moodboard nên có thể lệch nhẹ so với file thiết kế gốc. Nếu có file Figma/brand guideline, đối chiếu và sửa tại `client/src/styles/tokens.css` và `crm/src/theme/antdTheme.ts`.

File liên quan: `client/src/styles/tokens.css`, `client/tailwind.config.ts`, `client/src/lib/fonts.ts`, `crm/src/theme/antdTheme.ts`.

## 1. Nguyên tắc
1. Ảnh là nhân vật chính: ảnh lớn, nền sạch, chữ ít.
2. Burgundy là màu hành động duy nhất: nút chính, liên kết đang chọn, giá. Không dùng thêm màu nhấn khác.
3. Vàng champagne chỉ để điểm xuyến (sao đánh giá, đường kẻ mảnh, icon). Không dùng làm màu chữ nhỏ.
4. Nhiều khoảng trắng, bo góc mềm, bóng đổ nhẹ tông nâu ấm.
5. Một component, một nơi định nghĩa. Dùng token, không hardcode màu hay kích thước.

## 2. Màu sắc
| Token | Tailwind | Hex | Dùng cho |
|---|---|---|---|
| burgundy | `bg-burgundy` | #641D2B | Nút chính, giá, trạng thái chọn, logo |
| burgundy-light | `bg-burgundy-light` | #762538 | Hover nhẹ, biểu đồ, nhấn phụ |
| burgundy-dark | `bg-burgundy-dark` | #4C1520 | Pressed của nút chính |
| gold | `text-gold` | #B8914F | Sao, đường kẻ, icon điểm nhấn |
| rose-beige | `bg-rose` | #DCC8BD | Chip, nền icon, viền nhẹ |
| ivory | `bg-ivory` | #F8F1E8 | Nền section xen kẽ, header bảng |
| warm-white | `bg-warm-white` | #FFFCF8 | Nền trang, nền card |
| ink | `text-ink` | #302528 | Chữ chính, sidebar admin |
| ink-muted | `text-ink-muted` | #6B5D60 | Chữ phụ, mô tả |
| line | `border-line` | #EADFD6 | Viền, đường phân cách |
| success / warning / danger / info | `text-success`... | #4F7A5A / #B8791F / #B3362F / #4A6A8A | Trạng thái đơn, thông báo |

Tương phản: burgundy và ink trên warm-white đạt chuẩn AA. Vàng (#B8914F) trên nền sáng chỉ khoảng 2.9:1, nên chỉ dùng cho thành phần trang trí hoặc chữ rất lớn.

## 3. Typography
| Vai trò | Font | Ghi chú |
|---|---|---|
| Heading, tagline, tên thương hiệu | Playfair Display | Bản italic cho tagline và câu nhấn |
| Body, UI, form, bảng | Inter | Đã bật subset `vietnamese` |

| Cấp | Kích thước (desktop / mobile) | Font | Weight | Line-height |
|---|---|---|---|---|
| Display (hero) | 56 / 36 | Playfair | 500 | 1.1 |
| H1 | 40 / 30 | Playfair | 500 | 1.2 |
| H2 | 30 / 24 | Playfair | 500 | 1.25 |
| H3 | 22 / 20 | Playfair | 500 | 1.3 |
| Body L | 18 | Inter | 400 | 1.6 |
| Body | 16 | Inter | 400 | 1.6 |
| Small | 14 | Inter | 400 | 1.5 |
| Caption | 12 | Inter | 500 | 1.4 |

Độ dài dòng tối đa khoảng 70 ký tự cho đoạn văn. Dùng sentence case, không viết hoa toàn bộ.

## 4. Bố cục
- Container tối đa 1200px, padding ngang 16px (mobile), 24px (tablet), 32px (desktop).
- Lưới 12 cột desktop, 4 cột mobile, gap 16/24px.
- Thang khoảng cách (Tailwind mặc định, bước 4px): 4, 8, 12, 16, 24, 32, 48, 64, 96. Khoảng cách giữa các section: 64 (mobile), 96 (desktop).
- Breakpoint: sm 640, md 768, lg 1024, xl 1280. Thiết kế mobile-first.
- Nền trang xen kẽ warm-white và ivory để chia section, không dùng viền dày.

## 5. Bo góc, bóng, chuyển động
- Bo góc: 6 (tag), 10 (nút, input), 16 (card, khung ảnh), pill (chip lọc).
- Bóng: `shadow-card` cho card thường, `shadow-raised` cho hover/dropdown/modal.
- Chuyển động: 150–250ms, easing `standard`. Chỉ dùng cho phản hồi thao tác (hover, mở, chọn). Tôn trọng `prefers-reduced-motion`.

## 6. Component (đặt ở `client/src/components/ui`, CRM dùng Ant Design theo theme)

| Component | Quy cách |
|---|---|
| Button primary | Nền burgundy, chữ trắng, bo 10, cao 44, hover burgundy-light, pressed burgundy-dark |
| Button secondary | Viền burgundy 1px, chữ burgundy, nền trong suốt, hover nền ivory |
| Button tertiary | Chỉ chữ burgundy, gạch chân khi hover |
| Input / Select / DatePicker | Nền warm-white, viền `line`, bo 10, cao 44, focus: viền burgundy + vòng 2px burgundy 20% |
| Chip | Bo pill. Đang chọn: nền burgundy, chữ trắng. Chưa chọn: nền rose-beige nhạt, chữ ink |
| ProductCard | Ảnh dọc tỉ lệ 3:4 bo 16, nút tim góc trên phải, tên (Body, 2 dòng tối đa), giá burgundy kèm "/ngày", sao vàng + điểm, chấm màu có sẵn |
| ServiceCard | Ảnh ngang, icon nền rose, tiêu đề, mô tả 2 dòng, liên kết "Khám phá" |
| SectionHeading | Tiêu đề Playfair, mô tả ngắn Inter phía dưới, căn trái, không có nhãn chữ hoa phía trên |
| Rating | Sao vàng, điểm số và số lượt đánh giá bằng chữ Small |
| TestimonialCard | Ảnh tròn, trích dẫn italic Playfair, tên khách, sao vàng |
| Header | Logo trái, menu giữa, icon tìm kiếm / yêu thích / tài khoản phải; nền warm-white, dính trên cùng khi cuộn |
| Footer | Nền ink, chữ warm-white, logo, liên hệ nhanh (Zalo, Facebook, hotline) |
| Badge trạng thái đơn | Chấm màu + chữ: PENDING warning, CONFIRMED/DEPOSITED info, DELIVERED burgundy-light, COMPLETED success, CANCELLED/OVERDUE danger |

Trang chủ theo moodboard: hero ảnh lớn kèm tagline Playfair italic và một nút chính; 3 thẻ dịch vụ (Thuê trang phục, Thuê máy ảnh, Dịch vụ chụp ảnh); banner bộ sưu tập mới; lưới sản phẩm nổi bật có chip lọc; dải 4 cam kết (thiết kế tỉ mỉ, dịch vụ chuyên nghiệp, thiết bị hiện đại, đội ngũ sáng tạo); đánh giá khách.

## 7. CRM (Admin)
- Sidebar nền ink, mục đang chọn nền burgundy, chữ warm-white. Nội dung nền warm-white, card nền trắng.
- Biểu đồ: đường chính burgundy, lưới `line`, vùng nền burgundy 8%.
- Bảng: header nền ivory, hàng cao 52, trạng thái dùng Badge ở mục 6.
- Số liệu tổng quan (thẻ KPI) bằng Playfair cỡ H2, nhãn Inter Small.

## 8. Hình ảnh và icon
- Ảnh người mẫu, phong cách ánh sáng tự nhiên, tông ấm; luôn dùng `next/image`, có `alt` tiếng Việt qua file ngôn ngữ.
- Icon dạng nét mảnh (stroke 1.5), dùng `lucide-react` ở client. Màu icon: burgundy hoặc ink-muted.
- Logo: monogram "CS" burgundy kèm chữ CHICKIE STUDIO giãn chữ. Cung cấp bản dọc (ngang với tagline) và bản mono trắng cho nền tối.

## 9. Khả năng truy cập
- Focus nhìn thấy rõ trên mọi phần tử tương tác.
- Vùng bấm tối thiểu 44x44px trên mobile.
- Không truyền đạt trạng thái chỉ bằng màu: luôn kèm chữ hoặc icon.
- Ảnh có `alt`; icon trang trí đặt `aria-hidden`.

## 10. Cách dùng
1. Client: import `src/styles/tokens.css` trong `globals.css`, nạp font ở `layout.tsx`, dùng class Tailwind đã ánh xạ. Tailwind v4: thêm `@config "../../tailwind.config.ts";` vào `globals.css`.
2. CRM: bọc ứng dụng bằng `<ConfigProvider theme={antdTheme}>`.
3. Thêm token hoặc component mới: cập nhật tài liệu này trước, rồi mới viết code.
