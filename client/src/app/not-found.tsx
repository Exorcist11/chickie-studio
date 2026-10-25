import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <span className="font-serif text-6xl md:text-8xl font-bold text-burgundy/20 tracking-wider">
        404
      </span>
      <h1 className="font-serif text-2xl md:text-3xl font-semibold text-ink mt-2 mb-3">
        Không tìm thấy trang
      </h1>
      <p className="text-sm md:text-base text-ink-muted max-w-md mb-8 leading-relaxed">
        Trang bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc đường dẫn đã thay đổi.
      </p>
      <Link href="/">
        <Button variant="primary" size="md">
          Về trang chủ
        </Button>
      </Link>
    </div>
  );
}
