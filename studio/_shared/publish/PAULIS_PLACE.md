# PAULI'S PLACE — The Store
## A mini-Amazon that ships only pure digital assets. Print-on-demand for anything physical. Zero inventory. Zero sunk cost.

The studio makes; the Place sells. They are separate systems joined by one contract: the **listing payload** rendered from a validated manifest.

---

## 1. What we sell (digital assets, not "digital products")

| Asset class | Made by | Sold as |
|-------------|---------|---------|
| Brand kits | full factory pipeline | instant-download package + license tiers |
| Logos | design stage | SVG/EPS package, exclusivity tiers |
| Flipbooks / interactive publications | web builder | Emerald Tablet-class download / hosted link |
| Posters | asset renderer | digital file + POD print (Printify-class) |
| 3D stickers / merch art | asset renderer | digital file + POD fulfillment |
| Scroll-world microsites | web builder | template license + customization upsell |

Rule: nothing is printed, stocked, or shipped before it's sold. POD handles anything physical.

---

## 2. The selling agents (workers of the Place)

| Agent | Job |
|-------|-----|
| **Trend Scout** | Pulls Google Trends + social signals (open-source agent-reach adapters). Proposes: "make X for this niche, this week." Output: opportunity brief into the factory intake. |
| **Merchant Agent** | Turns a validated asset into listings: title, tags, description (voice from manifest), pricing by tier, Etsy/Fiverr/direct-store payloads. |
| **Experiment Runner** | A/B tests listing titles, thumbnails, price points. UTM-tagged everything. Promotes winners, kills losers. Deterministic statistics, no vibes. |
| **Telemetry Clerk** | Records views → clicks → sales → margin per asset, per channel. Feeds the learning loop so the factory makes more of what sells. |

## 3. The flywheel

```
Trend Scout spots demand
  → factory intake (one brief, unattended run)
  → G5 human approval (the only touch)
  → Merchant Agent lists on PAULI'S PLACE + Etsy + Fiverr
  → Experiment Runner A/B tests
  → Telemetry proves what sells
  → next Trend Scout cycle is smarter
```

## 4. Storefront architecture

- Catalog, orders, licenses, telemetry: Postgres/Supabase (operational system of record)
- Asset files: object storage, content-addressed, immutable
- Fulfillment: instant download for digital; POD webhooks for physical
- Channels are adapters (Etsy, Fiverr, direct). The Place is the hub; channels come and go.
- Social publishing: approval-gated (Postiz-class adapter)

## 5. Money law

1. Margin is computed before listing: asset cost (route receipts) + channel fees + POD cost vs price floor. Below floor = don't list.
2. No paid ads until organic telemetry proves a listing converts.
3. One paid end-to-end loop (one real sale) before any feature expansion. This is the studio's sequencing law, repeated here because it's the one we're most tempted to break.

*PAULI'S PLACE v1 — where the factory's output becomes revenue*
