# jengo/base

`jengo/base` is the foundational package of the Jengo ecosystem. It provides the essential CLI tooling, architectural blueprints, and runtime utilities required to accelerate CodeIgniter 4 development.

---

## What's Inside

| Section | Description |
| :--- | :--- |
| [Core Architecture](#core-architecture) | The Blueprint UI layout system installed when you bootstrap a Jengo application. |
| [Dependency Injection](/packages/base/dependency-injection) | PSR-11 container, recursive constructor autowiring, method injection, and `#[Bind]` caching. |
| [Helpers & Utilities](/packages/base/helpers) | Global helper functions: `page()`, `str()`, `arr()`, `vite_tags()`, `sqids_hash()`, `model_of()` and environment checks. |
| [Entities & Validation](/packages/base/entities-validation) | `BaseEntity` with Sqids ID obfuscation and `ValidatedData` DTOs. |
| [Core Libraries](/packages/base/libraries) | The fluent `Str`, `Arr`, and `PackageManager` libraries. |
| [Pest Testing Suite](/packages/base/testing) | Fluent database test runner (`PestDatabaseBuilder`) and `DatabaseTestCase`. |
| [Commands & CLI](/packages/base/commands/) | Consolidated CLI Master/Variant system, `jengo:dev` console, generators, and diagnostics. |
| [Data Mappings](/packages/base/mapping/) | The bidirectional mapping engine between arrays, third-party entities, DTOs, and Jengo entities. |

---

## Core Architecture

When you bootstrap a Jengo application, `jengo/base` establishes a robust UI and backend architecture known as the **Blueprint**.

### The Blueprint UI

The Blueprint is a Tailwind-styled, responsive layout system that serves as the starting point for your application.

- `app/Views/layouts/base.layout.php`: The HTML skeleton containing the `<head>`, meta tags, fonts, and base structure.
- `app/Views/layouts/app.layout.php`: The main application shell extending `base`, featuring a responsive navigation bar and a standard content area.
- `app/Views/layouts/partials/`: Contains modular fragments like `header.layout.partial.php` (for Vite tag injection) and footers.
