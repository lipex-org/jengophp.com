# Jengo Pesa (`jengo/pesa`)

A unified multi-gateway payment processing subsystem for CodeIgniter 4 and the Jengo Framework, featuring first-class support for Kenyan and African payment networks (M-Pesa Daraja 2.0, Pesapal v3, Flutterwave) alongside global providers (Stripe, PayPal).

---

## Key Capabilities

- **M-Pesa Daraja 2.0 Engine**:
  - **STK Push (Lipa Na M-Pesa Online)** with phone sanitization and password generation.
  - **C2B (Customer to Business)**: URL registration and instant confirmation handling for Paybills and Till numbers (Buy Goods).
  - **B2C (Business to Customer)**: Automated payouts, dividends, and salary disbursements.
  - **Status & Balance Queries**: Real-time polling and transaction resolution.
  - **OAuth Token Caching**: Automatic token reuse via CI4 Cache.
- **Multi-Gateway Drivers**: Switch between `mpesa`, `pesapal`, `stripe`, and `fake` drivers seamlessly.
- **Transaction Ledger (`pesa_transactions`)**: Full lifecycle logging with state machine (`pending` &rarr; `successful` | `failed` | `reversed`) and idempotency protection against duplicate callbacks.
- **Zero-Boilerplate Webhooks**: Pre-routed webhook controller (`/pesa/webhook/{gateway}`) with signature verification and typed events (`PaymentInitiated`, `PaymentSucceeded`, `PaymentFailed`, `PaymentReversed`).
- **Spark CLI Tools**: Nested variants (`php spark jengo:pesa mpesa register-c2b`).

---

## Documentation Sections

1. [Installation & Setup](/packages/pesa/installation)
2. [Configuration](/packages/pesa/configuration)
3. [M-Pesa Daraja Workflows](/packages/pesa/mpesa)
4. [Hosted Checkouts (Pesapal & Stripe)](/packages/pesa/hosted-checkouts)
5. [Webhooks & Events](/packages/pesa/webhooks)
6. [CLI Commands](/packages/pesa/cli)
7. [Testing with Fake Gateway](/packages/pesa/testing)
