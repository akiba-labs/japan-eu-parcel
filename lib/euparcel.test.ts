import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { COUNTRIES, checkParcel, findCountry } from "./euparcel";

const d = "2026-11-11";

describe("country matrix", () => {
  it("matches Japan Post's 2026-11-09 table snapshot", () => {
    const snap = JSON.parse(readFileSync(new URL("./jp-1109-matrix.json", import.meta.url), "utf8")) as Record<string, string[]>;
    assert.equal(COUNTRIES.length, 32);
    assert.equal(Object.keys(snap).length, 32);
    for (const c of COUNTRIES) {
      const row = snap[c.ja];
      assert.ok(row, `missing ${c.ja}`);
      assert.deepEqual([c.iossDdp, c.iossDap, c.noIoss], row.map((x) => x === "〇"), c.en);
    }
  });
  it("aliases", () => {
    assert.equal(findCountry("ドイツ").code, "DE");
    assert.equal(findCountry("deutschland").code, "DE");
    assert.equal(findCountry("fr").code, "FR");
    assert.equal(findCountry("Netherlands").code, "NL");
    assert.throws(() => findCountry("UK"), /not in Japan Post's EU list/);
    assert.throws(() => findCountry("Atlantis"), /Unknown country/);
  });
});

describe("sale (B2C)", () => {
  it("France, no IOSS, 2 items ≤ €150 → DAP accepted, €10", () => {
    const r = checkParcel({ country: "FR", valueEUR: 60, itemLines: 2, shipDate: d });
    assert.equal(r.verdict, "can_post");
    assert.equal(r.route.id, "no_ioss_dap");
    assert.equal(r.charges.dutyEUR, 6);
    assert.equal(r.charges.uhfEUR, 4);
    assert.equal(r.charges.knownTotalEUR, 10);
    assert.equal(r.pid.required, true);
  });
  it("Germany → cannot post, alternatives", () => {
    const r = checkParcel({ country: "DE", valueEUR: 40, shipDate: d });
    assert.equal(r.verdict, "cannot_post");
    assert.ok(r.alternatives.some((a) => /UGX/.test(a)));
    assert.match(r.summary, /does not accept/);
  });
  it("Germany with IOSS DDP → still cannot", () => {
    assert.equal(checkParcel({ country: "DE", valueEUR: 40, ioss: true, payment: "ddp", shipDate: d }).verdict, "cannot_post");
  });
  it("Italy IOSS DDP → accepted", () => {
    const r = checkParcel({ country: "IT", valueEUR: 120, itemLines: 3, ioss: true, payment: "ddp", shipDate: d });
    assert.equal(r.verdict, "can_post");
    assert.equal(r.route.id, "ioss_ddp");
    assert.equal(r.charges.knownTotalEUR, 15);
  });
  it("France IOSS DAP → other route (DDP)", () => {
    const r = checkParcel({ country: "FR", valueEUR: 50, ioss: true, payment: "dap", shipDate: d });
    assert.equal(r.verdict, "can_post_other_route");
    assert.match(r.summary, /DDP/);
  });
  it("Austria IOSS default → other route (no IOSS) + UGX alternative", () => {
    const r = checkParcel({ country: "AT", valueEUR: 50, ioss: true, shipDate: d });
    assert.equal(r.route.id, "ioss_dap");
    assert.equal(r.verdict, "can_post_other_route");
    assert.ok(r.alternatives.some((a) => /UGX/.test(a)));
  });
  it("Greece: no UGX alternative", () => {
    const r = checkParcel({ country: "GR", valueEUR: 50, shipDate: d });
    assert.equal(r.verdict, "can_post");
    assert.equal(r.ugxAvailable, false);
    assert.ok(r.alternatives.every((a) => !/points to UGX/.test(a)));
  });
  it("€150 is low value, €150.01 is not", () => {
    assert.equal(checkParcel({ country: "ES", valueEUR: 150, shipDate: d }).charges.dutyBasis, "flat_eur3_per_item");
    const hi = checkParcel({ country: "ES", valueEUR: 150.01, ioss: true, shipDate: d });
    assert.equal(hi.charges.dutyBasis, "eu_common_tariff");
    assert.equal(hi.charges.dutyEUR, null);
    assert.equal(hi.charges.uhfEUR, 2);
    assert.equal(hi.route.id, "no_ioss_dap");
    assert.equal(hi.pid.required, false);
    assert.ok(hi.warnings.some((w) => /IOSS only covers/.test(w)));
  });
  it("after 2028-07-01 the flat duty is not assumed", () => {
    const r = checkParcel({ country: "NL", valueEUR: 20, shipDate: "2028-07-01" });
    assert.equal(r.charges.dutyBasis, "eu_common_tariff");
    assert.equal(r.charges.uhfEUR, 2);
  });
  it("yen conversion", () => {
    const r = checkParcel({ country: "BE", valueJPY: 16500, eurJpy: 165, shipDate: d });
    assert.equal(r.valueEUR, 100);
    assert.throws(() => checkParcel({ country: "BE", valueJPY: 16500, shipDate: d }), /eurJpy/);
  });
});

describe("gift / b2b", () => {
  it("gift ≤ €45 to Germany is exempt and accepted", () => {
    const r = checkParcel({ country: "DE", kind: "gift", valueEUR: 45, itemLines: 2, shipDate: d });
    assert.equal(r.verdict, "can_post");
    assert.equal(r.charges.dutyBasis, "exempt");
    assert.equal(r.charges.uhfEUR, 0);
  });
  it("gift > €45 → common tariff", () => {
    assert.equal(checkParcel({ country: "FR", kind: "gift", valueEUR: 45.5, shipDate: d }).charges.dutyBasis, "eu_common_tariff");
  });
  it("b2b → no UHF, VAT number action", () => {
    const r = checkParcel({ country: "DE", kind: "b2b", valueEUR: 500, shipDate: d });
    assert.equal(r.verdict, "can_post");
    assert.equal(r.charges.uhfEUR, 0);
    assert.ok(r.actions.some((a) => /VAT number/.test(a)));
  });
});

describe("input errors", () => {
  it("before 2026-11-09", () => {
    assert.throws(() => checkParcel({ country: "FR", valueEUR: 10, shipDate: "2026-11-01" }), /on or after/);
  });
  it("bad date / lines / value", () => {
    assert.throws(() => checkParcel({ country: "FR", valueEUR: 10, shipDate: "2026-11-31" }), /real date/);
    assert.throws(() => checkParcel({ country: "FR", valueEUR: 10, itemLines: 0, shipDate: d }), /itemLines/);
    assert.throws(() => checkParcel({ country: "FR", shipDate: d }), /valueEUR/);
  });
});
