# Installation

Get started with `jengo/queues` in your CodeIgniter 4 application.

---

## 1. Install via Composer

Add `jengo/queues` to your project dependencies:

```bash
composer require jengo/queues
```

---

## 2. Run the Jengo Installer

Run the installer to publish the configuration file:

```bash
php spark jengo:install queue
```

This will publish:
- `app/Config/Queue.php` - Primary queue connection configuration.

---

## 3. Run Database Migrations

Run CodeIgniter's migration runner with the `--all` flag to automatically run the package's internal migrations:

```bash
php spark migrate --all
```
