# Installation & Setup

## Requirements

- PHP 8.2 or higher
- CodeIgniter 4.4+ or Jengo Base Framework
- Optional search server:
  - [Meilisearch](https://www.meilisearch.com/) (v1.x+)
  - [Typesense](https://typesense.org/) (v26.0+)
  - MySQL 5.7+ / MariaDB 10.3+ (for database driver)

---

## Composer Installation

Install the package via Composer into your project:

```bash
composer require jengo/search
```

---

## Publishing Configuration

Run the Jengo installer to publish the configuration file to `app/Config/Search.php`:

```bash
php spark jengo:install search
```

Or copy the configuration manually if you prefer not to use the interactive installer.
