# jengo/api

`jengo/api` is an automated, configuration-driven REST API and OpenAPI/Swagger engine for **CodeIgniter 4** and the **Jengo Framework**. It provides declarative resource routing, schema-driven querying, atomic bulk transactional writes, validation form mapping, and real-time interactive Swagger documentation.

---

## What's Inside

| Section | Description |
| :--- | :--- |
| [Key Capabilities](#key-capabilities) | A summary of everything the package ships with. |
| [Installation](./installation) | Install via Composer and publish the config. |
| [Defining Resource Configurations](./resource-config) | Access policies, versioning, allowed relations, and validation rules. |
| [Registering Resources](./registering) | Wire resources into `app/Config/JengoApi.php`. |
| [Routes & Swagger Documentation](./routing) | Publish versioned endpoints, OpenAPI JSON, and interactive Swagger UI. |
| [Query Parameters](./query-parameters) | Standardized pagination, sorting, search, and derivation params. |
| [Relational Mutations & Bulk Writes](./mutations) | Atomic batch and nested relational writes. |
| [Lifecycle Hooks](./lifecycle-hooks) | Intercept records before and after queries and saves. |
| [CLI Commands](./cli) | Scaffold resource configs and publish configuration. |

---

## Key Capabilities

- **Automated REST Resource Routing**: Expose full CRUD endpoints automatically with clean HTTP verb mapping (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
- **Interactive OpenAPI & Swagger UI**: Auto-generates complete OpenAPI 3.0 specs and embeds an interactive Swagger UI with zero manual annotation upkeep.
- **Declarative Resource Configurations**: Define access policies, versioning, allowed relations, and validation rules in clean `ResourceConfig` classes.
- **Relational Tree Derivations**: Query and resolve deeply nested relationship graphs on the fly using `?derive=relation_name`.
- **Atomic Bulk & Nested Writes**: Batch array insertions and nested relationship writes executed sequentially inside database transaction savepoints.
- **Database Key Obfuscation**: Native integration with Sqids to hash and decode auto-increment primary and foreign keys automatically.
- **Granular Validation Mapping**: Bind HTTP verbs directly to specific FormHandler or validation classes.
- **Lifecycle Mutation Hooks**: Intercept records before and after queries and saves via `beforeQuery`, `afterQuery`, `beforeSave`, and `afterSave`.
- **Version Mutation Chaining**: Chain and serve multiple concurrent API versions from a single routing declaration.
