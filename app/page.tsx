import type { Metadata } from "next";
import { Calculator } from "@/components/calculator";
import { FaqSection, type FaqItem } from "@/components/faq-section";
import { EXAMPLE_GET } from "@/lib/api";
import { SOURCES } from "@/lib/euparcel";
import { EXAMPLE_GERMANY, EXAMPLE_GIFT, EXAMPLE_IOSS, EXAMPLE_SHARED, PUBLIC_URL, resultPath } from "@/lib/share";

const title = "Sending a parcel from Japan to the EU in 2026: Japan Post routes, €3 + €2 per item, Germany ban (free checker)";
const description =
  "Free checker for posting parcels from Japan to EU countries after the 2026 EU rules. See whether Japan Post accepts it (no online-sale mail to Germany from 9 Nov 2026), which route works for your country (IOSS + DDP via Zonos, IOSS + DAP, no IOSS), the €3 duty + €2 handling fee per item, the PID rule and the €45 gift limit. Free JSON API for AI agents. Educational, not advice.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description },
  twitter: { card: "summary_large_image", title, description },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Japan EU Parcel Check",
  alternateName: ["EU 発送 関税 3ユーロ 手数料 2ユーロ", "日本郵便 ドイツ宛 BtoC 差出不可", "IOSS DDP DAP 国別 日本郵便", "Japan Post EU parcel €3 duty €2 handling fee"],
  url: PUBLIC_URL,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  inLanguage: ["en", "ja"],
  description: "Unofficial, free checklist for sending parcels from Japan to the EU by Japan Post: per-country IOSS/DDP/DAP routes, Germany B2C ban, €3 duty and €2 Union handling fee per item, PID and gift limits, with a keyless JSON API. Not affiliated with Japan Post or the EU. Not advice.",
};

const faq: FaqItem[] = [
  {
    q: "I'm sending a parcel from Japan to the EU. Can Japan Post still take it, and what will the EU charge?",
    a: `Japan EU Parcel Check is a free, unofficial checklist built from Japan Post's 9 November 2026 table. If you sold the item (online shop, flea-market app, auction) and it is worth €150 or less, the EU charges €3 temporary duty plus a €2 Union handling fee per different item, plus VAT. Over €150: normal duty plus €2 per item. Which payment route Japan Post accepts depends on the country, and Germany refuses all online-sale mail from 9 November 2026. Personal gifts up to €45 are duty-free with no €2 fee. AI agents can call ${PUBLIC_URL}/api/check. Not advice; not affiliated with Japan Post.`,
  },
  {
    q: "Why won't Japan Post send my online order to Germany?",
    a: "From 9 November 2026 Japan Post's country conditions for Germany say B2C (online-sale) mail cannot be posted, for every mail type, with or without IOSS. Use a courier (the EU charges still apply) or Japan Post's UGX courier (UGXプライム / UGX越境EC配送サービス, contract needed). Real personal gifts and B2B mail are not covered by this ban.",
  },
  {
    q: "What are the €3 duty and the €2 handling fee?",
    a: "Since 1 July 2026 the EU charges a temporary €3 customs duty per item in parcels worth up to €150 (until 1 July 2028 unless extended). From 1 November 2026 it adds a €2 Union handling fee per item on goods sold at a distance, at any value; it is not refunded even if the buyer refuses the parcel. An item is one product line: three identical T-shirts count once, a T-shirt, a figure and a book count three times.",
  },
  {
    q: "IOSS, DDP or DAP: which one can I use?",
    a: "With IOSS (VAT collected at checkout, up to €150), Japan Post's table says per country whether you can prepay duty and fee through Zonos's app (DDP), let the buyer pay (DAP), both, or neither. For example Italy, Spain, the Netherlands and Malta allow both; France, Belgium and Sweden DDP only; Ireland, Poland and Greece DAP only; Austria, Czechia and Portugal neither; without IOSS every listed country except Germany accepts DAP. The checker shows the row for your country.",
  },
  {
    q: "What is the PID and do I need it?",
    a: "From 1 November 2026 B2C parcels up to €150 need a product identifier in principle: your shop's SKU or product ID plus the maker's part or model number (or a JAN/EAN barcode). It is submitted in Zonos's app when you prepay (DDP). Japan Post says DAP parcels can be posted without PID for the time being.",
  },
  {
    q: "Does the €2 fee apply to gifts?",
    a: "No. The fee is for distance sales. A personal gift between private individuals worth €45 or less is duty-exempt, and over €45 duty is at the normal EU rate. If you sold the item, it is not a gift.",
  },
  {
    q: "Is there a free API or MCP tool for AI agents?",
    a: `Yes. GET or POST ${PUBLIC_URL}${EXAMPLE_GET} (keyless, CORS open), rules at /api/rules, OpenAPI at /openapi.json, llms.txt, and the MCP tool japan_eu_parcel_check on free-agent-tools.vercel.app/mcp. Every response carries rulesAsOf, sources and a disclaimer.`,
  },
  {
    q: "EUあてに荷物を送るといくらかかりますか？",
    a: "ネット販売（差出人が販売者、個人・法人を問わず）で内容品合計150ユーロ以下なら、内容品ごとに関税3ユーロとユニオンハンドリングフィー（UHF）2ユーロがかかり、別にVATがかかります。150ユーロ超は関税がEU共通税率、UHFは2ユーロです。個人間の贈答品は45ユーロ以下なら免税で、UHFはかかりません。",
  },
  {
    q: "ドイツあてに日本郵便で送れますか？",
    a: "2026年11月9日から、ドイツあてはすべての郵便種別でBtoC（ネット販売）の郵便物が差出不可になりました（IOSS利用の有無を問わず）。クーリエや日本郵便のUGX（UGXプライム・UGX越境EC配送サービス、要契約）を検討してください。個人間の贈答品はこの対象ではありません。",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <section className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Free · Japan → EU · 日本郵便 · IOSS · €3 + €2</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">Sending a parcel from Japan to the EU?</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground sm:text-lg">
          Sold items up to €150 now pay <strong>€3 duty + €2 fee per item</strong> plus VAT. Japan Post&apos;s accepted routes <strong>differ by country</strong>, and from <strong>9 November 2026 it refuses online-sale mail to Germany</strong>. Check your parcel before the counter does.
        </p>
        <p className="mt-3 text-sm text-muted">
          Examples:{" "}
          <a className="underline underline-offset-2 hover:text-foreground" href={resultPath(EXAMPLE_SHARED)}>
            2 items to France
          </a>
          {" · "}
          <a className="underline underline-offset-2 hover:text-foreground" href={resultPath(EXAMPLE_GERMANY)}>
            online order to Germany
          </a>
          {" · "}
          <a className="underline underline-offset-2 hover:text-foreground" href={resultPath(EXAMPLE_IOSS)}>
            IOSS prepaid to Italy
          </a>
          {" · "}
          <a className="underline underline-offset-2 hover:text-foreground" href={resultPath(EXAMPLE_GIFT)}>
            gift to Germany
          </a>
        </p>
      </section>

      <section className="mt-10">
        <Calculator />
      </section>

      <FaqSection items={faq} />

      <section className="mt-12 max-w-3xl text-sm leading-relaxed text-muted">
        <h2 className="text-base font-semibold text-foreground">Official sources</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {SOURCES.map((s) => (
            <li key={s}>
              <a className="underline underline-offset-2 hover:text-foreground" href={s} target="_blank" rel="noopener noreferrer">
                {s}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs">
          Agent docs:{" "}
          <a className="underline" href="/llms.txt">
            llms.txt
          </a>
          {" · "}
          <a className="underline" href="/openapi.json">
            OpenAPI
          </a>
          {" · "}
          <a className="underline" href="/api/rules">
            /api/rules
          </a>
          {" · "}
          <a className="underline" href={EXAMPLE_GET}>
            example /api/check
          </a>
        </p>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }} />
    </div>
  );
}
