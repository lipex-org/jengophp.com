# Jengo Ecosystem

Jengo is a modern developer experience and tooling ecosystem designed for CodeIgniter 4. It provides full-stack starter kits, front-end build pipelines, authentication engines, async job processing, and native TypeScript client libraries.

This repository hosts the official documentation site for the Jengo ecosystem, built with [VitePress](https://vitepress.dev/).

---

## Ecosystem Repositories

### Core & Framework Packages (PHP / Composer)

| Package | Repository | Description |
| :--- | :--- | :--- |
| **`jengo/base`** | [lipex-org/jengo-base](https://github.com/lipex-org/jengo-base) | Core foundation, CLI installer hooks, Vite integration, Blade-like Blueprint views, and system setup hub. |
| **`jengo/installer`** | [lipex-org/jengo-installer](https://github.com/lipex-org/jengo-installer) | Interactive CLI application (`jengo new`) for scaffolding new CodeIgniter 4 projects with full stack defaults. |
| **`jengo/auth`** | [lipex-org/jengo-auth](https://github.com/lipex-org/jengo-auth) | Unified Authentication and Vima RBAC/ABAC authorization engine for CodeIgniter 4. |
| **`jengo/inertia`** | [lipex-org/jengo-inertia](https://github.com/lipex-org/jengo-inertia) | Inertia.js adapter for CodeIgniter 4 with Vue 3, React 19, and Svelte 5 support. |
| **`jengo/api`** | [lipex-org/jengo-api](https://github.com/lipex-org/jengo-api) | Zero-boilerplate REST API engine, automatic resource routing, validation, and serialization. |
| **`jengo/queues`** | [lipex-org/jengo-queues](https://github.com/lipex-org/jengo-queues) | Multi-driver asynchronous job queue system and CLI worker management (Database, Redis, Sync). |
| **`jengo/broadcasting`** | [lipex-org/jengo-broadcasting](https://github.com/lipex-org/jengo-broadcasting) | Real-time event broadcasting subsystem supporting WebSockets (Pusher/Soketi), Redis, and Server-Sent Events (SSE). |
| **`jengo/storage`** | [lipex-org/jengo-storage](https://github.com/lipex-org/jengo-storage) | Multi-disk filesystem abstraction, cloud storage adapters (S3, R2), and image transformation pipeline. |
| **`jengo/notifications`** | [lipex-org/jengo-notifications](https://github.com/lipex-org/jengo-notifications) | Multi-channel notification engine (Email, Database, SMS, Slack, Webhooks, Push, Broadcast). |
| **`jengo/search`** | [lipex-org/jengo-search](https://github.com/lipex-org/jengo-search) | Multi-driver full-text and semantic search indexing engine for application models. |
| **`jengo/ai`** | [lipex-org/jengo-ai](https://github.com/lipex-org/jengo-ai) | Multi-provider AI SDK and Agentic engine for CodeIgniter 4 (OpenAI, Anthropic, Gemini, Ollama). |
| **`jengo/pesa`** | [lipex-org/jengo-pesa](https://github.com/lipex-org/jengo-pesa) | Multi-gateway payment processing subsystem (M-Pesa Daraja 3.0, Pesapal v3, Stripe, Flutterwave). |
| **`jengo/pdf`** | [lipex-org/jengo-pdf](https://github.com/lipex-org/jengo-pdf) | Modern, multi-driver PDF generation and document reporting engine. |
| **`jengo/schema`** | [lipex-org/jengo-schema](https://github.com/lipex-org/jengo-schema) | Fluent database schema definition and migration toolkit for CodeIgniter 4. |

---

### Client Libraries & Frontend Tooling (npm / TypeScript)

| Package | Repository | Description |
| :--- | :--- | :--- |
| **`@jengo/vite`** | [lipex-org/jengo-vite-plugin](https://github.com/lipex-org/jengo-vite-plugin) | Official Vite plugin for seamless CodeIgniter 4 view asset compilation and Hot Module Replacement (HMR). |
| **`@jengo/mreja`** | [lipex-org/jengo-mreja](https://github.com/lipex-org/jengo-mreja) | Universal TypeScript full-stack integration toolkit, type-safe route generation, and client utilities. |
| **`@jengo/broadcasting`** | [lipex-org/jengo-broadcasting-client](https://github.com/lipex-org/jengo-broadcasting-client) | Universal client library for subscribing to real-time broadcast channels via WebSockets or Server-Sent Events (SSE). |
| **`@jengo/storage`** | [lipex-org/jengo-storage-client](https://github.com/lipex-org/jengo-storage-client) | Client library for chunked uploads, resumable file transfers, and direct-to-cloud S3/R2 uploads. |

---

## Quick Start

Create a new Jengo CodeIgniter 4 application using Composer:

```bash
composer global require jengo/installer
jengo new my-app
```

Or initialize a project directly using an Inertia starter kit:

```bash
# React 19 Starter Kit
jengo new my-app --kit=react --auth=jengo

# Vue 3 Starter Kit
jengo new my-app --kit=vue --auth=jengo

# Svelte 5 Starter Kit
jengo new my-app --kit=svelte --auth=jengo
```

---

## Documentation Site Development

To run the documentation site locally:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the local development server**:
   ```bash
   npm run dev
   ```

3. **Build static production assets**:
   ```bash
   npm run build
   ```

The local development server runs at `http://localhost:5173`.

---

## License

The Jengo Framework and its ecosystem packages are open-source software licensed under the [MIT License](https://opensource.org/licenses/MIT).
