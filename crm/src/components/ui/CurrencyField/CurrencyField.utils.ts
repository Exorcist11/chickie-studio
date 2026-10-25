export function formatCurrencyVND(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === "") return "";
  const num = typeof val === "string" ? parseInt(val.replace(/\D/g, ""), 10) : Math.round(val);
  if (isNaN(num)) return "";
  return new Intl.NumberFormat("vi-VN").format(num);
}

export function parseCurrencyVND(val: string): number {
  const digits = val.replace(/\D/g, "");
  if (!digits) return 0;
  return parseInt(digits, 10);
}
