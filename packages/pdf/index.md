# jengo/pdf

`jengo/pdf` is a high-performance, dual-driver PDF generation, document templating, schema reporting, and interactive browser preview engine for **CodeIgniter 4** and the **Jengo Framework**.

---

## What's Inside

| Section | Description |
| :--- | :--- |
| [Key Capabilities](#key-capabilities) | A summary of everything the package ships with. |
| [Installation](./installation) | Install via Composer and publish the config. |
| [Configuration](./configuration) | Driver, paper format, watermark, and Chromium settings. |
| [Quick Start](./quick-start) | Render views, HTML, and stream or save documents. |
| [Document Builders](./document-builders/) | Pre-built Invoices, Quotations, Receipts, and Payslips. |
| [Schema-Driven Data Reports](./schema-reports) | Multi-page business reports from queries, models, and arrays. |
| [Interactive Browser Preview](./preview) | Fullscreen canvas with zoom, dark mode, and shortcuts. |
| [Preview Filtering & Slide-Over Drawer](./filtering/) | Dynamic AJAX filter fields and auto-filters. |
| [Vector Utilities](./vector-utilities) | QR codes, Code 128 barcodes, and watermarks. |
| [Testing with `Pdf::fake()`](./testing) | In-memory fake with rich assertions. |
| [Global Helper](./global-helper) | The `pdf()` helper function. |

---

## Key Capabilities

- **Dual Driver Engine**: Seamlessly switch between **Dompdf** (pure PHP, zero system dependencies) and **Chromium** (Headless Chrome for pixel-perfect modern CSS Grid, Flexbox, Tailwind CSS, JavaScript charts, and WebFonts).
- **Pre-Built Document Builders**: Fluent, type-safe builders with beautiful templates for commercial **Invoices**, **Quotations**, **Receipts**, **Delivery Notes**, **Payslips**, **Purchase Orders**, and **Certificates**.
- **Schema-Driven Data Reports**: Automatically generate multi-page business reports from database queries, CI4 models, or entity arrays with repeating table headers, aggregates, and 7 built-in design themes.
- **Interactive In-Browser Preview**: Fullscreen canvas with dark-mode toolbar, paper format badge, live zoom controls, fit-to-width, continuous vs paginated view toggles, keyboard shortcuts, and instant print/download triggers.
- **Smart DOM Pagination**: Intelligent client-side page break and table splitting engine dividing large tables cleanly across physical millimeter sheet frames with repeating headers and footers.
- **Multi-Page Watermarks**: Render angled, centered, multi-page repeating watermarks (defaults to `'JENGO'`) across templates or custom views.
- **Zero-Dependency Vector Utilities**: Pure PHP SVG & PNG QR code and Code 128 barcode generators, plus international currency formatters.
- **Zero-Cost Testing Double (`Pdf::fake()`)**: Decoupled in-memory testing double with comprehensive assertions (`assertRendered`, `assertDownloaded`, `assertSaved`, `assertViewData`, `assertSee`).
