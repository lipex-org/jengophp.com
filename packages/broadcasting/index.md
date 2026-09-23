# jengo/broadcasting

> [!WARNING]
> **DEVELOPMENT / EXPERIMENTAL STATUS**
> This package and its built-in pure-PHP WebSocket daemon (`php spark broadcast:serve`) are currently in **active development and experimental status**.
> **THIS PACKAGE IS NOT PRODUCTION READY.**
> - The built-in WebSocket daemon is provided strictly for **local development**, **rapid prototyping**, and **experimental testing**.
> - It has not undergone formal security audits, multi-process clustering hardening, or long-term socket leak stress tests.
> - Do not deploy or rely on this package in production or mission-critical environments.

---

`jengo/broadcasting` is a real-time event broadcasting subsystem for **CodeIgniter 4** and the **Jengo Framework**. It bridges server-side PHP domain events to frontend client interfaces over WebSockets and Server-Sent Events (SSE), enabling instantaneous UI updates without client polling.

---

## What's Inside

| Section | Description |
| :--- | :--- |
| [Key Capabilities](#key-capabilities) | A summary of everything the package ships with. |
| [Installation](./installation) | Install via Composer and publish configuration. |
| [Configuration](./configuration) | Connection definitions and channel authorization. |
| [The Broadcasting Mental Model](./mental-model) | How server push differs from client pull. |
| [Practical Application Guides](./guides/) | Five practical patterns for real-time features. |
| [Local Development WebSocket Server](./dev-server) | Run the built-in daemon with `broadcast:serve`. |
| [Frontend Client (`@jengo/broadcasting`)](./frontend-client/) | Unified client with React, Vue, and Svelte hooks. |
| [Testing with `Broadcast::fake()`](./testing) | In-memory fake with broadcast assertions. |
| [Production Readiness Roadmap](./roadmap) | Milestones required before production workloads. |

---

## Key Capabilities

- **Multi-Driver Architecture**: Pusher Channels, Soketi, Laravel Reverb, Server-Sent Events (SSE), Redis Pub/Sub, Ably, Log, and Null drivers.
- **Pure-PHP Server-Sent Events (SSE)**: Built-in, zero-daemon streaming engine delivering real-time events directly through standard PHP-FPM web workers without requiring background Node.js or WebSocket processes.
- **Built-in Development WebSocket Daemon**: Native RFC 6455 and Pusher Protocol v7 WebSocket server (`php spark broadcast:serve`) built with PHP `stream_select` for zero-dependency local development and testing.
- **Channel Hierarchy**: Standard public (`Channel`), private (`PrivateChannel`), and presence (`PresenceChannel`) value objects.
- **Declarative Channel Authorization**: Define channel rules via `Broadcast::channel('orders.{id}', fn($user, $id) => ...)` with wildcard parameter binding.
- **Event-Driven & Fluent Broadcasting**: Broadcast domain events implementing `ShouldBroadcast` or dispatch ad-hoc payloads via `Broadcast::on('orders')->as('OrderPlaced')->send()`.
- **Wire-Compatible with Laravel Echo & Pusher JS**: Integrates directly with standard frontend WebSocket client libraries.
- **Sender Exclusion (`toOthers()`)**: Exclude the initiating client's socket ID from receiving their own broadcast to prevent duplicate renders and interface stutter.
- **Zero-Cost Test Double (`Broadcast::fake()`)**: In-memory test double with comprehensive assertions (`assertBroadcasted`, `assertBroadcastedTo`, `assertNotBroadcasted`).
