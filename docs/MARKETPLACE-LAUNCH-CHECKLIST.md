# MOSH Digital Studios — Marketplace Launch Checklist

## Product readiness

- [ ] Confirm every featured product exists in `packaging/products/` or create a dedicated product entry.
- [ ] Confirm source files and entry points exist.
- [ ] Confirm product promise matches the actual files shipped.
- [ ] Confirm Standard/Premium variants where applicable.
- [ ] Confirm licence terms and client-work rights.
- [ ] Confirm bonus resources and FAQ content.
- [ ] Confirm cover/mockup requirements.

## Build and verification

- [ ] Run `npm run pkg:build`.
- [ ] Run `npm run pkg:mockups`.
- [ ] Run `npm run pkg:listings`.
- [ ] Run `npm run pkg:verify`.
- [ ] Confirm no `REPLACE-ME` values remain.
- [ ] Inspect generated ZIP manifests and checksums.
- [ ] Test extraction of each featured package.

## Shopify

- [ ] Create collections: AI Agents, Prompt Packs, Educational Products, Content Creation, Business Automation.
- [ ] Import/publish product listings.
- [ ] Configure digital delivery app or repository webhook delivery.
- [ ] Test checkout, payment confirmation and download delivery.
- [ ] Test refund/customer support path.

## Gumroad

- [ ] Create product pages.
- [ ] Add cover images.
- [ ] Upload ZIPs or configure versions.
- [ ] Add descriptions, bonuses and FAQ.
- [ ] Test a purchase and download.

## Selar

- [ ] Create listings.
- [ ] Configure GHS/NGN/USD prices.
- [ ] Enable relevant local payment methods.
- [ ] Confirm instant digital delivery.
- [ ] Test a purchase and download.

## Paystack Storefront

- [ ] Publish featured products.
- [ ] Configure categories.
- [ ] Configure Paystack webhook endpoint.
- [ ] Verify webhook signatures and delivery.
- [ ] Test charge-success-to-email-download flow.

## WhatsApp Business

- [ ] Create catalogue categories.
- [ ] Add product images, prices and descriptions.
- [ ] Add the appropriate payment path.
- [ ] Establish manual payment verification procedure.
- [ ] Use `npm run pkg:grant` for fulfilment after confirmed payment.
- [ ] Test customer handoff from WhatsApp to download.

## Marketing

- [ ] Create launch landing page.
- [ ] Create email capture.
- [ ] Prepare 30-day social content.
- [ ] Prepare product demos.
- [ ] Prepare testimonials/case studies only from genuine customers.
- [ ] Configure conversion tracking.
- [ ] Launch organic campaign.
- [ ] Start paid advertising after checkout and fulfilment tests pass.
- [ ] Add affiliate programme after baseline conversion/refund metrics are known.

## Membership

- [ ] Create MOSH Digital Studios Insider Club monthly offer at $19.
- [ ] Create annual offer at $149.
- [ ] Define entitlement to current and future products explicitly.
- [ ] Define cancellation/refund policy.
- [ ] Define member delivery/update mechanism.
