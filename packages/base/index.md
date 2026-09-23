# jengo/base

`jengo/base` is the foundational package of the Jengo ecosystem. It provides the essential CLI tooling, architectural blueprints, and runtime utilities required to accelerate CodeIgniter 4 development.

---

## What's Inside

| Section | Description |
| :--- | :--- |
| [Core Architecture](/packages/base/#core-architecture) | The Blueprint UI layout system installed when you bootstrap a Jengo application. |
| [Helpers & Utilities](/packages/base/helpers) | Global helper functions: `page()`, `str()`, `arr()`, `vite_tags()`, `model_of()` and environment checks. |
| [Command Variant Architecture](/packages/base/command-variants) | The Master/Variant CLI system behind `jengo:make` and how to extend it. |
| [Resource Generators](/packages/base/generators) | Boilerplate generators, the Auditor, Observer, Guardian, and Vite diagnostics. |
| [Core Libraries](/packages/base/libraries) | The fluent `Str`, `Arr`, and `PackageManager` libraries. |
| [The Setup Hub](/packages/base/setup) | Progressive system integrations via `jengo:setup`. |
| [Data Mappings](/packages/base/mapping/) | The bidirectional mapping engine between arrays, third-party entities, DTOs, and Jengo entities. |

---

## Core Architecture

When you bootstrap a Jengo application, `jengo/base` establishes a robust UI and backend architecture known as the **Blueprint**.

### The Blueprint UI

The Blueprint is a Tailwind-styled, responsive layout system that serves as the starting point for your application.

- `app/Views/layouts/base.layout.php`: The HTML skeleton containing the `<head>`, meta tags, fonts, and base structure.
- `app/Views/layouts/app.layout.php`: The main application shell extending `base`, featuring a responsive navigation bar and a standard content area.
- `app/Views/layouts/partials/`: Contains modular fragments like `header.layout.partial.php` (for Vite tag injection) and footers.
