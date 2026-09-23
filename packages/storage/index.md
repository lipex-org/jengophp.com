# jengo/storage

`jengo/storage` is a unified filesystem abstraction, asset management, universal temporary signed URL engine, and fluent image processing pipeline for **CodeIgniter 4** and the **Jengo Framework**, powered by League Flysystem v3.

---

## What's Inside

| Section | Description |
| :--- | :--- |
| [Key Capabilities](#key-capabilities) | A summary of everything the package ships with. |
| [Installation](./installation) | Install via Composer and connect the public symlink. |
| [Configuration](./configuration) | `app/Config/Storage.php` and `.env` overrides for all disks. |
| [Basic File Operations](./file-operations) | Write, read, copy, move, and delete files. |
| [Directory Management](./directories) | List, create, and delete directories. |
| [URLs & Signed URLs](./signed-urls) | Public URLs and expiring temporary signed URLs. |
| [Chunked Multipart Uploads](./chunked-uploads) | Resumable large-file uploads with streaming assembly. |
| [Frontend Client (`@jengo/storage`)](./frontend-client/) | Universal TypeScript client with framework adapters. |
| [Direct Pre-Signed Uploads](./direct-uploads) | Browser-to-cloud uploads bypassing PHP workers. |
| [Image Transformation Pipeline](./image-processing) | Resize, crop, fit, watermark, and transcode images. |
| [UploadedFile Integration](./uploaded-file) | Hash-named, disk-routed storage of CI4 uploads. |
| [Testing with `Storage::fake()`](./testing) | In-memory fake disk with rich assertions. |
| [CLI Spark Commands](./cli) | `storage:link` and `storage:cleanup`. |

---

## Key Capabilities

- **Multi-Disk Switching**: Seamlessly manage files across **Local**, **AWS S3**, **Cloudflare R2**, **MinIO**, **Google Cloud Storage**, and in-memory test drivers via a unified API.
- **Universal Temporary Signed URLs**: Issue expiring download links with automatic HMAC-SHA256 signature verification for local private files and native pre-signed URLs for cloud object storage.
- **Chunked Multipart File Uploads**: Stream large files in discrete slices with low-memory 64 KB buffered stream concatenation (< 2 MB RAM), SHA-256 integrity verification, and automatic staging cleanup.
- **Universal Frontend Client (`@jengo/storage`)**: First-class TypeScript client library with concurrency streaming, pause/resume/abort controls, instant previews, real-time speed/ETA metrics, and adapters for React, Vue 3, and Svelte.
- **Direct-to-Cloud Pre-Signed Uploads**: Generate pre-signed tickets for direct browser-to-S3/R2 uploads, eliminating PHP worker bottlenecks and memory limits on large file transfers.
- **HTTP Range Streaming**: Built-in streaming controller supporting byte-range requests (`Accept-Ranges: bytes`) for smooth video/audio playback and resumable downloads.
- **Fluent Image Transformation Engine**: Zero-dependency image pipeline supporting aspect-ratio preserving resize, crop, fit, watermarking, responsive breakpoint variant generation, and modern format transcoding (WebP and AVIF).
- **CodeIgniter UploadedFile Bridge**: Decorates native CI4 uploaded files with automatic cryptographic hash naming, directory organization, and direct storage routing.
- **Zero-Cost Test Double (`Storage::fake()`)**: In-memory virtual disk replacement with comprehensive assertions (`assertExists`, `assertMissing`, `assertSize`, `assertChecksum`, `assertDirectoryFileCount`).
- **Spark CLI Management**: Dedicated commands for linking public storage (`php spark storage:link`) and pruning expired temporary files (`php spark storage:cleanup`).
