# jengo/inertia

`jengo/inertia` is the official CodeIgniter 4 adapter for [Inertia.js](https://inertiajs.com/).

Inertia allows you to create fully client-side rendered, single-page apps (SPAs) without much of the complexity that comes with modern SPAs. It does this by leveraging existing server-side routing and controllers.

---

## What's Inside

| Section | Description |
| :--- | :--- |
| [Core Concept](#core-concept) | How Inertia intercepts responses to swap page components. |
| [Basic Usage](./basic-usage) | Returning Inertia responses from controllers. |
| [Inertia v3 Features](./v3-features) | Deferred, lazy, once, merge, and always props. |
| [History & Navigation Control](./history-control) | Encrypt, clear, and preserve history state. |
| [Shared Data](./shared-data) | Share data across all pages via filters or BaseController. |
| [The Client Side](./client-side) | Directory structure and accessing shared props. |
| [SSR Support](./ssr) | Server-side rendering requirements. |
| [Exception Handling & Error Pages](./error-pages) | Render Inertia error components for SPA requests. |

---

## Core Concept

Instead of returning a CodeIgniter View (`view('welcome')`), you return an Inertia response. Inertia intercepts this on the client side and dynamically swaps the page component without reloading the browser.
