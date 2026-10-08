# Production & Go-Live Checklist

Before transitioning from sandbox/test environments to live production payment processing with Safaricom Daraja 3.0, Pesapal, or Stripe, review this checklist.

---

## 1. Safaricom Daraja 3.0 Live Migration

1. **Production Credentials**:
   - Obtain your production `Consumer Key` and `Consumer Secret` from the [Safaricom Daraja Developer Portal](https://developer.safaricom.co.ke).
   - In production, your Paybill/Till shortcode and passkey will be provided upon completing Safaricom KYC verification.
2. **Environment Toggle**:
   ```env
   pesa.gateways.mpesa.env = live
   pesa.gateways.mpesa.shortcode = your_live_shortcode
   pesa.gateways.mpesa.consumer_key = your_live_consumer_key
   pesa.gateways.mpesa.consumer_secret = your_live_consumer_secret
   pesa.gateways.mpesa.passkey = your_live_passkey
   ```
3. **Mandatory HTTPS & Valid SSL**:
   - Safaricom Daraja rejects any callback or webhook URL that is not served over valid HTTPS with a trusted CA certificate (self-signed certs are rejected).
4. **B2C Public Certificate Installation (for Payouts)**:
   - Download the Safaricom Production Public Certificate (`.cer` file).
   - Place it in a secure non-public directory (e.g. `writable/certs/ProductionCertificate.cer`) and configure `cert_path`:
   ```env
   pesa.gateways.mpesa.initiator_name = live_initiator_username
   pesa.gateways.mpesa.initiator_password = live_plaintext_initiator_password
   pesa.gateways.mpesa.cert_path = '/path/to/writable/certs/ProductionCertificate.cer'
   ```
5. **Register Live C2B URLs**:
   ```bash
   php spark jengo:pesa mpesa register-c2b --shortcode=your_live_shortcode
   ```

---

## 2. Pesapal v3 Go-Live

1. Switch endpoint from Cybqa Sandbox to Live:
   ```env
   pesa.gateways.pesapal.env = live
   pesa.gateways.pesapal.consumer_key = your_live_key
   pesa.gateways.pesapal.consumer_secret = your_live_secret
   ```
2. Register your live IPN URL with Pesapal and set the resulting `notification_id` in `app/Config/Pesa.php` or `.env` (`pesa.gateways.pesapal.ipn_id`).

---

## 3. Stripe Production Setup

1. Configure live secret key and live webhook signing secret:
   ```env
   pesa.gateways.stripe.secret = sk_live_...
   pesa.gateways.stripe.webhook_secret = whsec_...
   ```
2. In the Stripe Dashboard, add your webhook endpoint `https://yourdomain.com/pesa/webhook/stripe` listening for `checkout.session.completed`, `payment_intent.succeeded`, and `charge.refunded`.

---

## 4. Database & Ledger Health

- Verify that `php spark migrate --all` has executed cleanly in production and the `pesa_transactions` table exists with appropriate indexing on `gateway`, `gateway_reference`, `reference`, and `status`.
- Ensure database timezone is aligned with UTC or Africa/Nairobi.
