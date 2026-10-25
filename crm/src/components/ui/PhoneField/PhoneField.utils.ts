export function formatPhoneNumberVN(val: string | undefined | null): string {
  if (!val) return "";
  const digits = val.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

export function cleanPhoneNumber(val: string): string {
  return val.replace(/\D/g, "").slice(0, 10);
}

export function isValidVietnamesePhone(phone: string): boolean {
  const cleaned = cleanPhoneNumber(phone);
  return /^(03|05|07|08|09)\d{8}$/.test(cleaned);
}
