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
| `--no-link` | Do not automatically link project models with `#[UseSchema]` and `HasSchema` trait. |

By default, generating a schema automatically inspects your application's `app/Models` directory and injects the `HasSchema` trait and `#[UseSchema]` attribute into the corresponding Model.

## 3. Link Existing Models to Schemas

For existing projects with predefined models and schemas, you can link models to their respective schemas without re-generating schema files:

```bash
# Automatically discover and link all matching models and schemas
php spark jengo:schema link

# Link a specific model to a specific schema
php spark jengo:schema link --model UserModel --schema UserSchema

# Preview changes without modifying files
php spark jengo:schema link --dry-run

# Force update existing links
php spark jengo:schema link --force
```

### Link Command Options

| Option | Description |
| :--- | :--- |
| `--model` | Specify a specific model class to link (e.g. `UserModel` or `App\Models\UserModel`). |
| `--schema` | Specify a specific schema class to link to (e.g. `UserSchema` or `App\Schemas\UserSchema`). |
| `--dry-run` | Simulate linking without modifying files on disk. |
| `--force` | Force re-linking even if the model already has `#[UseSchema]`. |
| `--with-vendor` | Allow linking models inside vendor directory (defaults to false). |

