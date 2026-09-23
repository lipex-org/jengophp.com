# Installation

Install via Composer:

```bash
composer require jengo/storage
```

> **Prerequisite:** `jengo/storage` requires either the **GD** (`ext-gd`) or **Imagick** (`ext-imagick`) extension to be installed and enabled in your PHP runtime.

Connect the public storage symlink:

```bash
php spark storage:link
```
