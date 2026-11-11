// Japan → EU parcel check. Rules as of 2026-11-11 from Japan Post's 2026-11-09 EU notice (続報6),
// its 2026-11-04 country-conditions change (Germany B2C 差出不可 from 2026-11-09), the 2026-10-22 UGX notice
// and the European Commission's guidance on the EUR 3 customs duty and Union handling fee (version 5 Oct 2026).

export const RULES_AS_OF = "2026-11-11";
export const TABLE_DATE = "2026-11-09";
export const FIRST_DATE = "2026-11-09";
export const UHF_FROM = "2026-11-01";
export const FLAT_DUTY_UNTIL = "2028-07-01"; // temporary €3 applies until this date (Reg. (EU) 2026/382)
export const FLAT_DUTY_EUR = 3;
export const UHF_EUR = 2;
export const LOW_VALUE_MAX_EUR = 150;
export const GIFT_MAX_EUR = 45;

export const KINDS = ["sale", "gift", "b2b"] as const;
export type Kind = (typeof KINDS)[number];
export const PAYMENTS = ["ddp", "dap"] as const;
export type Payment = (typeof PAYMENTS)[number];
export type RouteId = "ioss_ddp" | "ioss_dap" | "no_ioss_dap" | "gift" | "b2b";

export const DISCLAIMER =
  "Educational checklist, not customs, tax or legal advice; not affiliated with Japan Post, the European Commission or any customs authority. Built from Japan Post's 2026-11-09 EU table and the Commission's 2026-10-05 guidance; conditions change often. Japan Post and destination customs decide; check Japan Post's country conditions (国際郵便条件表) and the post-office counter before you send.";

export class RuleInputError extends Error {}

export type Country = {
  code: string;
  en: string;
  ja: string;
  /** Japan Post 2026-11-09 table: B2C with IOSS, DDP (sender prepays via Zonos) */
  iossDdp: boolean;
  /** B2C with IOSS, DAP (recipient pays) */
  iossDap: boolean;
  /** B2C without IOSS (DAP) */
  noIoss: boolean;
};

// Transcribed from https://www.post.japanpost.jp/service/send/oversea/information/2026/1109_01.html (section 3 table).
const T = true;
const F = false;
export const COUNTRIES: Country[] = [
  { code: "AT", en: "Austria", ja: "オーストリア", iossDdp: F, iossDap: F, noIoss: T },
  { code: "BE", en: "Belgium", ja: "ベルギー", iossDdp: T, iossDap: F, noIoss: T },
  { code: "BG", en: "Bulgaria", ja: "ブルガリア", iossDdp: F, iossDap: T, noIoss: T },
  { code: "HR", en: "Croatia", ja: "クロアチア", iossDdp: F, iossDap: T, noIoss: T },
  { code: "CY", en: "Cyprus", ja: "キプロス", iossDdp: F, iossDap: T, noIoss: T },
  { code: "CZ", en: "Czechia", ja: "チェコ", iossDdp: F, iossDap: F, noIoss: T },
  { code: "DK", en: "Denmark", ja: "デンマーク", iossDdp: T, iossDap: F, noIoss: T },
  { code: "EE", en: "Estonia", ja: "エストニア", iossDdp: T, iossDap: T, noIoss: T },
  { code: "FI", en: "Finland", ja: "フィンランド", iossDdp: T, iossDap: F, noIoss: T },
  { code: "FR", en: "France", ja: "フランス", iossDdp: T, iossDap: F, noIoss: T },
  { code: "GF", en: "French Guiana", ja: "仏領ギアナ", iossDdp: T, iossDap: F, noIoss: T },
  { code: "DE", en: "Germany", ja: "ドイツ", iossDdp: F, iossDap: F, noIoss: F },
  { code: "GR", en: "Greece", ja: "ギリシャ", iossDdp: F, iossDap: T, noIoss: T },
  { code: "GP", en: "Guadeloupe", ja: "ガドループ", iossDdp: T, iossDap: F, noIoss: T },
  { code: "HU", en: "Hungary", ja: "ハンガリー", iossDdp: F, iossDap: T, noIoss: T },
  { code: "IE", en: "Ireland", ja: "アイルランド", iossDdp: F, iossDap: T, noIoss: T },
  { code: "IT", en: "Italy", ja: "イタリア", iossDdp: T, iossDap: T, noIoss: T },
  { code: "LV", en: "Latvia", ja: "ラトビア", iossDdp: F, iossDap: T, noIoss: T },
  { code: "LT", en: "Lithuania", ja: "リトアニア", iossDdp: F, iossDap: T, noIoss: T },
  { code: "LU", en: "Luxembourg", ja: "ルクセンブルク", iossDdp: T, iossDap: F, noIoss: T },
  { code: "MT", en: "Malta", ja: "マルタ", iossDdp: T, iossDap: T, noIoss: T },
  { code: "MQ", en: "Martinique", ja: "マルチニーク", iossDdp: T, iossDap: F, noIoss: T },
  { code: "MC", en: "Monaco", ja: "モナコ", iossDdp: T, iossDap: F, noIoss: T },
  { code: "NL", en: "Netherlands", ja: "オランダ", iossDdp: T, iossDap: T, noIoss: T },
  { code: "PL", en: "Poland", ja: "ポーランド", iossDdp: F, iossDap: T, noIoss: T },
  { code: "PT", en: "Portugal", ja: "ポルトガル", iossDdp: F, iossDap: F, noIoss: T },
  { code: "RE", en: "Réunion", ja: "レユニオン", iossDdp: T, iossDap: F, noIoss: T },
  { code: "RO", en: "Romania", ja: "ルーマニア", iossDdp: F, iossDap: T, noIoss: T },
  { code: "SK", en: "Slovakia", ja: "スロバキア", iossDdp: T, iossDap: T, noIoss: T },
  { code: "SI", en: "Slovenia", ja: "スロベニア", iossDdp: F, iossDap: T, noIoss: T },
  { code: "ES", en: "Spain", ja: "スペイン", iossDdp: T, iossDap: T, noIoss: T },
  { code: "SE", en: "Sweden", ja: "スウェーデン", iossDdp: T, iossDap: F, noIoss: T },
];

/** UGX (Japan Post's courier) is offered where DDP is not possible, except Cyprus and Greece. */
export const UGX_EXCLUDED = ["CY", "GR"];

const EXTRA_ALIASES: Record<string, string> = {
  deutschland: "DE", holland: "NL", "the netherlands": "NL", nederland: "NL", espana: "ES", españa: "ES", italia: "IT", osterreich: "AT", österreich: "AT",
  "czech republic": "CZ", polska: "PL", sverige: "SE", danmark: "DK", suomi: "FI", eire: "IE", hellas: "GR", reunion: "RE", "la reunion": "RE", "la réunion": "RE",
  オランダ王国: "NL", ドイツ連邦共和国: "DE", 独: "DE", 仏: "FR", フランス共和国: "FR", 伊: "IT", 西: "ES", レユニオン島: "RE", 仏領ギアナ: "GF", フランス領ギアナ: "GF",
};
const NON_EU = /^(gb|uk|united kingdom|england|britain|great britain|イギリス|英国|ch|switzerland|スイス|no|norway|ノルウェー|is|iceland|アイスランド|us|usa|united states|アメリカ|米国|li|liechtenstein|ad|andorra|sm|san marino|va|vatican|ua|ukraine|rs|serbia|tr|turkey|türkiye)$/i;

export function findCountry(raw: string): Country {
  const k = raw.trim();
  const low = k.toLowerCase();
  const byCode = COUNTRIES.find((c) => c.code.toLowerCase() === low || c.en.toLowerCase() === low || c.ja === k);
  if (byCode) return byCode;
  const alias = EXTRA_ALIASES[low] ?? EXTRA_ALIASES[k];
  if (alias) return COUNTRIES.find((c) => c.code === alias)!;
  if (low === "el") return COUNTRIES.find((c) => c.code === "GR")!;
  if (NON_EU.test(low))
    throw new RuleInputError(`"${raw}" is not in Japan Post's EU list (27 EU states plus Guadeloupe, French Guiana, Martinique, Réunion and Monaco). The EU €3 duty and €2 handling fee do not apply there; check Japan Post's country conditions instead.`);
  throw new RuleInputError(`Unknown country "${raw}". Use an EU country name or ISO code (e.g. FR, DE, IT), in English or Japanese.`);
}

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;
export function parseDate(s: string, name: string): string {
  const m = s.match(ISO);
  if (!m) throw new RuleInputError(`${name} must be YYYY-MM-DD`);
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if (d.getUTCFullYear() !== +m[1] || d.getUTCMonth() !== +m[2] - 1 || d.getUTCDate() !== +m[3]) throw new RuleInputError(`${name} is not a real date: ${s}`);
  return s;
}
export function todayJST(): string {
  return new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10);
}

export const SOURCES = [
  "https://www.post.japanpost.jp/service/send/oversea/information/2026/1109_01.html",
  "https://www.post.japanpost.jp/service/send/oversea/information/2026/1104_01.html",
  "https://www.post.japanpost.jp/service/send/oversea/information/2026/1022_01.html",
  "https://www.post.japanpost.jp/service/send/oversea/information/overview.pdf",
  "https://www.post.japanpost.jp/cgi-kokusai/index.php",
  "https://taxation-customs.ec.europa.eu/customs/eu-customs-reform_en",
  "https://taxation-customs.ec.europa.eu/document/download/053e5b4e-f0be-4f20-9a23-3e3b659a6676_en?filename=Customs+Guidance+on+EUR+3+customs+duty.pdf",
  "https://www.consilium.europa.eu/en/policies/eu-action-influx-of-small-parcels/",
  "https://www.revenue.ie/en/customs/individuals/union-handling-fee/index.aspx",
];

export const RULES = {
  b2cTable: {
    source: SOURCES[0],
    sale: { upTo45: "€3 duty + €2 UHF per item", from45To150: "€3 duty + €2 UHF per item", over150: "EU common tariff + €2 UHF per item" },
    gift: { upTo45: "duty exempt", over45: "EU common tariff" },
    b2bAndOther: "EU common tariff",
    saleMeans: "the sender is the seller (individual or company): online sales, flea-market apps, auctions, your own shop",
    perItem: "Japan Post: charged per contents item, not per HS code. EU: an item is goods sharing the same tariff classification and description (and origin where declared), charged per declaration line whatever the quantity.",
  },
  flatDuty: { eur: FLAT_DUTY_EUR, from: "2026-07-01", until: FLAT_DUTY_UNTIL, scope: "consignments with intrinsic value up to €150 sold at a distance (IOSS goods and postal consignments)", note: "Temporary (Reg. (EU) 2026/382); the Commission assesses by 2027-12-01 whether to extend it." },
  unionHandlingFee: { eur: UHF_EUR, from: UHF_FROM, scope: "goods sold in distance sales, any value", note: "Not temporary; not refunded even on returns or refusal. Not charged on gifts between private individuals." },
  pid: { from: "2026-11-01", scope: "B2C ≤ €150", how: "Submit with Zonos's app (DDP). DAP parcels can be posted without PID for the time being (Japan Post).", types: ["M-PID: shop/marketplace product ID or SKU (required)", "NS-PID: maker part / model number (required; a standard barcode can stand in)", "S-PID: JAN / EAN / UPC / GTIN / ISBN (if one exists)"] },
  germany: { from: "2026-11-09", rule: "Japan Post does not accept B2C (online-sale) mail to Germany, any mail type, with or without IOSS. Gifts and other mail are not covered by this ban." },
  ugx: { note: "Japan Post offers its UGX courier where DDP by post is not possible (not Cyprus or Greece); UGX (通常) stopped for Europe from 2026-10-30, so it means UGXプライム or UGX越境EC配送サービス, which need a contract.", source: SOURCES[2] },
  ddp: { how: "Import declaration, PID, prepayment and label in Zonos's Prepay app or dashboard (Zonos charges a fee). Not on post-office tablets. The label must come from Zonos (DDP + 13-digit Declaration ID)." },
  countries: COUNTRIES.map((c) => ({ ...c, ugx: !UGX_EXCLUDED.includes(c.code) })),
  tableDate: TABLE_DATE,
};

export type ParcelInput = {
  country: string;
  kind?: Kind;
  valueEUR?: number | null;
  valueJPY?: number | null;
  eurJpy?: number | null;
  itemLines?: number | null;
  ioss?: boolean;
  payment?: Payment | null;
  shipDate?: string | null;
  today?: string | null;
};

export type Route = { id: RouteId; label: string; ja: string; accepted: boolean; how: string };
export type Verdict = "can_post" | "can_post_other_route" | "cannot_post";

const eur = (n: number) => `€${Number.isInteger(n) ? n : n.toFixed(2)}`;

export function checkParcel(input: ParcelInput) {
  const c = findCountry(input.country);
  const kind: Kind = input.kind ?? "sale";
  const date = parseDate(input.shipDate ?? input.today ?? todayJST(), "shipDate");
  if (date < FIRST_DATE) throw new RuleInputError(`This checker covers parcels posted on or after ${FIRST_DATE} (Japan Post's current EU table). Earlier conditions differed.`);

  let valueEUR = input.valueEUR ?? null;
  if (valueEUR == null && input.valueJPY != null) {
    if (!input.eurJpy || input.eurJpy <= 0) throw new RuleInputError("valueJPY needs eurJpy (yen per euro, e.g. 165) so the €45 / €150 limits can be checked.");
    valueEUR = Math.round((input.valueJPY / input.eurJpy) * 100) / 100;
  }
  if (valueEUR == null || !Number.isFinite(valueEUR)) throw new RuleInputError("Missing valueEUR: total value of the contents in euros (goods only, not shipping).");
  if (valueEUR < 0 || valueEUR > 1_000_000) throw new RuleInputError("valueEUR must be between 0 and 1,000,000.");
  const lines = input.itemLines ?? 1;
  if (!Number.isInteger(lines) || lines < 1 || lines > 99) throw new RuleInputError("itemLines must be a whole number from 1 to 99 (different items on the customs form).");
  const ioss = !!input.ioss;
  const lowValue = valueEUR <= LOW_VALUE_MAX_EUR;
  const flatDutyActive = date < FLAT_DUTY_UNTIL;
  const ugxOk = !UGX_EXCLUDED.includes(c.code);

  const warnings: string[] = [];
  const actions: string[] = [];
  const alternatives: string[] = [];
  let routes: Route[] = [];
  let chosen: RouteId;
  let dutyEUR: number | null = null;
  let dutyBasis: "flat_eur3_per_item" | "eu_common_tariff" | "exempt";
  let uhfEUR = 0;
  let pid: { required: boolean; note: string };
  let vat: string;
  let whoPays: string;

  if (kind === "sale") {
    uhfEUR = UHF_EUR * lines;
    if (lowValue && flatDutyActive) {
      dutyEUR = FLAT_DUTY_EUR * lines;
      dutyBasis = "flat_eur3_per_item";
    } else dutyBasis = "eu_common_tariff";
    if (!flatDutyActive && lowValue) warnings.push(`The temporary €3 duty runs until ${FLAT_DUTY_UNTIL} unless the EU extends it; after that normal duty rates apply. Check before relying on this.`);

    const noIossRoute: Route = { id: "no_ioss_dap", label: "No IOSS, recipient pays (DAP)", ja: "IOSS利用なし（受取人払い）", accepted: c.noIoss, how: "Normal label (e.g. 国際郵便マイページ). Duty, fee and import VAT are collected from the buyer on delivery." };
    if (lowValue) {
      routes = [
        { id: "ioss_ddp", label: "IOSS, sender prepays (DDP)", ja: "IOSS利用・差出人払い（DDP）", accepted: c.iossDdp, how: "Declare, submit PID, prepay and print the label in Zonos's app (Zonos fee). Buyer pays nothing on delivery." },
        { id: "ioss_dap", label: "IOSS, recipient pays (DAP)", ja: "IOSS利用・受取人払い（DAP）", accepted: c.iossDap, how: "Label from 国際郵便マイページ etc. with contents type ネット販売品（通販）. VAT was collected at checkout; duty and fee are collected from the buyer." },
        noIossRoute,
      ];
      chosen = ioss ? (input.payment ? (`ioss_${input.payment}` as RouteId) : c.iossDdp ? "ioss_ddp" : "ioss_dap") : "no_ioss_dap";
      if (!ioss && input.payment === "ddp") warnings.push("Without IOSS, Japan Post's table offers only recipient-pays (DAP). To prepay by post you need IOSS (yours or your marketplace's) and a DDP country.");
    } else {
      routes = [noIossRoute];
      chosen = "no_ioss_dap";
      if (ioss) warnings.push("IOSS only covers consignments up to €150. Above that the parcel is declared normally: duty at the EU common tariff, the €2 fee per item and import VAT on arrival.");
    }
    pid = lowValue
      ? { required: true, note: "From 2026-11-01 a product identifier (PID) is required in principle for B2C ≤ €150: shop SKU + maker part number (+ JAN/EAN if any), submitted in Zonos's app for DDP. For DAP Japan Post accepts parcels without PID for the time being." }
      : { required: false, note: "The PID rule covers B2C parcels up to €150." };
    vat = ioss && lowValue ? "VAT at the destination rate was collected at checkout through IOSS (not computed here)." : "Import VAT at the destination rate is charged on arrival (not computed here); the €2 fee is part of the VAT base.";
    whoPays = chosen === "ioss_ddp" ? "You (the sender) prepay duty and fee in Zonos; the buyer pays nothing on delivery." : "The buyer pays the duty, fee and any import VAT on delivery (DAP); refusals do not get the fee back.";
    actions.push(`Count the different items: each different product line on the customs form costs ${lowValue && flatDutyActive ? "€3 duty + €2 fee" : "€2 fee (plus normal duty)"}, whatever the quantity of that same product.`);
    actions.push("Write a precise description, the value, the HS code and \"Country of origin: Japan\" on the customs form; Japan Post recommends HS / TARIC / CN codes for many EU countries.");
    if (chosen !== "ioss_ddp") actions.push("Tell the buyer in your listing that they will pay the EU charges and VAT on delivery, so they do not refuse the parcel.");
  } else if (kind === "gift") {
    dutyBasis = valueEUR <= GIFT_MAX_EUR ? "exempt" : "eu_common_tariff";
    dutyEUR = dutyBasis === "exempt" ? 0 : null;
    routes = [{ id: "gift", label: "Personal gift (C2C)", ja: "個人間の贈答品", accepted: true, how: "Normal label; choose gift (贈物) as the contents type. Japan Post's EU table bans only B2C mail to Germany." }];
    chosen = "gift";
    pid = { required: false, note: "The PID rule covers B2C (online-sale) parcels only." };
    vat = "Japan Post's table covers duty only. VAT or national charges may still apply on arrival; check destination customs.";
    whoPays = "The recipient pays any charges on delivery.";
    warnings.push("Only a real gift between private individuals counts. If you sold the item (flea-market app, auction, shop), it is B2C and the €3 + €2 per item rules apply.");
    actions.push(`Gifts up to €${GIFT_MAX_EUR} are duty-exempt; above €${GIFT_MAX_EUR} duty is at the EU common tariff. The €2 handling fee is for distance sales and is not charged on gifts.`);
  } else {
    dutyBasis = "eu_common_tariff";
    routes = [{ id: "b2b", label: "Business to business (B2B)", ja: "BtoB等", accepted: true, how: "Normal label and commercial invoice. Japan Post's Germany ban covers B2C only." }];
    chosen = "b2b";
    pid = { required: false, note: "The PID rule covers B2C parcels only." };
    vat = "The importing business accounts for import VAT (not computed here).";
    whoPays = "Usually the importing business (per your incoterms).";
    actions.push("Put the buyer's EU VAT number on the documents: the EU treats a declaration without a VAT number as a distance sale (B2C), which adds the €2 fee per item.");
  }

  const chosenRoute = routes.find((r) => r.id === chosen)!;
  if (!chosenRoute.accepted && !routes.length) throw new Error("no route");
  const anyAccepted = routes.some((r) => r.accepted);
  const verdict: Verdict = chosenRoute?.accepted ? "can_post" : anyAccepted ? "can_post_other_route" : "cannot_post";

  if (kind === "sale" && c.code === "DE") {
    alternatives.push("Courier (e.g. DHL, FedEx, UPS): EU duty, the €2 fee and VAT still apply and are billed by the courier.");
    if (ugxOk) alternatives.push("Japan Post's UGX courier: UGXプライム or UGX越境EC配送サービス (UGX 通常 stopped for Europe from 2026-10-30). Needs a contract and Hubez account.");
    alternatives.push("If it is truly a personal gift (not sold), gifts are not covered by the Germany B2C ban.");
  } else if (kind === "sale" && lowValue && !c.iossDdp && c.noIoss) {
    if (ugxOk) alternatives.push(`To prepay the buyer's charges, Japan Post points to UGX (UGXプライム / UGX越境EC配送サービス) for countries where DDP by post is not possible, like ${c.en}.`);
    else alternatives.push(`DDP by post is not possible to ${c.en} and Japan Post's UGX courier does not cover it; prepaid delivery means a private courier.`);
  }

  const known = (dutyEUR ?? 0) + uhfEUR;
  const charges = {
    dutyEUR,
    dutyBasis,
    uhfEUR,
    knownTotalEUR: known,
    perItemEUR: kind === "sale" ? (dutyBasis === "flat_eur3_per_item" ? FLAT_DUTY_EUR + UHF_EUR : UHF_EUR) : 0,
    vat,
    whoPays,
    note: dutyBasis === "eu_common_tariff" ? "Duty at the EU common tariff depends on the product's tariff code and origin; not computed. Goods of Japanese origin may qualify for the EU–Japan EPA preference when claimed in a full declaration (not under IOSS)." : null,
  };

  let summary: string;
  const where = `${c.en} (${c.ja})`;
  if (verdict === "cannot_post") {
    summary = `Japan Post does not accept online-sale (B2C) parcels to ${where} from ${RULES.germany.from}. Use a courier${ugxOk ? " or UGX" : ""}; the EU charges (${eur(known)}${dutyBasis === "eu_common_tariff" ? " + duty" : ""}) still apply.`;
  } else if (verdict === "can_post_other_route") {
    const ok = routes.filter((r) => r.accepted).map((r) => r.label).join(" or ");
    summary = `${chosenRoute.label} is not available to ${where} by Japan Post. Use: ${ok}. EU charges ${eur(known)}${dutyBasis === "eu_common_tariff" ? " + duty" : ""} + VAT.`;
  } else if (kind === "sale") {
    summary = `Japan Post accepts it: ${chosenRoute.label}. EU charges: ${dutyBasis === "flat_eur3_per_item" ? `€3 duty + €2 fee × ${lines} item${lines > 1 ? "s" : ""} = ${eur(known)}` : `€2 fee × ${lines} = ${eur(uhfEUR)} + duty at the normal rate`}, plus ${c.en} VAT.`;
  } else if (kind === "gift") {
    summary = dutyBasis === "exempt" ? `A personal gift of ${eur(valueEUR)} to ${where} is duty-exempt (€45 or less) and has no €2 fee.` : `A personal gift over €45 to ${where}: duty at the EU common tariff, no €2 fee.`;
  } else {
    summary = `B2B to ${where}: duty at the EU common tariff; the €2 fee is for distance sales, so add the buyer's VAT number.`;
  }

  if (kind === "sale" && valueEUR > 140 && valueEUR <= 150) warnings.push("You are close to €150. Above €150 the €3 flat duty and IOSS no longer apply (normal duty, VAT on arrival); value means goods only, without shipping if shown separately.");
  if (kind === "gift" && valueEUR > 40 && valueEUR <= 45) warnings.push("Close to the €45 gift limit (€45 or less is exempt).");
  warnings.push("Japan Post also suspends some services per country (e.g. SAL, some EMS). Check 国際郵便物の差出可否早見表 and the country page before posting.");

  return {
    country: { code: c.code, en: c.en, ja: c.ja },
    kind,
    valueEUR,
    itemLines: lines,
    ioss: kind === "sale" ? ioss : false,
    shipDate: date,
    verdict,
    summary,
    route: chosenRoute,
    routes,
    charges,
    pid,
    alternatives,
    actions,
    warnings,
    ugxAvailable: ugxOk,
    rulesAsOf: RULES_AS_OF,
    tableDate: TABLE_DATE,
    sources: SOURCES,
    disclaimer: DISCLAIMER,
  };
}
export type ParcelResult = ReturnType<typeof checkParcel>;
