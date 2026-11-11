export const SITE_NAME = "Japan EU Parcel Check";

export const SITE_TAGLINE =
  "Sending a parcel from Japan to the EU? See whether Japan Post accepts it (Germany refuses online-sale mail from 9 Nov 2026), which route works for your country (IOSS + DDP, IOSS + DAP, no IOSS), the €3 duty + €2 fee per item, the PID rule and gift limits.";

export const DISCLAIMER_SHORT =
  "Educational checklist, not customs, tax or legal advice; not affiliated with Japan Post, Zonos, the European Commission or any customs authority. Conditions change often; Japan Post and destination customs decide. Check Japan Post's country conditions and the counter before you send.";

export const HONESTY =
  "Rules as of 2026-11-11 from Japan Post's 2026-11-09 EU notice (続報6), its 2026-11-04 country-conditions change, the UGX notice and the European Commission's guidance (version 5 Oct 2026). It does not compute VAT, courier or Zonos fees, or normal duty rates.";

export const SIBLING_TOOLS = [
  { href: "https://japan-intl-postage.vercel.app", label: "Japan Postage Calculator" },
  { href: "https://japan-customs-allowance.vercel.app", label: "Japan Customs Allowance" },
  { href: "https://japan-tax-free-refund.vercel.app", label: "Japan Tax-Free Refund" },
  { href: "https://japan-graduate-visa.vercel.app", label: "Japan Graduate Visa Check" },
  { href: "https://japan-visa-renewal.vercel.app", label: "Japan Visa Renewal Window Check" },
  { href: "https://japan-jlpt-check.vercel.app", label: "Japan JLPT Level Check" },
  { href: "https://japan-job-loss.vercel.app", label: "Japan Job Loss Check" },
  { href: "https://japan-medical-cost-cap.vercel.app", label: "Japan High-Cost Medical Expense Check" },
  { href: "https://japan-lost-item.vercel.app", label: "Japan Lost Item Check" },
  { href: "https://japan-leaving-tax.vercel.app", label: "Japan Leaving Tax Check" },
  { href: "https://japan-disaster-prep.vercel.app", label: "Japan Disaster Prep Check" },
  { href: "https://japan-parttime-check.vercel.app", label: "Japan Part-time Work Check" },
  { href: "https://japan-reentry-check.vercel.app", label: "Japan Re-entry Deadline Check" },
  { href: "https://japan-visa-fee.vercel.app", label: "Japan Visa Fee Calculator" },
  { href: "https://japan-pr-check.vercel.app", label: "Japan PR Guideline Check" },
  { href: "https://japan-hsp-points.vercel.app", label: "Japan HSP Points Calculator" },
  { href: "https://japan-mynumber-card-check.vercel.app", label: "Japan My Number Card Check" },
  { href: "https://japan-pet-quarantine.vercel.app", label: "Japan Pet Quarantine Check" },
  { href: "https://japan-overseas-dependents.vercel.app", label: "Japan Overseas Dependents Check" },
  { href: "https://japan-driving-check.vercel.app", label: "Japan Driving Check" },
  { href: "https://japan-tb-screening.vercel.app", label: "Japan TB Screening Check" },
  { href: "https://japan-luggage.vercel.app", label: "Japan Luggage Check" },
  { href: "https://japan-alert-decoder.vercel.app", label: "Japan Alert Decoder" },
  { href: "https://japan-dual-pricing.vercel.app", label: "Japan Dual Pricing Check" },
  { href: "https://kyushu-travel-discount.vercel.app", label: "Kyushu Travel Discount" },
  { href: "https://house-rules-check.vercel.app", label: "House Rules Check" },
  { href: "https://japan-trip-brain.vercel.app", label: "Japan Trip Brain" },
  { href: "https://free-agent-tools.vercel.app", label: "Free Agent Tools MCP" },
] as const;

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${production.replace(/^https?:\/\//, "")}`;
  return "https://japan-eu-parcel.vercel.app";
}
