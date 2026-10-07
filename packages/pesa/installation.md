# Installation & Setup

Install the package via Composer into your CodeIgniter 4 project:

```bash
composer require jengo/pesa
```

---

## 1. Automated Installation (Recommended)

Run the automated Jengo installer to publish configuration and execute database migrations in one command:

```bash
php spark jengo:install pesa
```

---

## 2. Manual Installation

Alternatively, you can run the individual steps manually:

### Publish Configuration
```bash
php spark config:publish Jengo\\Pesa\\Config\\Pesa
```

### Run Database Migrations
```bash
php spark migrate -k jengo/pesa
```
