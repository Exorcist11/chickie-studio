# Documentation Rules - Chickie Studio (Docs & Specs)

## ĐỌC TRƯỚC KHI LÀM (5 DÒNG TÓM TẮT)
1. **PHẢI** đọc toàn bộ tài liệu trong thư mục này trước khi viết hoặc cập nhật tài liệu kỹ thuật.
2. **PHẢI** viết tài liệu bằng **Markdown tiếng Việt**, mạch lạc, có mục lục khi tài liệu dài.
3. **PHẢI** trực quan hóa quy trình và kiến trúc bằng **Mermaid diagram**; cấm chèn ảnh chụp màn hình thay thế sơ đồ.
4. **PHẢI** cập nhật đồng thời tài liệu tính năng, schema DB và `CHANGELOG.md` ngay sau khi hoàn thành code.
5. **PHẢI** ghi nhận các quyết định kiến trúc quan trọng dưới dạng **ADR** trong thư mục `docs/adr/`.

---

## Mục Lục Các File Rule

| File | Tóm tắt nội dung |
|---|---|
| [01-writing-rules.md](file:///e:/chickie-studio/docs/.agent/01-writing-rules.md) | Văn phong tiếng Việt, cấu trúc tài liệu, định dạng Markdown và vẽ sơ đồ bằng Mermaid. |
| [02-feature-docs.md](file:///e:/chickie-studio/docs/.agent/02-feature-docs.md) | Mẫu tài liệu đặc tả tính năng chuẩn (Mục tiêu, Luồng nghiệp vụ, API DTO, Thay đổi DB). |
| [03-workflow.md](file:///e:/chickie-studio/docs/.agent/03-workflow.md) | Quy trình cập nhật `PROJECT_*.md`, viết `CHANGELOG.md` và lập hồ sơ kiến trúc ADR. |

---

## Definition of Done (DoD) Cho Tài Liệu

Mọi tài liệu tài liệu hóa tính năng hoặc kiến trúc chỉ hoàn thành khi:
- [ ] Soạn thảo bằng Markdown tiếng Việt chuẩn xác, không sai chính tả, không dùng từ ngữ mơ hồ.
- [ ] Luồng hoạt động phức tạp có sơ đồ Mermaid (flowchart hoặc sequenceDiagram) dễ hiểu.
- [ ] Có đầy đủ đặc tả API (Method, Path, Request Body, Response JSON, Error Codes).
- [ ] Đã đồng bộ `PROJECT_DESCRIPTION.md` và `PROJECT_STRUCTURE.md` nếu cấu trúc thay đổi.
- [ ] Ghi lại phiên bản và ngày hoàn thành vào `CHANGELOG.md`.
- [ ] Quyết định kỹ thuật cốt lõi (nếu có) đã được lập file trong `docs/adr/NNNN-tieu-de.md`.
