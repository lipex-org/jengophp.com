# Database Automation

Jengo provides an incredibly smooth out-of-the-box database experience, enabling you to start writing code instantly without setting up local MySQL servers.

## Zero-Config SQLite

By default, the Jengo Installer configures your new application to use an **SQLite** database. 

During the installation process, the `DbInstaller` automatically:
1. Parses your `app/Config/Database.php`.
2. Comments out the default MySQL block.
3. Uncomments the SQLite block and points it to `WRITEPATH . 'database.db'`.

## Automatic Migrations

After configuring the connection, the installer automatically executes:

```bash
php spark migrate --all
```

If you included the Auth suite (`--auth`), this means that the `users`, `auth_identities`, and `auth_logins` tables are created for you immediately. You can boot the application and register a user right away!

## Switching to Production Databases

When you are ready to deploy or switch to a robust local database (like MySQL or PostgreSQL), simply open your `app/Config/Database.php`, comment the SQLite block back out, and uncomment your preferred database driver.

---

## Declarative Schemas & Relationship Derivation

For complex applications requiring type-safe queries and relationship hydration, Jengo provides **`jengo/schema`**:
- **Declarative PHP 8 Schema Attributes**: Map database tables, primary keys, fields, and computed attributes.
- **Automatic Relationship Derivation**: Seamlessly join and hydrate deeply nested single (`BelongsTo`) and collection (`HasMany`) relationships with zero N+1 queries.
- **Context-Aware Pagination Clamping**: Automatically clamp out-of-scope page numbers to the last available page for UI requests while preserving raw JSON responses for headless APIs.
- **Virtual Schemas**: Query directly from existing CodeIgniter 4 Model classes without writing dedicated schema classes.
- **TypeScript Interface Generation**: Generate `.d.ts` interfaces matching your database schemas directly from table metadata.

For complete guides and API references, see the [jengo/schema package documentation](/packages/schema).

---

## Data Mappings & Entity Interoperability

When integrating third-party CodeIgniter 4 packages (such as CodeIgniter Shield, Myth:Auth, or custom vendor packages) whose entities do not extend Jengo's `BaseEntity`, use the **Data Mapping Engine** from `jengo/base`:
- **Bidirectional Mapping**: Map between arrays, third-party entities, and Jengo entities.
- **Entity Synchronization**: Push modifications back into third-party entities with `$entity->syncTo($source)` or reconstruct the original entity with `$entity->toOriginal()`.
- **PHP 8 Mapping Attributes**: Declaratively configure column aliases, exclusions, and custom transformers (`#[MapFrom]`, `#[MapTo]`, `#[MapProperty]`, `#[MapIgnore]`, `#[MapWith]`).
- **Nested Casting**: Automatically hydrate child entities and collections using `#[MapCast]`.

For complete guides and API references, see the [jengo/base Data Mappings documentation](/packages/base#data-mappings).

