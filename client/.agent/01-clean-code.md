# 01 - Clean Code Rules (Client)

## 1. Quy Định Bắt Buộc

- **PHẢI** bật TypeScript strict; **KHÔNG ĐƯỢC** dùng kiểu `any`, `unknown` không kiểm tra, hoặc `@ts-ignore`.
- **PHẢI** áp dụng nguyên tắc: một file chỉ chứa một component chính duy nhất.
- **PHẢI** định nghĩa interface/type tường minh cho `Props` của mọi component.
- **PHẢI** tách toàn bộ state phức tạp và logic tính toán ra custom hook (`useXxx`).
- **KHÔNG ĐƯỢC** để magic number/string trong code; **PHẢI** khai báo constant rõ nghĩa.
- **KHÔNG ĐƯỢC** để code thừa, biến không dùng, `console.log` sau khi debug.
- Chỉ comment tiếng Việt giải thích lý do (Why) cho logic nghiệp vụ phức tạp; **KHÔNG ĐƯỢC** comment mô tả lại code hiển nhiên.

---

## 2. Ví Dụ Cụ Thể

### TypeScript & Props
```tsx
// ❌ SAI: Dùng any, inline props, gom logic vào UI
export default function Card(props: any) {
  const isVip = props.total > 5000000; // magic number
  return <div>{props.name}</div>;
}

// ✅ ĐÚNG: Type rõ ràng, hằng số nghiệp vụ, tách bạch
interface ProductCardProps {
  name: string;
  price: number;
  discountPercent?: number;
}

const VIP_ORDER_THRESHOLD_VND = 5_000_000;

export function ProductCard({ name, price, discountPercent = 0 }: ProductCardProps) {
  // Logic hiển thị rõ ràng, không any
  return <div>{/* UI component */}</div>;
}
```

### Tách Logic Ra Custom Hook
```tsx
// ❌ SAI: Trộn lẫn fetching, state lọc, pagination trong component giao diện
export function BookingList() {
  const [date, setDate] = useState();
  // 50 dòng logic tính toán slot còn trống...
  return <div>...</div>;
}

// ✅ ĐÚNG: Tách logic nghiệp vụ sang hook riêng
export function BookingList() {
  const { availableSlots, isLoading, selectSlot } = useBookingAvailability();
  if (isLoading) return <LoadingSpinner />;
  return <SlotGrid slots={availableSlots} onSelect={selectSlot} />;
}
```
