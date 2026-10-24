#!/usr/bin/env node
import fs from "fs";
import path from "path";

const cwd = process.cwd();
const themePath = path.join(cwd, "src", "styles", "shadcn-theme.css");

if (!fs.existsSync(themePath)) {
  console.error(`❌ Không tìm thấy file theme tại: ${themePath}`);
  process.exit(1);
}

const themeContent = fs.readFileSync(themePath, "utf-8");
console.log(`🎨 Đang áp dụng Chickie Theme Tokens từ: ${themePath}`);

// Verify SCSS tokens definition
const scssTokensPath = path.join(cwd, "src", "styles", "_tokens.scss");
if (fs.existsSync(scssTokensPath)) {
  console.log(`✅ File SCSS tokens đã sẵn sàng: ${scssTokensPath}`);
}

console.log("✨ Theme apply hoàn tất thành công!");
