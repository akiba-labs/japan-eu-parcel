import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { InputError } from "./agent-api";
import { EXAMPLE_GET, computeCheck } from "./api";

describe("computeCheck", () => {
  it("example get works", () => {
    const q = Object.fromEntries(new URL(`https://x.example${EXAMPLE_GET}`).searchParams);
    const r = computeCheck({ ...q, shipDate: "2026-11-11" });
    assert.equal(r.verdict, "can_post");
    assert.equal(r.charges.knownTotalEUR, 10);
    assert.ok(r.sources.length >= 6);
  });
  it("accepts aliases", () => {
    const r = computeCheck({ 宛先国: "ドイツ", 取引形態: "通販", 金額: "40ユーロ", date: "2026-11-11" });
    assert.equal(r.verdict, "cannot_post");
    const g = computeCheck({ to: "Germany", type: "贈り物", value: "30", items: "2", date: "2026-11-11" });
    assert.equal(g.kind, "gift");
    const i = computeCheck({ country: "IT", value: "€120", ioss: "yes", payment: "prepaid", lines: "3", date: "2026-11-11" });
    assert.equal(i.route.id, "ioss_ddp");
  });
  it("missing country → InputError", () => {
    assert.throws(() => computeCheck({ valueEUR: "10" }), InputError);
  });
  it("bad kind → InputError", () => {
    assert.throws(() => computeCheck({ country: "FR", valueEUR: "10", kind: "smuggle" }), InputError);
  });
  it("non-EU → InputError", () => {
    assert.throws(() => computeCheck({ country: "UK", valueEUR: "10" }), InputError);
  });
  it("bad number → InputError", () => {
    assert.throws(() => computeCheck({ country: "FR", valueEUR: "abc" }), InputError);
  });
});
