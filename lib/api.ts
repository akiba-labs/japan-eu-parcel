import { InputError, type Endpoint, type Input } from "./agent-api";
import { DISCLAIMER, KINDS, PAYMENTS, RULES_AS_OF, RuleInputError, checkParcel, type Kind, type Payment } from "./euparcel";
import { SITE_NAME, SITE_TAGLINE } from "./site";

export const PUBLIC_URL = "https://japan-eu-parcel.vercel.app";
export const API_DISCLAIMER = DISCLAIMER;
export const API_INFO = { title: `${SITE_NAME} API`, description: SITE_TAGLINE, version: "1.0.0" };

export const EXAMPLE_GET = "/api/check?country=FR&kind=sale&valueEUR=60&itemLines=2";

function first(v: unknown): unknown {
  return Array.isArray(v) ? v[0] : v;
}
function s(v: unknown): string | null {
  const f = first(v);
  return f === undefined || f === null || String(f).trim() === "" ? null : String(f).trim();
}
function n(v: unknown, name: string): number | null {
  const f = s(v);
  if (f === null) return null;
  const x = Number(f.replace(/[,_\s€¥円]/g, "").replace(/(eur|euro|euros|ユーロ|jpy|yen)$/i, ""));
  if (!Number.isFinite(x)) throw new InputError(`${name} must be a number`);
  return x;
}
function tb(v: unknown, name: string): boolean | undefined {
  const f = first(v);
  if (typeof f === "boolean") return f;
  if (f === undefined || f === null || String(f).trim() === "") return undefined;
  const t = String(f).trim();
  if (/^(1|true|yes|y|on|はい|あり|有)$/i.test(t)) return true;
  if (/^(0|false|no|n|off|いいえ|なし|無)$/i.test(t)) return false;
  throw new InputError(`${name} must be true or false`);
}

const KIND_ALIASES: Record<string, Kind> = {
  b2c: "sale", online_sale: "sale", sold: "sale", sell: "sale", order: "sale", ecommerce: "sale", "e-commerce": "sale", mercari: "sale", ebay: "sale", etsy: "sale", shop: "sale", ネット販売: "sale", ネット通販: "sale", 通販: "sale", 販売: "sale", 売買: "sale", btoc: "sale",
  c2c: "gift", present: "gift", personal_gift: "gift", 贈物: "gift", 贈り物: "gift", 贈答品: "gift", プレゼント: "gift", ctoc: "gift",
  business: "b2b", btob: "b2b", 法人: "b2b",
};

function pick<T extends string>(raw: string | null, allowed: readonly T[], aliases: Record<string, T>, name: string): T | undefined {
  if (raw === null) return undefined;
  const k = raw.toLowerCase().replace(/[\s-]+/g, "_");
  const v = (aliases[k] ?? aliases[raw] ?? k) as T;
  if (!(allowed as readonly string[]).includes(v)) throw new InputError(`Invalid ${name} "${raw}". Allowed: ${allowed.join(", ")}`);
  return v;
}

export function computeCheck(input: Input) {
  try {
    const country = s(input.country ?? input.destination ?? input.to ?? input.宛先国 ?? input.国);
    if (!country) throw new InputError("Missing country (EU destination, e.g. FR, Germany, イタリア).");
    const lines = n(input.itemLines ?? input.items ?? input.lines ?? input.品目数, "itemLines");
    return checkParcel({
      country,
      kind: pick(s(input.kind ?? input.type ?? input.取引形態), KINDS, KIND_ALIASES, "kind"),
      valueEUR: n(input.valueEUR ?? input.value ?? input.eur ?? input.金額, "valueEUR"),
      valueJPY: n(input.valueJPY ?? input.jpy ?? input.yen, "valueJPY"),
      eurJpy: n(input.eurJpy ?? input.rate ?? input.fx, "eurJpy"),
      itemLines: lines,
      ioss: tb(input.ioss ?? input.IOSS, "ioss"),
      payment: pick(s(input.payment ?? input.incoterm ?? input.支払), PAYMENTS, { prepaid: "ddp", sender: "ddp", 差出人払い: "ddp", recipient: "dap", buyer: "dap", 受取人払い: "dap" }, "payment") as Payment | undefined,
      shipDate: s(input.shipDate ?? input.date ?? input.差出日),
      today: s(input.today),
    });
  } catch (e) {
    if (e instanceof RuleInputError) throw new InputError(e.message);
    throw e;
  }
}

export const ENDPOINTS: Record<"check", Endpoint> = {
  check: {
    path: "/api/check",
    operationId: "japanEuParcelCheck",
    summary: "Sending a parcel from Japan to the EU by Japan Post: can it be posted, which route (IOSS DDP / DAP), €3 duty + €2 fee per item, PID, Germany ban",
    description: `Applies Japan Post's 2026-11-09 EU table and the European Commission's 2026-10-05 guidance (rules as of ${RULES_AS_OF}). kind=sale (B2C: the sender is the seller, individual or company): ≤ €150 → €3 temporary duty + €2 Union handling fee per item (per different product line), > €150 → EU common tariff + €2 per item; per-country Japan Post routes: IOSS + DDP (prepay in Zonos's app), IOSS + DAP, no IOSS (DAP); Germany: no B2C mail at all from 2026-11-09; PID required in principle for B2C ≤ €150 (DAP exempt for now); UGX courier alternative except Cyprus/Greece. kind=gift (C2C): ≤ €45 duty exempt, > €45 common tariff, no €2 fee. kind=b2b: common tariff, add VAT number. Returns verdict (can_post | can_post_other_route | cannot_post), summary, route, routes[{id, accepted}], charges {dutyEUR, dutyBasis, uhfEUR, knownTotalEUR, vat, whoPays}, pid, alternatives, actions, warnings, sources, disclaimer. VAT amounts are not computed.`,
    params: [
      { name: "country", type: "string", required: true, description: "EU destination: ISO code (FR, DE, IT…), English or Japanese name. 32 destinations (27 EU + GP, GF, MQ, RE, MC)." },
      { name: "kind", type: "string", enum: KINDS, default: "sale", description: "sale (B2C: you sold it — online shop, flea-market app, auction) | gift (personal gift, C2C) | b2b. Aliases: b2c, 通販, 贈り物, btob…" },
      { name: "valueEUR", type: "number", description: "Total value of the goods in euros (not shipping). Or give valueJPY + eurJpy." },
      { name: "valueJPY", type: "number", description: "Goods value in yen (needs eurJpy)." },
      { name: "eurJpy", type: "number", description: "Yen per euro for the conversion (e.g. 165)." },
      { name: "itemLines", type: "integer", default: 1, description: "Number of different items (product lines) on the customs form; 3 identical T-shirts = 1." },
      { name: "ioss", type: "boolean", default: false, description: "sale only: you or your marketplace collect EU VAT via IOSS (≤ €150)." },
      { name: "payment", type: "string", enum: PAYMENTS, description: "With IOSS: ddp (you prepay via Zonos) or dap (buyer pays). Default: ddp where available." },
      { name: "shipDate", type: "string", description: "YYYY-MM-DD posting date (default today in Japan; from 2026-11-09)." },
    ],
    example: EXAMPLE_GET,
    compute: computeCheck,
  },
};

export const PLUGIN = {
  name: "Japan EU Parcel Check",
  nameForModel: "japan_eu_parcel",
  descriptionForHuman: "Sending a parcel from Japan to the EU? Japan Post routes, €3 + €2 per item, Germany ban.",
  descriptionForModel:
    "Use when someone in Japan asks about posting a parcel to an EU country with Japan Post after the EU's 2026 rules: whether Japan Post accepts it (Germany refuses all B2C/online-sale mail from 2026-11-09), which payment route works per country (IOSS + DDP via Zonos, IOSS + DAP, no IOSS), the €3 temporary duty + €2 Union handling fee per item (≤ €150), > €150 normal duty + €2, gifts ≤ €45 duty-free with no fee, the PID (SKU / model number) requirement, and UGX/courier alternatives. Relay the disclaimer (educational; Japan Post and customs decide; VAT not computed).",
  logo: "/icon.svg",
};
