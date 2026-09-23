# Spark CLI Commands

## 1. Publish Configuration

```bash
php spark jengo:schema setup
```

## 2. Generate Schemas & TypeScript Definitions

Scan your database and automatically generate PSR-4 Schema classes:

```bash
php spark jengo:schema generate
```

Generate TypeScript interfaces for frontend consumption:

```bash
php spark jengo:schema generate --ts --ts-dir=resources/js/types/schemas
```

### Available Command Options

| Option | Description |
| :--- | :--- |
| `--table` | Generate schema for a specific table only. |
| `--force` | Force overwrite existing schema files. |
| `--dbgroup` | Specify database group (defaults to `default` or `tests`). |
| `--namespace` | Custom namespace for schema classes (defaults to `App\Schemas`). |
| `--dir` | Directory where schema files will be stored (defaults to `app/Schemas`). |
| `--dry-run` | Simulate generation without creating or modifying files. |
| `--with-vendor` | Include vendor and system tables. |
| `--ts` | Generate TypeScript definition files (`.d.ts`). |
| `--ts-dir` | Directory for TypeScript definition files. |
