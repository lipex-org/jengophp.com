# Local Development & Webhook Tunneling

When developing locally (`http://localhost:8080`), external payment gateways (Safaricom Daraja, Pesapal, Stripe) cannot send HTTP callbacks directly to your machine. This guide covers how to set up local tunneling and configure callback URLs.

---

## 1. Using Reverse Proxy Tunnels

Use a tunneling tool such as **Ngrok**, **Cloudflare Tunnels**, or **Expose** to expose your local CodeIgniter 4 application to the internet.

### Example with Ngrok
```bash
ngrok http 8080
```

Ngrok provides a public HTTPS forwarding URL (e.g. `https://a1b2-3c4d.ngrok-free.app`).

---

## 2. Configuring `.env` with the Public Tunnel

Update your project's `.env` file so reverse routing (`route_to('pesa.webhook', ...)`) generates the public HTTPS domain:

```env
# Point app baseURL to the tunnel domain
app.baseURL = 'https://a1b2-3c4d.ngrok-free.app/'

# M-Pesa Settings
pesa.gateways.mpesa.env = sandbox
pesa.gateways.mpesa.shortcode = 174379
pesa.gateways.mpesa.consumer_key = your_sandbox_consumer_key
pesa.gateways.mpesa.consumer_secret = your_sandbox_consumer_secret
pesa.gateways.mpesa.passkey = bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919

# Webhook URLs
pesa.gateways.mpesa.callback_url = 'https://a1b2-3c4d.ngrok-free.app/pesa/webhook/mpesa'
```

---

## 3. Registering C2B Validation/Confirmation on the Tunnel

With the tunnel running, execute the C2B registration command with your public tunnel URL:

```bash
php spark jengo:pesa mpesa register-c2b \
  --shortcode=600999 \
  --validation="https://a1b2-3c4d.ngrok-free.app/pesa/webhook/mpesa" \
  --confirmation="https://a1b2-3c4d.ngrok-free.app/pesa/webhook/mpesa"
```

---

## 4. Testing with the `fake` Driver

If you do not have internet access or want to run offline unit tests, switch to the built-in `fake` gateway:

```env
pesa.default = fake
```

The `fake` driver handles STK pushes, status queries, hosted checkouts, and payouts in memory without external network calls.
