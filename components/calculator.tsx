"use client";

import { useState } from "react";
import { CardDisclaimer } from "@/components/card-disclaimer";
import { ShareBar } from "@/components/share-bar";
import { COUNTRIES, type Kind, type Payment } from "@/lib/euparcel";
import { EXAMPLE_SHARED, PUBLIC_URL, resultPath, safeCheck, type Shared } from "@/lib/share";
import { VERDICT_LABEL, VERDICT_STYLE } from "@/lib/verdict";

const field = "mt-2 w-full rounded-xl border border-line bg-black/40 px-3 py-2 text-sm text-foreground focus:border-amber";
const eur = (n: number) => `€${Number.isInteger(n) ? n : n.toFixed(2)}`;

export function Calculator({ initial }: { initial?: Shared }) {
  const start = initial ?? EXAMPLE_SHARED;
  const [country, setCountry] = useState(start.country);
  const [kind, setKind] = useState<Kind>(start.kind);
  const [value, setValue] = useState(String(start.valueEUR));
  const [lines, setLines] = useState(String(start.itemLines));
  const [ioss, setIoss] = useState(start.ioss);
  const [payment, setPayment] = useState<Payment | "">(start.payment ?? "");
  const [shipDate, setShipDate] = useState(start.shipDate ?? "");

  const v = Number(value);
  const n = Math.max(1, Math.min(99, Math.round(Number(lines) || 1)));
  const sale = kind === "sale";
  const shared: Shared = {
    country,
    kind,
    valueEUR: Number.isFinite(v) ? v : 0,
    itemLines: n,
    ioss: sale ? ioss : false,
    payment: sale && ioss && payment ? payment : null,
    shipDate: shipDate || null,
  };
  const r = value !== "" && Number.isFinite(v) ? safeCheck(shared) : null;
  const shareUrl = `${PUBLIC_URL}${resultPath(shared)}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.3fr]">
      <div className="rounded-3xl border border-line bg-panel/60 p-5 sm:p-6">
        <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">Your parcel</p>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-foreground">Destination (宛先国)</span>
          <select data-testid="country" className={field} value={country} onChange={(e) => setCountry(e.target.value)}>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.en} · {c.ja}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-foreground">What is it?</span>
          <select data-testid="kind" className={field} value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
            <option value="sale">I sold it (shop, flea-market app, auction) · ネット通販 BtoC</option>
            <option value="gift">Personal gift, not sold · 個人間の贈り物</option>
            <option value="b2b">To a business with an EU VAT number · BtoB</option>
          </select>
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-foreground">Value of the goods in euros (not shipping)</span>
          <input data-testid="value" inputMode="decimal" className={field} value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-foreground">Different items on the customs form</span>
          <input data-testid="lines" inputMode="numeric" className={field} value={lines} onChange={(e) => setLines(e.target.value)} />
          <span className="mt-1 block text-xs text-muted">3 identical T-shirts = 1. A T-shirt, a figure and a book = 3.</span>
        </label>
        {sale ? (
          <>
            <label className="mt-4 flex items-start gap-2 text-sm text-foreground">
              <input data-testid="ioss" type="checkbox" className="mt-1" checked={ioss} onChange={(e) => setIoss(e.target.checked)} />
              <span>EU VAT is collected at checkout through IOSS (yours or the marketplace&apos;s)</span>
            </label>
            {ioss ? (
              <label className="mt-4 block">
                <span className="text-sm font-medium text-foreground">Who pays duty and the fee?</span>
                <select className={field} value={payment} onChange={(e) => setPayment(e.target.value as Payment | "")}>
                  <option value="">Best available (DDP if possible)</option>
                  <option value="ddp">I prepay via Zonos (DDP)</option>
                  <option value="dap">The buyer pays on delivery (DAP)</option>
                </select>
              </label>
            ) : null}
          </>
        ) : null}
        <label className="mt-4 block">
          <span className="text-sm font-medium text-muted">Posting date (optional, default today)</span>
          <input type="date" className={field} value={shipDate} onChange={(e) => setShipDate(e.target.value)} />
        </label>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-line bg-panel/60">
        <div className="p-5 sm:p-7" data-testid="result">
          {r ? (
            <>
              <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">
                {VERDICT_LABEL[r.verdict]} · {r.country.ja}
              </p>
              <p className={`mt-2 font-display text-3xl leading-tight tracking-tight sm:text-4xl ${VERDICT_STYLE[r.verdict]}`}>{r.summary}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-line bg-black/30 p-3">
                  <p className="font-mono text-lg text-foreground">{r.charges.dutyEUR === null ? "normal rate" : eur(r.charges.dutyEUR)}</p>
                  <p className="text-xs text-muted">EU duty</p>
                </div>
                <div className="rounded-2xl border border-line bg-black/30 p-3">
                  <p className="font-mono text-lg text-foreground">{eur(r.charges.uhfEUR)}</p>
                  <p className="text-xs text-muted">€2 handling fee × items</p>
                </div>
                <div className="rounded-2xl border border-line bg-black/30 p-3">
                  <p className="font-mono text-lg text-foreground">{r.pid.required ? "Required" : "No"}</p>
                  <p className="text-xs text-muted">PID (SKU + model no.)</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted">{r.charges.vat} {r.charges.whoPays}</p>

              {r.routes.length > 1 ? (
                <>
                  <h3 className="mt-6 text-sm font-semibold text-foreground">Japan Post routes to {r.country.en} (table of {r.tableDate})</h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted">
                    {r.routes.map((x) => (
                      <li key={x.id}>
                        <span className={`mr-2 font-mono ${x.accepted ? "text-teal-100" : "text-rose-200"}`}>{x.accepted ? "〇" : "×"}</span>
                        <span className="text-foreground">{x.label}</span> <span className="text-xs">· {x.ja}</span>
                        {x.id === r.route.id ? <span className="ml-2 text-xs text-amber">your choice</span> : null}
                        <span className="block pl-6 text-xs">{x.how}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              {r.alternatives.length ? (
                <>
                  <h3 className="mt-6 text-sm font-semibold text-foreground">Other ways</h3>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
                    {r.alternatives.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </>
              ) : null}

              <h3 className="mt-6 text-sm font-semibold text-foreground">To do</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
                {[...r.actions, ...(r.pid.required ? [r.pid.note] : [])].map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              {r.warnings.length ? (
                <>
                  <h3 className="mt-6 text-sm font-semibold text-foreground">Watch out</h3>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
                    {r.warnings.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </>
              ) : null}
              <div className="mt-6">
                <ShareBar url={shareUrl} text={`Japan → ${r.country.en} parcel: ${r.summary}`} />
              </div>
            </>
          ) : (
            <p className="text-sm text-muted">Enter the value of the goods in euros. Posting dates from 2026-11-09.</p>
          )}
        </div>
        <CardDisclaimer />
      </div>
    </div>
  );
}
