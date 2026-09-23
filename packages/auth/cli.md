# CLI Commands

## Jengo Auth Commands

```bash
# Publish configuration, migrations, and routes
php spark jengo:auth setup

# Migrate users and credentials from CodeIgniter Shield
php spark jengo:auth import:shield [--dry-run]
```

## Vima Authorization Commands

```bash
# Synchronize roles and permissions from Setup.php to database
php spark vima:sync

# Generate PHP mappers and TypeScript interfaces
php spark vima:maps:generate [--ts]

# Create role or permission directly via CLI
php spark vima:role:create <name>
php spark vima:permission:create <name>

# Grant role or permission to user
php spark vima:grant <user-id> <role|permission>

# Explicitly deny permission to user
php spark vima:deny <user-id> <permission> [reason]

# Scaffold an ABAC Policy class
php spark vima:make:policy <PolicyName>
```
