"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  Sparkles,
  Heart,
  CheckCircle2,
  ShieldCheck,
  Smile,
  Store,
  ArrowRight,
  Shirt,
  Users,
  Star,
  Award,
} from "lucide-react";
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

export function AboutClientPage() {
  const t = useTranslations("about");

  const stats = [
    { number: t("stat1Number"), label: t("stat1Label"), icon: Shirt },
    { number: t("stat2Number"), label: t("stat2Label"), icon: Users },
    { number: t("stat3Number"), label: t("stat3Label"), icon: ShieldCheck },
    { number: t("stat4Number"), label: t("stat4Label"), icon: Star },
  ];

  const coreValues = [
    {
      title: t("value1Title"),
      desc: t("value1Desc"),
      icon: Award,
    },
    {
      title: t("value2Title"),
      desc: t("value2Desc"),
      icon: Sparkles,
    },
    {
      title: t("value3Title"),
      desc: t("value3Desc"),
      icon: ShieldCheck,
    },
    {
      title: t("value4Title"),
      desc: t("value4Desc"),
      icon: Heart,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-sand/20 text-ink">
      <Header activeHref="/gioi-thieu" />
      <main className="flex-1 py-8 md:py-12">
        <Container>
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={[{ label: t("breadcrumb") }]} />
        </div>

        {/* Hero Header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <Badge variant="outline" className="mb-3 px-3 py-1 font-medium tracking-wide bg-rose/30 border-rose text-burgundy">
            {t("badge")}
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-ink mb-4">
            {t("title")}
          </h1>
          <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center mb-16 md:mb-20">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-burgundy">
              {t("storyBadge")}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-ink">
              {t("storyTitle")}
            </h2>
            <p className="text-sm md:text-base text-ink-muted leading-relaxed">
              {t("storyP1")}
            </p>
            <p className="text-sm md:text-base text-ink-muted leading-relaxed">
              {t("storyP2")}
            </p>
          </div>

          <div className="lg:col-span-5">
            <Card className="border border-line/80 shadow-md bg-warm-white p-6 md:p-8">
              <h3 className="font-serif text-lg font-medium text-ink mb-6 text-center">
                Dấu Ấn Chickie Studio
              </h3>
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {stats.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <div key={idx} className="p-4 rounded-card bg-rose/10 text-center">
                      <Icon className="w-5 h-5 text-burgundy mx-auto mb-2" aria-hidden="true" />
                      <div className="font-serif text-2xl md:text-3xl font-bold text-burgundy">
                        {s.number}
                      </div>
                      <div className="text-xs text-ink-muted mt-1 leading-snug">
                        {s.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="mb-16 md:mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-ink mb-3">
              {t("valuesTitle")}
            </h2>
            <p className="text-sm md:text-base text-ink-muted leading-relaxed">
              {t("valuesSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <Card
                  key={idx}
                  className="border border-line/80 bg-warm-white hover:shadow-md transition-shadow duration-200"
                >
                  <CardHeader className="pb-2">
                    <div className="w-10 h-10 rounded-full bg-rose/30 flex items-center justify-center text-burgundy mb-2">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <CardTitle as="h3" className="text-base font-serif font-semibold text-ink">
                      {val.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs md:text-sm text-ink-muted leading-relaxed">
                      {val.desc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Showroom Space Section */}
        <Card className="border border-line/80 shadow-sm bg-warm-white p-6 md:p-10 mb-16 md:mb-20">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-14 h-14 rounded-2xl bg-burgundy/10 text-burgundy flex items-center justify-center shrink-0">
              <Store className="w-7 h-7" aria-hidden="true" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-serif text-xl md:text-2xl font-medium text-ink mb-2">
                {t("showroomTitle")}
              </h2>
              <p className="text-sm md:text-base text-ink-muted leading-relaxed">
                {t("showroomDesc")}
              </p>
            </div>
            <Link href="/lien-he">
              <Button variant="secondary" size="md" className="shrink-0 gap-2">
                <span>Chỉ đường tới showroom</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Bottom CTA Banner */}
        <div className="p-8 md:p-12 rounded-card bg-gradient-to-r from-burgundy to-burgundy/90 text-warm-white text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium mb-3">
            {t("ctaTitle")}
          </h2>
          <p className="text-sm md:text-base text-rose/80 max-w-xl mx-auto mb-8">
            {t("ctaDesc")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/products">
              <Button variant="primary" size="md" className="font-medium bg-warm-white text-burgundy hover:bg-ivory border-transparent">
                {t("ctaExplore")}
              </Button>
            </Link>
            <Link href="/lien-he">
              <Button variant="secondary" size="md" className="border-warm-white text-warm-white hover:bg-warm-white/10">
                {t("ctaContact")}
              </Button>
            </Link>
          </div>
        </div>
      </Container>
      </main>
      <Footer />
    </div>
  );
}
