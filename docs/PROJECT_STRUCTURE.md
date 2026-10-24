# Cấu trúc dự án Chickie Studio

Monorepo gồm 3 ứng dụng độc lập và hệ thống tài liệu quản lý toàn diện.

```text
chickie-studio/
├── README.md
├── AGENTS.md                           # Quy định bắt buộc cho AI Agent & lập trình viên
├── CHANGELOG.md                        # Nhật ký thay đổi theo Keep a Changelog
├── .gitignore
│
├── docs/
│   ├── .agent/                         # Quy tắc viết tài liệu, Mermaid, DoD
│   ├── PROJECT_DESCRIPTION.md          # Mô tả nghiệp vụ tổng quan dự án
│   ├── PROJECT_STRUCTURE.md            # Cấu trúc dự án hiện tại
│   ├── FEATURES.md                     # Bảng tổng quan 44 tính năng & theo dõi tiến độ
│   ├── features/                       # Hồ sơ đặc tả chi tiết từng tính năng
│   │   ├── _TEMPLATE.md                # Biểu mẫu chuẩn cho một tính năng
│   │   ├── auth/                       # Module Xác thực & Phân quyền (AUTH)
│   │   ├── catalog/                    # Module Danh mục & Sản phẩm (CAT)
│   │   ├── booking/                    # Module Đặt thuê & Chống trùng lịch (BOK)
│   │   ├── payment/                    # Module Thanh toán & Cọc (PAY)
│   │   ├── customer/                   # Module Khách hàng & Lịch sử (CUS)
│   │   ├── dashboard-report/           # Module Dashboard & Báo cáo (RPT)
│   │   ├── content-seo/                # Module Nội dung & SEO (CNT)
│   │   └── system-setting/             # Module Cấu hình hệ thống (SET)
│   └── adr/                            # Architecture Decision Records
│       ├── README.md                   # Hướng dẫn ghi nhận quyết định kiến trúc
│       └── 0001-chon-kien-truc-monorepo.md
│
├── client/                             # Next.js: website khách hàng (Mobile-First, SEO)
│   ├── .agent/                         # Quy tắc Clean Code, next-intl, RTL test, App Router
│   ├── public/                         # Ảnh, favicon, file tĩnh
│   └── src/
│       ├── app/                        # App Router: [locale], layout, page
│       ├── components/                 # ui/ (dùng chung), layout/, features/
│       ├── lib/                        # api client (src/lib/api), formatters
│       ├── hooks/                      # Custom React hooks
│       ├── types/                      # TypeScript definitions
│       └── i18n/                       # messages/ (vi.json, en.json), cấu hình next-intl
│
├── crm/                                # ReactJS (Vite): hệ thống quản trị cửa hàng
│   ├── .agent/                         # Quy tắc Clean Code, Zod, TanStack Query, test
│   ├── public/
│   └── src/
│       ├── pages/                      # Màn hình quản trị (Bookings, Products, Customers)
│       ├── components/                 # common/ (DataTable, ConfirmModal, FormField), features/
│       ├── layouts/                    # MainLayout (Sidebar, Header, Breadcrumb)
│       ├── routes/                     # Router, Route Guards, phân quyền RBAC
│       ├── services/                   # Axios client & API functions theo feature
│       ├── hooks/                      # Custom hooks & TanStack Query hooks
│       ├── types/                      # TypeScript types & Enums
│       ├── utils/                      # Hàm tiện ích dùng chung
│       └── i18n/                       # locales/ (vi.json, en.json), react-i18next
│
└── server/                             # Java 21 + Spring Boot 3 + MySQL: REST API
    ├── .agent/                         # Quy tắc Clean Code, Flyway, Pessimistic Lock, JaCoCo
    └── src/
        ├── main/
        │   ├── java/com/chickiestudio/
        │   │   ├── common/             # ApiResponse, BaseEntity, Exception handling, Security
        │   │   ├── auth/               # Xác thực, JWT, Refresh Token
        │   │   ├── user/               # Tài khoản nội bộ, phân quyền
        │   │   ├── category/           # Danh mục sản phẩm
        │   │   ├── product/            # Sản phẩm, biến thể (Size/Màu), món đồ thực tế
        │   │   ├── combo/              # Gói combo
        │   │   ├── booking/            # Đơn thuê, thuật toán chống trùng lịch
        │   │   ├── payment/            # Thanh toán, cọc
        │   │   ├── customer/           # Khách hàng & lịch sử thuê
        │   │   └── report/             # Báo cáo, thống kê
        │   └── resources/
        │       └── db/migration/       # Flyway SQL migrations (V{n}__*.sql)
        └── test/java/com/chickiestudio/ # JUnit 5, Mockito, Testcontainers MySQL
```

## Quy ước
- Server tổ chức package theo feature, không theo layer.
- Mỗi feature trong server gồm: `controller`, `service`, `repository`, `entity`, `dto`, `mapper`.
- Client và CRM gọi API qua một lớp riêng (`lib/api` và `services/`), không gọi fetch/axios rải rác trong component.
- Một tính năng chỉ đạt `✅ DONE` khi thỏa mãn Definition of Done (code, test tự động, coverage $\ge 80\%$, lint pass, docs & changelog cập nhật).
- Commit theo Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`).
