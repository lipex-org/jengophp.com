# CLI Commands

`jengo/pesa` integrates with Jengo Base's nested variant command architecture.

---

## 1. Register M-Pesa C2B URLs

Register validation and confirmation URLs with Safaricom Daraja for Paybills or Buy Goods Till numbers:

```bash
# Nested sub-variant syntax
php spark jengo:pesa mpesa register-c2b --shortcode=600999

# Or colon-separated syntax
php spark jengo:pesa mpesa:register-c2b --shortcode=600999
```

### Options

| Option | Description |
| :--- | :--- |
| `--shortcode` | Paybill or Buy Goods shortcode (defaults to config if omitted) |
| `--type` | Response type: `Completed` (default) or `Cancelled` |
| `--validation` | Custom validation URL (defaults to `{site_url}/pesa/webhook/mpesa`) |
| `--confirmation` | Custom confirmation URL (defaults to `{site_url}/pesa/webhook/mpesa`) |

---

## 2. Command Help & Discovery

Explore available variants and nested sub-variants dynamically:

```bash
# Root help
php spark jengo:pesa

# Mpesa parent variant help
php spark jengo:pesa mpesa

# Specific leaf command help
php spark jengo:pesa mpesa register-c2b
```
