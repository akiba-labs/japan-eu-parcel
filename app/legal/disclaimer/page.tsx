import type { Metadata } from "next";
import { RULES_AS_OF, SOURCES, TABLE_DATE } from "@/lib/euparcel";
import { DISCLAIMER_SHORT, HONESTY } from "@/lib/site";

export const metadata: Metadata = { title: "Disclaimer", description: DISCLAIMER_SHORT };

export default function DisclaimerPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Read this</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">Disclaimer</h1>
      <p className="mt-4 text-lg text-foreground">{DISCLAIMER_SHORT}</p>
      <p className="mt-2 text-muted">{HONESTY}</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-base font-semibold text-foreground">What this is</h2>
          <p className="mt-2">
            A free educational checklist. It applies a dated reading (as of {RULES_AS_OF}) of Japan Post&apos;s EU table of {TABLE_DATE} (which payment routes it accepts per destination), its Germany country condition, its UGX notice and the European Commission&apos;s guidance on the temporary €3 customs duty and the €2 Union handling fee to the parcel you describe.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">What it is not</h2>
          <p className="mt-2">
            It is not customs, tax or legal advice and is not affiliated with Japan Post, Zonos, the European Commission or any customs authority. It does not compute VAT, normal duty rates, courier, Zonos or postal handling fees, and it does not decide whether your sale is a distance sale, how customs will count your items or whether a service is suspended. Japan Post changes country conditions often (it has updated this notice several times since June 2026). Japan Post and destination customs decide; check Japan Post&apos;s 国際郵便条件表, 差出可否早見表 and the post-office counter, or ask a customs broker.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">How it counts</h2>
          <p className="mt-2">
            &quot;Items&quot; is the number of different product lines you enter. Japan Post says B2C duty and the fee are charged per contents item, not per HS code; the EU defines an item as goods sharing the same tariff classification and description (and origin where declared) and charges per declaration line whatever the quantity. Values are goods only, in euros; €150 and €45 are inclusive limits. Yen conversion uses the rate you give, not the customs rate.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Sources</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {SOURCES.map((s) => (
              <li key={s}>
                <a href={s} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
