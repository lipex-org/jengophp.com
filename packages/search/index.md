# Introduction to Jengo Search

`jengo/search` provides high-performance, unified full-text search engine integration for CodeIgniter 4 and the Jengo Framework.

It delivers instant typo-tolerant search across **Meilisearch**, **Typesense**, and zero-configuration **Database Full-Text** engines with **zero heavy external SDK dependencies** (communicating entirely via HTTP using CodeIgniter 4's native `CURLRequest`).

---

## Key Features

- **Multi-Driver Engine Support**: Seamlessly switch between Meilisearch, Typesense, MySQL/MariaDB Full-Text, and Null drivers.
- **Zero Third-Party SDK Bloat**: Pure native REST client implementation built on top of CI4's HTTP service.
- **Declarative PHP 8 Attributes**: Annotate models with `#[SearchIndex]` for automated schema configuration, filterable/sortable attribute indexing, and key mapping.
- **Automatic Lifecycle Syncing**: Automatically index, update, or purge documents when records are inserted, modified, or deleted.
- **Fluent Query Builder**: Clean, chainable API supporting filters, sorting, faceting, pagination, and multi-field highlighting.
- **Fast CLI Tooling**: Spark commands for bulk indexing (`jengo:search import`), clearing indexes (`jengo:search flush`), syncing schemas (`jengo:search sync-settings`), and health monitoring (`jengo:search status`).
- **Zero-Cost Test Fake**: Full `Search::fake()` driver with expressive PHPUnit assertions.
