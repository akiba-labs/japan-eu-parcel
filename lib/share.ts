import { KINDS, PAYMENTS, checkParcel, type Kind, type ParcelInput, type Payment } from "./euparcel";

export { PUBLIC_URL } from "./api";

type Params = URLSearchParams | Record<string, string | string[] | undefined>;
function one(p: Params, k: string): string | null {
  const v = p instanceof URLSearchParams ? p.get(k) : p[k];
  const f = Array.isArray(v) ? v[0] : v;
  return f === undefined || f === null || f === "" ? null : String(f);
}
const ISO = /^\d{4}-\d{2}-\d{2}$/;
function date(p: Params, k: string): string | null {
  const v = one(p, k);
  return v && ISO.test(v) ? v : null;
}
function oneOf<T extends string>(p: Params, k: string, allowed: readonly T[], fallback: T): T {
  const v = one(p, k);
  return v && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
}
function num(p: Params, k: string): number | null {
  const v = one(p, k);
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export type Shared = {
  country: string;
  kind: Kind;
  valueEUR: number;
  itemLines: number;
  ioss: boolean;
  payment: Payment | null;
  shipDate: string | null;
};

export const EXAMPLE_SHARED: Shared = { country: "FR", kind: "sale", valueEUR: 60, itemLines: 2, ioss: false, payment: null, shipDate: "2026-11-11" };
export const EXAMPLE_GERMANY: Shared = { ...EXAMPLE_SHARED, country: "DE", valueEUR: 40, itemLines: 1 };
export const EXAMPLE_IOSS: Shared = { ...EXAMPLE_SHARED, country: "IT", valueEUR: 120, itemLines: 3, ioss: true, payment: "ddp" };
export const EXAMPLE_GIFT: Shared = { ...EXAMPLE_SHARED, country: "DE", kind: "gift", valueEUR: 30, itemLines: 2 };
export const EXAMPLES = [EXAMPLE_SHARED, EXAMPLE_GERMANY, EXAMPLE_IOSS, EXAMPLE_GIFT];

export function parseShared(p: Params): Shared | null {
  const c = one(p, "c");
  const v = num(p, "v");
  if (!c || !/^[A-Za-z]{2}$/.test(c) || v === null) return null;
  const pay = one(p, "pay");
  return {
    country: c.toUpperCase(),
    kind: oneOf(p, "k", KINDS, "sale"),
    valueEUR: v,
    itemLines: Math.max(1, Math.min(99, Math.round(num(p, "n") ?? 1))),
    ioss: one(p, "i") === "1",
    payment: pay && (PAYMENTS as readonly string[]).includes(pay) ? (pay as Payment) : null,
    shipDate: date(p, "d"),
  };
}

export function sharedQuery(s: Shared): string {
  const q = new URLSearchParams();
  q.set("c", s.country);
  if (s.kind !== "sale") q.set("k", s.kind);
  q.set("v", String(s.valueEUR));
  if (s.itemLines !== 1) q.set("n", String(s.itemLines));
  if (s.ioss) q.set("i", "1");
  if (s.payment) q.set("pay", s.payment);
  if (s.shipDate) q.set("d", s.shipDate);
  return q.toString();
}

export function toCheckInput(s: Shared): ParcelInput {
  return { country: s.country, kind: s.kind, valueEUR: s.valueEUR, itemLines: s.itemLines, ioss: s.ioss, payment: s.payment, shipDate: s.shipDate };
}
export function safeCheck(s: Shared) {
  try {
    return checkParcel(toCheckInput(s));
  } catch {
    return null;
  }
}
export function resultPath(s: Shared): string {
  return `/r?${sharedQuery(s)}`;
}
export function ogPath(s: Shared): string {
  return `/og?${sharedQuery(s)}`;
}
export function isIndexable(s: Shared): boolean {
  return EXAMPLES.some((e) => resultPath(e) === resultPath(s));
}
