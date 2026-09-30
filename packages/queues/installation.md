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

Run the installer to publish configuration files and database migrations:

```bash
php spark jengo:install queue
```

This will publish:
- `app/Config/Queue.php` - Primary queue connection configuration.
- `app/Database/Migrations/{timestamp}_create_queue_tables.php` - Migration creating `queue_jobs` and `queue_failed_jobs` tables.

---

## 3. Run Database Migrations

Apply the published database migrations to create the required queue storage tables:

```bash
php spark migrate
```
