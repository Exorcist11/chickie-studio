"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Building,
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
  TextField,
  Textarea,
  notify,
} from "@/components/ui";

export function ContactClientPage() {
  const t = useTranslations("contact");

  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [service, setService] = React.useState("dress");
  const [message, setMessage] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên của bạn";
    }
    const cleanPhone = phone.trim().replace(/\s/g, "");
    if (!cleanPhone) {
      newErrors.phone = "Vui lòng nhập số điện thoại liên hệ";
    } else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(cleanPhone)) {
      newErrors.phone = "Số điện thoại không đúng định dạng";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Giả lập gửi thông tin liên hệ
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      notify.success("Chickie Studio đã nhận được lời nhắn của bạn!");
    }, 400);
  };

  const handleReset = () => {
    setFullName("");
    setPhone("");
    setEmail("");
    setMessage("");
    setErrors({});
    setIsSubmitted(false);
  };

  const googleMapsUrl =
    "https://maps.google.com/?q=Số+12+ngõ+80+Chùa+Láng+Láng+Thượng+Đống+Đa+Hà+Nội";

  return (
    <div className="min-h-screen bg-sand/20 py-8 md:py-12">
      <Container>
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={[{ label: t("breadcrumb") }]} />
        </div>

        {/* Hero Header */}
        <div className="max-w-3xl mb-10 md:mb-14">
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

        {/* 2-Column Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Showroom Info & Map (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border border-line/80 shadow-sm bg-warm-white">
              <CardHeader className="pb-3 border-b border-line/60">
                <CardTitle as="h2" className="text-xl font-serif font-medium text-ink flex items-center gap-2">
                  <Building className="w-5 h-5 text-burgundy" aria-hidden="true" />
                  <span>{t("infoTitle")}</span>
                </CardTitle>
                <p className="text-xs md:text-sm text-ink-muted mt-1">
                  {t("infoDesc")}
                </p>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-rose/20 text-burgundy shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs text-ink-muted block font-medium">
                      {t("addressLabel")}
                    </span>
                    <p className="text-sm text-ink font-semibold mt-0.5">
                      {t("addressValue")}
                    </p>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-rose/20 text-burgundy shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs text-ink-muted block font-medium">
                      {t("hoursLabel")}
                    </span>
                    <p className="text-sm text-ink font-semibold mt-0.5">
                      {t("hoursValue")}
                    </p>
                  </div>
                </div>

                {/* Hotline */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-rose/20 text-burgundy shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs text-ink-muted block font-medium">
                      {t("hotlineLabel")}
                    </span>
                    <a
                      href="tel:0987654321"
                      className="text-sm font-semibold text-burgundy hover:underline mt-0.5 block"
                    >
                      {t("hotlineValue")}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-rose/20 text-burgundy shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs text-ink-muted block font-medium">
                      {t("emailLabel")}
                    </span>
                    <a
                      href="mailto:contact@chickiestudio.vn"
                      className="text-sm font-semibold text-ink hover:text-burgundy hover:underline mt-0.5 block"
                    >
                      {t("emailValue")}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google Maps Card */}
            <Card className="border border-line/80 shadow-sm bg-warm-white overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle as="h3" className="text-base font-serif font-semibold text-ink">
                  {t("mapTitle")}
                </CardTitle>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {t("mapDesc")}
                </p>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="p-4 rounded-card bg-cream/50 border border-line/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-ink">Chickie Studio Chùa Láng</div>
                      <div className="text-xs text-ink-muted">Cách ĐH Ngoại Thương 200m</div>
                    </div>
                  </div>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <Button variant="secondary" size="sm" className="w-full gap-2">
                      <span>{t("openGoogleMaps")}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Message Form (Right 7 Cols) */}
          <div className="lg:col-span-7">
            <Card className="border border-line/80 shadow-sm bg-warm-white">
              <CardHeader className="border-b border-line/60 pb-4">
                <CardTitle as="h2" className="text-xl md:text-2xl font-serif font-medium text-ink">
                  {t("formTitle")}
                </CardTitle>
                <p className="text-xs md:text-sm text-ink-muted mt-1 leading-relaxed">
                  {t("formDesc")}
                </p>
              </CardHeader>

              <CardContent className="p-6">
                {isSubmitted ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
                    </div>
                    <h3 className="font-serif text-xl font-medium text-ink">
                      {t("successAlertTitle")}
                    </h3>
                    <p className="text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
                      {t("successAlertDesc")}
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleReset}
                      className="mt-4"
                    >
                      {t("sendAnother")}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <TextField
                        id="fullName"
                        label={t("nameLabel")}
                        required
                        type="text"
                        placeholder={t("namePlaceholder")}
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) {
                            setErrors((prev) => ({ ...prev, fullName: "" }));
                          }
                        }}
                        error={errors.fullName}
                      />

                      {/* Phone Number */}
                      <TextField
                        id="phone"
                        label={t("phoneLabel")}
                        required
                        type="tel"
                        inputMode="tel"
                        placeholder={t("phonePlaceholder")}
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) {
                            setErrors((prev) => ({ ...prev, phone: "" }));
                          }
                        }}
                        error={errors.phone}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Email */}
                      <TextField
                        id="email"
                        label={t("emailLabel")}
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />

                      {/* Service */}
                      <div className="w-full flex flex-col gap-1.5 text-left">
                        <label
                          htmlFor="service"
                          className="block text-sm font-medium text-ink cursor-pointer"
                        >
                          {t("serviceLabel")}
                        </label>
                        <select
                          id="service"
                          value={service}
                          onChange={(e) => setService(e.target.value)}
                          className="w-full h-10 px-3 py-2 rounded-md border border-line bg-warm-white text-ink text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
                        >
                          <option value="dress">{t("serviceDress")}</option>
                          <option value="camera">{t("serviceCamera")}</option>
                          <option value="combo">{t("serviceCombo")}</option>
                          <option value="other">{t("serviceOther")}</option>
                        </select>
                      </div>
                    </div>

                    {/* Message Textarea */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-xs font-medium text-ink mb-1.5"
                      >
                        {t("messageLabel")}
                      </label>
                      <Textarea
                        id="message"
                        rows={4}
                        placeholder={t("messagePlaceholder")}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="bg-warm-white resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto gap-2"
                      >
                        <Send className="w-4 h-4" aria-hidden="true" />
                        <span>{isSubmitting ? t("submitting") : t("submitBtn")}</span>
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
