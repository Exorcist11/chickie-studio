"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  ShieldCheck,
  Sparkles,
  Clock,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
  Container,
  Breadcrumbs,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Header,
  Footer,
} from "@/components/ui";

export function PolicyClientPage() {
  const t = useTranslations("policy");

  const sections = [
    { id: "deposit", label: t("deposit.title"), icon: ShieldCheck },
    { id: "care", label: t("care.title"), icon: Sparkles },
    { id: "late", label: t("late.title"), icon: Clock },
    { id: "damage", label: t("damage.title"), icon: AlertTriangle },
    { id: "cancellation", label: t("cancellation.title"), icon: Calendar },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-sand/20 text-ink">
      <Header activeHref="/chinh-sach-thue-do" />
      <main className="flex-1 py-8 md:py-12">
        <Container>
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={[{ label: t("breadcrumb") }]} />
        </div>

        {/* Hero Header */}
        <div className="max-w-3xl mb-10 md:mb-14">
          <Badge variant="accent" className="mb-3 px-3 py-1 font-medium tracking-wide">
            {t("badge")}
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-ink mb-4">
            {t("title")}
          </h1>
          <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Sidebar Sticky TOC (Desktop) */}
          <aside className="lg:col-span-4 sticky top-24 hidden lg:block">
            <Card className="border border-line/80 shadow-sm bg-warm-white">
              <CardHeader className="pb-3 border-b border-line/60">
                <CardTitle as="h2" className="text-base font-serif font-semibold text-ink">
                  {t("tocTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <nav className="flex flex-col space-y-1" aria-label="Policy Table of Contents">
                  {sections.map((sec) => {
                    const Icon = sec.icon;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => scrollTo(sec.id)}
                        className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-card text-xs md:text-sm text-ink-muted hover:text-burgundy hover:bg-rose/15 transition-colors cursor-pointer"
                      >
                        <Icon className="w-4 h-4 text-burgundy shrink-0" aria-hidden="true" />
                        <span className="truncate">{sec.label}</span>
                      </button>
                    );
                  })}
                </nav>

                <div className="mt-6 pt-4 border-t border-line/60 px-3">
                  <div className="flex items-center gap-2 text-xs text-ink-muted mb-2">
                    <HelpCircle className="w-3.5 h-3.5 text-gold" />
                    <span>Cần giải đáp thêm?</span>
                  </div>
                  <Link href="/faq">
                    <Button variant="secondary" size="sm" className="w-full text-xs">
                      Xem câu hỏi thường gặp FAQ
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-8 flex flex-col space-y-10 md:space-y-12">
            {/* Section 1: Deposit */}
            <section id="deposit" className="scroll-mt-24">
              <Card className="border border-line/80 shadow-sm bg-warm-white">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-rose/30 text-burgundy">
                      <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <CardTitle as="h2" className="text-xl md:text-2xl font-serif font-medium text-ink">
                      {t("deposit.title")}
                    </CardTitle>
                  </div>
                  <p className="text-sm text-ink-muted mt-2 leading-relaxed">
                    {t("deposit.desc")}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-card bg-cream/40 border border-line/60">
                      <span className="text-xs uppercase tracking-wider font-semibold text-burgundy block mb-1">
                        Hình thức 1
                      </span>
                      <h3 className="text-sm font-semibold text-ink mb-1">
                        {t("deposit.option1Title")}
                      </h3>
                      <p className="text-xs text-ink-muted leading-relaxed">
                        {t("deposit.option1Desc")}
                      </p>
                    </div>

                    <div className="p-4 rounded-card bg-cream/40 border border-line/60">
                      <span className="text-xs uppercase tracking-wider font-semibold text-burgundy block mb-1">
                        Hình thức 2
                      </span>
                      <h3 className="text-sm font-semibold text-ink mb-1">
                        {t("deposit.option2Title")}
                      </h3>
                      <p className="text-xs text-ink-muted leading-relaxed">
                        {t("deposit.option2Desc")}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-card bg-rose/15 border border-rose/30 flex items-start gap-3 mt-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <h4 className="text-sm font-semibold text-ink">
                        {t("deposit.refundTitle")}
                      </h4>
                      <p className="text-xs text-ink-muted leading-relaxed mt-0.5">
                        {t("deposit.refundDesc")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section 2: Care */}
            <section id="care" className="scroll-mt-24">
              <Card className="border border-line/80 shadow-sm bg-warm-white">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-rose/30 text-burgundy">
                      <Sparkles className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <CardTitle as="h2" className="text-xl md:text-2xl font-serif font-medium text-ink">
                      {t("care.title")}
                    </CardTitle>
                  </div>
                  <p className="text-sm text-ink-muted mt-2 leading-relaxed">
                    {t("care.desc")}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="p-4 rounded-card border border-rose/30 bg-rose/10">
                    <h3 className="text-sm font-semibold text-burgundy flex items-center gap-2 mb-3">
                      <XCircle className="w-4 h-4 text-burgundy" aria-hidden="true" />
                      {t("care.dontTitle")}
                    </h3>
                    <ul className="space-y-2 text-xs md:text-sm text-ink-muted">
                      <li className="flex items-start gap-2">
                        <span className="text-burgundy font-bold">•</span>
                        <span>{t("care.dont1")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-burgundy font-bold">•</span>
                        <span>{t("care.dont2")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-burgundy font-bold">•</span>
                        <span>{t("care.dont3")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-burgundy font-bold">•</span>
                        <span>{t("care.dont4")}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-card bg-emerald-50 border border-emerald-200/80">
                    <h3 className="text-sm font-semibold text-emerald-800 flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                      {t("care.doTitle")}
                    </h3>
                    <p className="text-xs md:text-sm text-emerald-900/80 leading-relaxed">
                      {t("care.doDesc")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section 3: Late */}
            <section id="late" className="scroll-mt-24">
              <Card className="border border-line/80 shadow-sm bg-warm-white">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-rose/30 text-burgundy">
                      <Clock className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <CardTitle as="h2" className="text-xl md:text-2xl font-serif font-medium text-ink">
                      {t("late.title")}
                    </CardTitle>
                  </div>
                  <p className="text-sm text-ink-muted mt-2 leading-relaxed">
                    {t("late.desc")}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-card bg-amber-50/70 border border-amber-200">
                      <h3 className="text-sm font-semibold text-amber-900 mb-1">
                        {t("late.rule1Title")}
                      </h3>
                      <p className="text-xs text-amber-800/90 leading-relaxed">
                        {t("late.rule1Desc")}
                      </p>
                    </div>

                    <div className="p-4 rounded-card bg-rose/20 border border-rose/30">
                      <h3 className="text-sm font-semibold text-burgundy mb-1">
                        {t("late.rule2Title")}
                      </h3>
                      <p className="text-xs text-ink-muted leading-relaxed">
                        {t("late.rule2Desc")}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-ink-muted italic border-l-2 border-burgundy pl-3 py-1">
                    {t("late.notice")}
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Section 4: Damage */}
            <section id="damage" className="scroll-mt-24">
              <Card className="border border-line/80 shadow-sm bg-warm-white">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-rose/30 text-burgundy">
                      <AlertTriangle className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <CardTitle as="h2" className="text-xl md:text-2xl font-serif font-medium text-ink">
                      {t("damage.title")}
                    </CardTitle>
                  </div>
                  <p className="text-sm text-ink-muted mt-2 leading-relaxed">
                    {t("damage.desc")}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="overflow-x-auto rounded-card border border-line/70">
                    <table className="w-full text-left text-xs md:text-sm">
                      <thead className="bg-sand/30 text-ink font-serif border-b border-line/70">
                        <tr>
                          <th className="p-3 md:p-4 font-semibold">{t("damage.tableType")}</th>
                          <th className="p-3 md:p-4 font-semibold">{t("damage.tableImpact")}</th>
                          <th className="p-3 md:p-4 font-semibold text-right">{t("damage.tableFee")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line/60">
                        <tr className="hover:bg-sand/10 transition-colors">
                          <td className="p-3 md:p-4 text-ink font-medium">{t("damage.row1Type")}</td>
                          <td className="p-3 md:p-4 text-ink-muted">{t("damage.row1Impact")}</td>
                          <td className="p-3 md:p-4 text-right font-semibold text-emerald-700">{t("damage.row1Fee")}</td>
                        </tr>
                        <tr className="hover:bg-sand/10 transition-colors">
                          <td className="p-3 md:p-4 text-ink font-medium">{t("damage.row2Type")}</td>
                          <td className="p-3 md:p-4 text-ink-muted">{t("damage.row2Impact")}</td>
                          <td className="p-3 md:p-4 text-right font-semibold text-amber-700">{t("damage.row2Fee")}</td>
                        </tr>
                        <tr className="hover:bg-sand/10 transition-colors">
                          <td className="p-3 md:p-4 text-ink font-medium">{t("damage.row3Type")}</td>
                          <td className="p-3 md:p-4 text-ink-muted">{t("damage.row3Impact")}</td>
                          <td className="p-3 md:p-4 text-right font-semibold text-amber-800">{t("damage.row3Fee")}</td>
                        </tr>
                        <tr className="hover:bg-sand/10 transition-colors">
                          <td className="p-3 md:p-4 text-ink font-medium">{t("damage.row4Type")}</td>
                          <td className="p-3 md:p-4 text-ink-muted">{t("damage.row4Impact")}</td>
                          <td className="p-3 md:p-4 text-right font-semibold text-rose-700">{t("damage.row4Fee")}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section 5: Cancellation */}
            <section id="cancellation" className="scroll-mt-24">
              <Card className="border border-line/80 shadow-sm bg-warm-white">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-rose/30 text-burgundy">
                      <Calendar className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <CardTitle as="h2" className="text-xl md:text-2xl font-serif font-medium text-ink">
                      {t("cancellation.title")}
                    </CardTitle>
                  </div>
                  <p className="text-sm text-ink-muted mt-2 leading-relaxed">
                    {t("cancellation.desc")}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="p-3 rounded-card bg-sand/30 border border-line/60 text-xs md:text-sm text-ink-muted">
                    <strong className="text-ink font-semibold">{t("cancellation.freeChange")}</strong>
                  </div>
                  <div className="p-3 rounded-card bg-sand/30 border border-line/60 text-xs md:text-sm text-ink-muted">
                    <strong className="text-ink font-semibold">{t("cancellation.cancelBefore48h")}</strong>
                  </div>
                  <div className="p-3 rounded-card bg-sand/30 border border-line/60 text-xs md:text-sm text-ink-muted">
                    <strong className="text-ink font-semibold">{t("cancellation.cancelWithin48h")}</strong>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Bottom Help Banner */}
            <div className="p-6 md:p-8 rounded-card bg-gradient-to-r from-burgundy/90 to-burgundy text-warm-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg md:text-xl font-medium">Bạn cần trợ giúp thêm về đơn hàng?</h3>
                <p className="text-xs md:text-sm text-rose/80 mt-1">Liên hệ chuyên viên tư vấn để nhận phản hồi ngay trong 15 phút</p>
              </div>
              <Link href="/lien-he">
                <Button variant="secondary" size="md" className="shrink-0 group">
                  <span>Liên hệ tư vấn</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </main>
    <Footer />
  </div>
);
}
