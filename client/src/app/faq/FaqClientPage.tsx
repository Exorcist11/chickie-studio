"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Search, HelpCircle, Phone, MessageCircle, Sparkles } from "lucide-react";
import {
  Container,
  Breadcrumbs,
  Badge,
  Card,
  CardContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Button,
  TextField,
} from "@/components/ui";

type FaqCategory = "all" | "process" | "fitting" | "care" | "payment";

interface FaqItemData {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
}

export function FaqClientPage() {
  const t = useTranslations("faqPage");

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<FaqCategory>("all");

  const faqItems: FaqItemData[] = React.useMemo(
    () => [
      {
        id: "faq-1",
        category: "care",
        question: "Tôi có cần tự giặt hấp trang phục trước khi trả lại tiệm không?",
        answer:
          "Hoàn toàn không cần! Chickie Studio đã bao gồm chi phí giặt hấp cao cấp chuyên nghiệp và sấy khử khuẩn UV trong mỗi lượt thuê. Bạn chỉ cần giữ gìn cẩn thận và trả lại đồ theo đúng hẹn.",
      },
      {
        id: "faq-2",
        category: "fitting",
        question: "Chickie Studio có hỗ trợ đến thử đồ trực tiếp tại showroom không?",
        answer:
          "Có, tiệm luôn mở cửa đón bạn thử đồ từ 08:30 đến 21:30 hàng ngày tại số 12 ngõ 80 Chùa Láng, Đống Đa, Hà Nội. Tiệm có 3 phòng thử đồ riêng tư, gương toàn thân ánh sáng chuẩn studio và chuyên viên hỗ trợ kẹp form, chỉnh dáng.",
      },
      {
        id: "faq-3",
        category: "payment",
        question: "Thủ tục đặt cọc giữ đồ diễn ra như thế nào và bao lâu thì nhận lại tiền cọc?",
        answer:
          "Bạn chỉ cần cọc từ 50% đến 100% giá trị váy qua chuyển khoản/tiền mặt, hoặc xuất trình CCCD gốc/thẻ sinh viên tại tiệm. Tiệm sẽ chuyển khoản hoàn cọc 100% trong vòng 1-2 giờ làm việc sau khi nhận lại đồ và kiểm tra hiện trạng.",
      },
      {
        id: "faq-4",
        category: "fitting",
        question: "Nếu trang phục giao đến bị rộng hoặc chật so với số đo thì xử lý thế nào?",
        answer:
          "Chickie hỗ trợ đổi size hoặc đổi sang mẫu khác có sẵn trong vòng 4 tiếng kể từ khi nhận đồ tại khu vực nội thành Hà Nội. Khách hàng chỉ cần chịu chi phí ship phát sinh nếu có.",
      },
      {
        id: "faq-5",
        category: "process",
        question: "Tiệm có cho thuê kèm phụ kiện (nơ, túi, trang sức) và máy ảnh không?",
        answer:
          "Có, chúng mình có trọn bộ phụ kiện chụp ảnh (nơ tóc, găng tay ren, giỏ hoa, vòng ngọc) và combo máy ảnh du lịch Sony, Canon, Fujifilm với mức giá ưu đãi giảm đến 20% khi thuê cùng váy.",
      },
      {
        id: "faq-6",
        category: "process",
        question: "Tôi có thể thuê đồ mang đi chụp kỷ yếu ở tỉnh hoặc đi du lịch dài ngày không?",
        answer:
          "Hoàn toàn được! Chickie áp dụng chính sách ưu đãi ngày thuê dài hạn: Từ ngày thuê thứ 2 trở đi, giá thuê chỉ tính bằng 50% so với ngày đầu tiên để bạn thoải mái vi vu du lịch.",
      },
      {
        id: "faq-7",
        category: "process",
        question: "Nếu thời tiết mưa bão làm hoãn buổi chụp, tiệm có cho dời ngày không?",
        answer:
          "Có! Nếu bạn thông báo trước ít nhất 24 giờ do sự cố thời tiết xấu, Chickie sẽ hỗ trợ dời ngày thuê miễn phí hoặc bảo lưu toàn bộ số tiền cọc thành voucher trong 60 ngày tiếp theo.",
      },
      {
        id: "faq-8",
        category: "fitting",
        question: "Chickie có hỗ trợ giao nhận đồ hỏa tốc tận nhà không?",
        answer:
          "Có! Tiệm liên kết với dịch vụ giao hàng hỏa tốc Grab/Ahamove nội thành Hà Nội (giao nhận trong 1-2 tiếng) và gửi chuyển phát nhanh bảo đảm cho các bạn ở tỉnh xa.",
      },
    ],
    []
  );

  const categories: { key: FaqCategory; label: string }[] = [
    { key: "all", label: t("categoryAll") },
    { key: "process", label: t("categoryProcess") },
    { key: "fitting", label: t("categoryFitting") },
    { key: "care", label: t("categoryCare") },
    { key: "payment", label: t("categoryPayment") },
  ];

  const filteredFaqs = React.useMemo(() => {
    return faqItems.filter((item) => {
      const matchCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchQuery =
        searchQuery.trim() === "" ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [faqItems, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-sand/20 py-8 md:py-12">
      <Container>
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={[{ label: t("breadcrumb") }]} />
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <Badge variant="outline" className="mb-3 px-3 py-1 font-medium tracking-wide bg-rose/30 border-rose text-burgundy">
            {t("badge")}
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-ink mb-4">
            {t("title")}
          </h1>
          <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
            {t("subtitle")}
          </p>

          {/* Search Box */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <TextField
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-warm-white pl-11 pr-4 py-3 text-sm md:text-base shadow-sm border-line rounded-card focus-visible:ring-burgundy"
            />
            <Search className="w-5 h-5 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-8 md:mb-12">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-burgundy text-warm-white shadow-sm"
                    : "bg-warm-white text-ink-muted hover:text-ink hover:bg-rose/20 border border-line/60"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-3xl mx-auto">
          {filteredFaqs.length > 0 ? (
            <Card className="border border-line/80 shadow-sm bg-warm-white p-4 md:p-6">
              <CardContent className="p-0">
                <Accordion type="single" collapsible defaultValue={filteredFaqs[0].id}>
                  {filteredFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-sm md:text-base font-serif">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-xs md:text-sm text-ink-muted leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-line/80 shadow-sm bg-warm-white text-center p-8 md:p-12">
              <HelpCircle className="w-10 h-10 text-ink-muted/50 mx-auto mb-3" aria-hidden="true" />
              <p className="text-sm md:text-base text-ink-muted">
                {t("emptySearch")}
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Xóa bộ lọc tìm kiếm
              </Button>
            </Card>
          )}

          {/* Bottom Contact Help */}
          <div className="mt-12 p-6 md:p-8 rounded-card border border-rose/30 bg-rose/15 text-center">
            <Sparkles className="w-6 h-6 text-burgundy mx-auto mb-2" aria-hidden="true" />
            <h2 className="font-serif text-lg md:text-xl font-medium text-ink mb-1">
              {t("stillHaveQuestions")}
            </h2>
            <p className="text-xs md:text-sm text-ink-muted max-w-lg mx-auto mb-6">
              {t("contactSupport")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="tel:0987654321">
                <Button variant="primary" size="sm" className="gap-2">
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  <span>Gọi Hotline 0987.654.321</span>
                </Button>
              </a>
              <a href="https://zalo.me" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm" className="gap-2 bg-warm-white">
                  <MessageCircle className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  <span>Chat Zalo tư vấn ngay</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
