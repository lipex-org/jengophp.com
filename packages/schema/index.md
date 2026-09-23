# jengo/schema

`jengo/schema` is an enterprise declarative querying, relationship derivation, entity hydration, infinite-scrolling cursor pagination, and TypeScript definition generation engine for **CodeIgniter 4** and the **Jengo Framework**.

---

## What's Inside

| Section | Description |
| :--- | :--- |
| [Installation](./installation) | Install the package and publish the configuration file. |
| [Defining Schemas](./defining-schemas) | Declare models, fields, casts, and computed fields with PHP 8 Attributes. |
| [The Fluent Query API](./querying) | Chain conditions, sorting, and retrieval with the `query()` helper. |
| [Filtering & Conditions](./filtering) | The complete set of condition builders, from `whereIn` to `whereSince`. |
| [Relationship Derivation](./relationships) | Join and hydrate deeply nested single and collection relationships. |
| [Search](./search) | Full-text and multi-field search across root and related tables. |
| [Pagination & Infinite Scrolling](./pagination) | Offset pagination, cursor pagination, and page clamping. |
| [Virtual Schemas](./virtual-schemas) | Query directly from CI4 Models or raw tables without schema classes. |
| [Open Query Mode](./open-query-mode) | Parse `?include=&filter[]=&sort=` request params into query options. |
| [Spark CLI Commands](./cli) | Publish config, generate schemas, and generate TypeScript definitions. |
| [AI Agent Integration](./ai-integration) | Expose database structures to AI agents. |

---

## Key Capabilities

- **Declarative Schema Definitions**: Define database models, entity bindings, data types, and complex relationships using clean PHP 8 Attributes.
- **Fluent Query API**: Chain conditions, field selections, sorting, nested joins, and multi-field full-text searches with an intuitive builder syntax.
- **Automatic Relationship Derivation**: Seamlessly join and hydrate deeply nested single (`BelongsTo`) and collection (`HasMany`) relationships (e.g. `derive(['profile', 'files.comments'])`).
- **Dual Pagination Engines**: Traditional offset-based page links (`paginate(1, 15)`) and high-performance base64 opaque cursor pagination (`after($cursor)`) for infinite scrolling interfaces.
- **Pagination Clamping**: Automatically clamp out-of-range requested page numbers to the last available page.
- **Virtual Schemas & Dynamic Entities**: Query directly from CodeIgniter 4 Model classes (`query(UserModel::class)`) or raw database tables (`query('users')->as(User::class)`) without writing physical schema classes.
- **Open Query Mode (Request-Driven)**: Automatically parse incoming HTTP request parameters (`?include=...&filter[status]=...&sort=-created_at`) directly into type-safe query options.
- **TypeScript Interface Generation**: Generate matching TypeScript definitions (`.d.ts`) alongside PHP Schemas directly from database metadata.
- **AI Capability Integration**: Expose database structures, foreign keys, and column metadata to AI agents via `DatabaseSchemaCapabilityProvider`.
