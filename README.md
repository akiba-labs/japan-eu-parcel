# Japan EU Parcel Check

Free checker for sending parcels from Japan to the EU by Japan Post after the 2026 EU rules: whether Japan Post accepts it (Germany refuses online-sale mail from 2026-11-09), which route works per country (IOSS + DDP via Zonos, IOSS + DAP, no IOSS), the €3 temporary duty + €2 Union handling fee per item, the PID rule and the €45 gift limit.

Live: https://japan-eu-parcel.vercel.app

- API: `GET /api/check?country=FR&kind=sale&valueEUR=60&itemLines=2` (keyless, CORS), `/api/rules`, `/openapi.json`, `/llms.txt`
- MCP: `japan_eu_parcel_check` on https://free-agent-tools.vercel.app/mcp

Sources: Japan Post EU notice 続報6 (2026-11-09, 1109_01), country-conditions change (1104_01), UGX Europe notice (1022_01); European Commission guidance on the EUR 3 customs duty and Union handling fee (version 5 Oct 2026); Council and Revenue (Ireland) pages. Rules as of 2026-11-11. `lib/jp-1109-matrix.json` is the parsed Japan Post table used by the tests.

**Disclaimer:** educational, not customs, tax or legal advice; not affiliated with Japan Post, Zonos or the European Commission. Japan Post and destination customs decide; check Japan Post's country conditions before you send.

Dev: `npm ci && npm test && npm run build`
