# 03 - Next.js App Router, Component & SEO (Client)

## 1. Quy Định Bắt Buộc

- **PHẢI** mặc định viết **Server Component** để tối ưu SSR, streaming và SEO.
- **CHỈ ĐƯỢC** khai báo `"use client"` ở component lá khi cần: `useState`, `useEffect`, event listeners (`onClick`, `onChange`), hoặc Web APIs.
- **KHÔNG ĐƯỢC** đánh dấu `"use client"` ở cấp page hoặc layout cha nếu bên trong có thể chia nhỏ thành Server Component.
- **KHÔNG ĐƯỢC** gọi `fetch()` rải rác trực tiếp trong UI; **PHẢI** gọi qua các hàm chuẩn tại `src/lib/api`.
- **PHẢI** xuất `generateMetadata` hoặc `metadata` trên mọi trang (`page.tsx`) cho SEO (title, description, openGraph).
- **PHẢI** dùng component `next/image` có thuộc tính `alt`, `width`, `height` rõ ràng; **KHÔNG ĐƯỢC** dùng thẻ `<img>` trần.
- **PHẢI** gán thuộc tính `lang` trong thẻ `<html>` động theo locale người dùng đang xem.

---

## 2. Ví Dụ Cụ Thể

### Phân Tách Server Component vs Client Component
```tsx
// ❌ SAI: Đánh dấu cả trang là Client Component chỉ để bắt click nút
"use client";
export default async function ProductDetailPage({ params }: PageProps) {
  const product = await fetch(`/api/products/${params.id}`).then(r => r.json());
  return <div><h1>{product.name}</h1><button onClick={...}>Thuê</button></div>;
}

// ✅ ĐÚNG: Page là Server Component, đẩy nút bấm thành Client Component lá
// app/[locale]/products/[id]/page.tsx (Server Component)
import { getProductById } from "@/lib/api/products";
import { RentButton } from "./rent-button"; // có 'use client'

export async function generateMetadata({ params }: PageProps) {
  const product = await getProductById(params.id);
  return { title: `${product.name} | Chickie Studio`, description: product.shortDesc };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProductById(params.id);
  return (
    <main>
      <h1>{product.name}</h1>
      <RentButton productId={product.id} />
    </main>
  );
}
```

### Next/Image Chuẩn SEO & Performance
```tsx
// ❌ SAI: Dùng thẻ img không tối ưu kích thước và layout shift
<img src={dress.imageUrl} />

// ✅ ĐÚNG: Dùng Image của Next.js với alt và kích thước rõ ràng
import Image from "next/image";
<Image
  src={dress.imageUrl}
  alt={dress.name}
  width={400}
  height={600}
  className="object-cover rounded-md"
  priority={isHeroImage}
/>
```
