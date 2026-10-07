# Installation & Setup

Install the package via Composer into your CodeIgniter 4 project:

```bash
composer require jengo/pesa
```

---

## 1. Run Database Migrations

`jengo/pesa` includes a migration for the `pesa_transactions` ledger table to track transaction states and protect against duplicate webhook events.

Run the migration using Spark:

```bash
php spark migrate -k jengo/pesa
```

---

## 2. Publish Configuration

Publish the configuration file to your `app/Config/` directory:

```bash
php spark config:publish Jengo\\Pesa\\Config\\Pesa
```

This creates `app/Config/Pesa.php` where you can configure gateway credentials, currency, and ledger options.
