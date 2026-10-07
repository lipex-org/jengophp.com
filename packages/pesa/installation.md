# Installation & Setup

Install the package via Composer into your CodeIgniter 4 project:

```bash
composer require jengo/pesa
```

---

## 1. Run the Jengo Installer

Run the installer to publish the configuration file and run the internal migrations:

```bash
php spark jengo:install pesa
```

This will automatically:
- Publish `app/Config/Pesa.php`
- Run database migrations (`pesa_transactions` table) via `php spark migrate --all`

---

## 2. Manual Installation (Alternative)

If you prefer to configure manually:

1. Copy `vendor/jengo/pesa/src/Config/Pesa.php` to `app/Config/Pesa.php` and adjust namespace to `namespace Config;` extending `Jengo\Pesa\Config\Pesa`.
2. Run database migrations:

```bash
php spark migrate --all
```

