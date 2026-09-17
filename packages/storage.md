# jengo/storage

`jengo/storage` is a unified filesystem abstraction, asset management, universal temporary signed URL engine, and fluent image processing pipeline for **CodeIgniter 4** and the **Jengo Framework**, powered by League Flysystem v3.

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

---

## Installation

Install via Composer:

```bash
composer require jengo/storage
```

> **Prerequisite:** `jengo/storage` requires either the **GD** (`ext-gd`) or **Imagick** (`ext-imagick`) extension to be installed and enabled in your PHP runtime.

Connect the public storage symlink:

```bash
php spark storage:link
```

---

## Configuration (`app/Config/Storage.php`)

```php
namespace Config;

use CodeIgniter\Config\BaseConfig;

class Storage extends BaseConfig
{
    public string $default = 'local';

    public string $signingKey = '';

    public string $signedRoutePrefix = 'storage/signed';

    public array $disks = [
        'local' => [
            'driver'     => 'local',
            'root'       => WRITEPATH . 'storage/app',
            'visibility' => 'private',
        ],

        'public' => [
            'driver'     => 'local',
            'root'       => WRITEPATH . 'storage/app/public',
            'url'        => '/storage',
            'visibility' => 'public',
        ],

        's3' => [
            'driver'                  => 's3',
            'key'                     => '',
            'secret'                  => '',
            'region'                  => 'us-east-1',
            'bucket'                  => '',
            'url'                     => '',
            'endpoint'                => '',
            'use_path_style_endpoint' => false,
        ],

        'r2' => [
            'driver'                  => 's3',
            'key'                     => '',
            'secret'                  => '',
            'region'                  => 'auto',
            'bucket'                  => '',
            'url'                     => '',
            'endpoint'                => '',
            'use_path_style_endpoint' => false,
        ],

        'minio' => [
            'driver'                  => 's3',
            'key'                     => 'minioadmin',
            'secret'                  => 'minioadmin',
            'region'                  => 'us-east-1',
            'bucket'                  => 'app-bucket',
            'endpoint'                => 'http://127.0.0.1:9000',
            'use_path_style_endpoint' => true,
        ],
    ];
}
```

### Environment Configuration (`.env`)

CodeIgniter 4 automatically maps environment variables to configuration class properties using dot notation matching the class name and property paths. You do not need to call `env()` within your configuration files.

Define overrides directly in your root `.env` file:

```ini
# Storage Settings
storage.default = 'local'
storage.signingKey = 'your-32-character-secret-key'

# AWS S3 Disk Configuration
storage.disks.s3.key = 'your-aws-access-key-id'
storage.disks.s3.secret = 'your-aws-secret-access-key'
storage.disks.s3.region = 'us-east-1'
storage.disks.s3.bucket = 'your-s3-bucket-name'
storage.disks.s3.url = 'https://your-s3-bucket-name.s3.amazonaws.com'

# Cloudflare R2 Disk Configuration
storage.disks.r2.key = 'your-r2-access-key-id'
storage.disks.r2.secret = 'your-r2-secret-access-key'
storage.disks.r2.region = 'auto'
storage.disks.r2.bucket = 'your-r2-bucket-name'
storage.disks.r2.endpoint = 'https://<account-id>.r2.cloudflarestorage.com'
storage.disks.r2.url = 'https://cdn.yourdomain.com'

# MinIO Local S3 Disk Configuration
storage.disks.minio.key = 'minioadmin'
storage.disks.minio.secret = 'minioadmin'
storage.disks.minio.region = 'us-east-1'
storage.disks.minio.bucket = 'app-bucket'
storage.disks.minio.endpoint = 'http://127.0.0.1:9000'
storage.disks.minio.use_path_style_endpoint = true
```

---

## Basic File Operations

### Writing Files

```php
use Jengo\Storage\Storage;

// Write to default disk
Storage::put('documents/notes.txt', 'Contents here');

// Write to specific disk with visibility
Storage::disk('s3')->put('reports/2026.pdf', $pdfBinary, 'private');

// Memory-efficient stream writing
$stream = fopen('/path/to/large/file.zip', 'rb');
Storage::disk('s3')->writeStream('archives/backup.zip', $stream);
if (is_resource($stream)) {
    fclose($stream);
}

// Prepend or append text
Storage::prepend('logs/audit.log', "Timestamp: " . time() . "\n");
Storage::append('logs/audit.log', "Finished.\n");
```

### Reading Files

```php
// Read full content into memory
$content = Storage::get('documents/notes.txt');

// Stream reading for large assets
$resource = Storage::readStream('videos/clip.mp4');
```

### Existence and Metadata

```php
if (Storage::exists('avatars/user.jpg')) {
    $size      = Storage::size('avatars/user.jpg');         // Bytes
    $mimeType  = Storage::mimeType('avatars/user.jpg');     // image/jpeg
    $timestamp = Storage::lastModified('avatars/user.jpg'); // Timestamp
    $checksum  = Storage::checksum('avatars/user.jpg');     // SHA256 checksum
}

if (Storage::missing('drafts/document.docx')) {
    // Handle missing file
}
```

### Copying, Moving, and Deleting

```php
// Copy a file
Storage::copy('drafts/post.md', 'published/post.md');

// Move or rename a file
Storage::move('temp/invoice.pdf', 'invoices/INV-2026.pdf');

// Delete a single file or array of files
Storage::delete('invoices/INV-2026.pdf');
Storage::delete(['temp/1.tmp', 'temp/2.tmp']);
```

---

## Directory Management

```php
// List immediate files in a directory
$files = Storage::files('documents');

// List all files recursively
$allFiles = Storage::allFiles('documents');

// List directories
$directories = Storage::directories('reports');
$allDirectories = Storage::allDirectories('reports');

// Create and delete directories
Storage::makeDirectory('vault/2026');
Storage::deleteDirectory('vault/2026');
```

---

## URL Generation & Signed URLs

### Public URLs

```php
$url = Storage::disk('public')->url('avatars/profile.png');
// Returns: /storage/avatars/profile.png
```

### Temporary Signed URLs

Generate expiring URLs for sensitive, private files without exposing storage paths:

```php
$downloadUrl = Storage::temporaryUrl(
    'vault/financial-report.pdf',
    now()->addMinutes(15)
);
```

- **Cloud Disks (S3 / R2 / MinIO)**: Automatically generates native cloud pre-signed URLs.
- **Local Disks**: Generates an HMAC-SHA256 signed route (`/storage/signed/{path}?expires=...&signature=...`). The built-in controller validates expiration and signature, then streams the file with HTTP `Range` request support.

---

## Chunked Multipart File Uploads (Backend)

Handling large file uploads through conventional single-request multipart forms often encounters PHP limits (`upload_max_filesize`, `post_max_size`, memory ceilings, and request timeouts). `jengo/storage` includes built-in backend controllers and routes for chunked, resumable multipart uploads.

### How It Works

1. **Chunk Staging (`POST /storage/chunks/upload`)**:
   The client generates a unique file session UUID and slices the file into discrete parts (e.g. 2 MB each). Each part is streamed to the backend and saved as an isolated `.part` file in `WRITEPATH . 'storage/temp/chunks/{uuid}/'`. If client checksums are provided, the server verifies each chunk's SHA-256 hash immediately upon receipt.

2. **Stream Assembly (`POST /storage/chunks/assemble`)**:
   Once all parts have been received, the client requests assembly. The server opens a buffered stream and iterates sequentially through all chunk parts using `stream_copy_to_stream()` with 64 KB buffers. Memory consumption remains constant (< 2 MB) whether assembling a 50 MB video or a 10 GB disk image. The resulting stream is piped directly into the target disk (`public`, `local`, or cloud) via Flysystem's `writeStream()`.

3. **Session Cancellation (`POST /storage/chunks/abort`)**:
   If a user aborts an upload, the staging directory and all orphaned `.part` files are removed immediately.

4. **Stale Staging Cleanup**:
   Orphaned chunk directories from interrupted client connections can be pruned via CLI:
   ```bash
   php spark storage:cleanup --hours=24
   ```

### Built-in Endpoints

| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/storage/chunks/upload` | Receives individual chunk `.part` file and index |
| `POST` | `/storage/chunks/assemble` | Verifies chunk completeness and streams into final file |
| `POST` | `/storage/chunks/abort` | Aborts session and purges staged temporary chunks |

---

## Universal Frontend Client Library (`@jengo/storage`)

`@jengo/storage` is the official, universal TypeScript client package for Jengo Storage. It eliminates frontend upload boilerplate, provides automatic chunk slicing, parallel streaming, pause/resume/abort controls, instant previews, real-time speed metrics, and first-class adapters for React, Vue 3, and Svelte.

### Installation

```bash
# npm
npm install @jengo/storage

# pnpm
pnpm add @jengo/storage

# yarn
yarn add @jengo/storage
```

### Vanilla TypeScript / JavaScript Usage

```typescript
import { ChunkedUploader, createFilePreview } from '@jengo/storage';

const fileInput = document.querySelector<HTMLInputElement>('#fileInput')!;

fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;

    // 1. Generate instant client-side preview before transmission
    const preview = await createFilePreview(file);
    if (preview.isImage) {
        console.log(`Image dimensions: ${preview.width}x${preview.height}`);
    }

    // 2. Instantiate chunked uploader with concurrency and metrics
    const uploader = new ChunkedUploader(file, {
        chunkSize: 2 * 1024 * 1024, // 2 MB slices
        concurrency: 3,             // 3 parallel network streams
        disk: 'public',             // Destination disk
        folder: 'uploads/videos',
        computeChecksums: true,     // Web Crypto SHA-256 verification
        onProgress: (progress) => {
            console.log(`${progress.percent}% | ${progress.speed} | ETA: ${progress.remainingSeconds}s`);
            console.log(`Chunk ${progress.chunkIndex} of ${progress.totalChunks}`);
        },
        onStatusChange: (status) => {
            // 'idle' | 'uploading' | 'paused' | 'assembling' | 'completed' | 'error' | 'aborted'
            console.log(`Upload status: ${status}`);
        },
        onSuccess: (result) => {
            console.log('File assembled:', result.url);
            preview.revoke(); // Release browser object URL memory
        },
        onError: (err) => {
            console.error('Upload failed:', err);
        },
    });

    // Start transmission
    await uploader.start();

    // Pause, resume, or abort anytime:
    // uploader.pause();
    // await uploader.resume();
    // await uploader.abort();
});
```

### Framework Adapters

#### React Adapter (`@jengo/storage/react`)

```tsx
import React, { useState } from 'react';
import { useChunkedUpload } from '@jengo/storage/react';

export function VideoUploader() {
    const [file, setFile] = useState<File | null>(null);
    const {
        status,
        progress,
        result,
        error,
        isUploading,
        isPaused,
        start,
        pause,
        resume,
        abort,
    } = useChunkedUpload({
        chunkSize: 2 * 1024 * 1024,
        concurrency: 3,
        disk: 'public',
        folder: 'videos',
    });

    return (
        <div>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button onClick={() => file && start(file)} disabled={!file || isUploading}>
                Upload
            </button>

            {isUploading && (
                <>
                    <button onClick={pause}>Pause</button>
                    <button onClick={abort}>Abort</button>
                    <progress value={progress.percent} max={100} />
                    <span>{progress.speed} (ETA: {progress.remainingSeconds}s)</span>
                </>
            )}

            {isPaused && <button onClick={resume}>Resume</button>}
            {result && <div>Success: <a href={result.url}>{result.filename}</a></div>}
            {error && <div>Error: {error.message}</div>}
        </div>
    );
}
```

#### Vue 3 Composition Adapter (`@jengo/storage/vue`)

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useChunkedUpload } from '@jengo/storage/vue';

const selectedFile = ref<File | null>(null);

const {
    status,
    progress,
    result,
    error,
    isUploading,
    isPaused,
    start,
    pause,
    resume,
    abort,
} = useChunkedUpload({
    disk: 'public',
    folder: 'documents',
});

function onFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    selectedFile.value = input.files?.[0] || null;
}
</script>

<template>
    <div>
        <input type="file" @change="onFileSelect" />
        <button :disabled="!selectedFile || isUploading" @click="selectedFile && start(selectedFile)">
            Start Upload
        </button>
        <button v-if="isUploading" @click="pause">Pause</button>
        <button v-if="isPaused" @click="resume">Resume</button>
        <button v-if="isUploading || isPaused" @click="abort">Abort</button>

        <div v-if="isUploading || isPaused">
            <progress :value="progress.percent" max="100"></progress>
            <p>{{ progress.percent }}% - {{ progress.speed }} - ETA: {{ progress.remainingSeconds }}s</p>
        </div>

        <p v-if="result">Uploaded: <a :href="result.url">{{ result.filename }}</a></p>
    </div>
</template>
```

#### Svelte Adapter (`@jengo/storage/svelte`)

```svelte
<script lang="ts">
import { createChunkedUpload } from '@jengo/storage/svelte';

let file: File | null = null;
const upload = createChunkedUpload({
    disk: 'public',
    folder: 'assets',
});

function onFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    file = input.files?.[0] || null;
}
</script>

<input type="file" on:change={onFileSelect} />
<button on:click={() => file && upload.start(file)} disabled={!file || $upload.isUploading}>
    Upload
</button>

{#if $upload.isUploading}
    <button on:click={upload.pause}>Pause</button>
    <button on:click={upload.abort}>Abort</button>
{/if}

{#if $upload.isPaused}
    <button on:click={upload.resume}>Resume</button>
{/if}

{#if $upload.isUploading || $upload.isPaused}
    <div>
        <progress value={$upload.progress.percent} max="100"></progress>
        <span>{$upload.progress.percent}% ({$upload.progress.speed})</span>
    </div>
{/if}

{#if $upload.result}
    <p>Complete: {$upload.result.filename}</p>
{/if}
```

### Direct Cloud Transfers with `@jengo/storage`

For pre-signed S3, Cloudflare R2, or Google Cloud Storage direct transfers:

```typescript
import { DirectCloudUploader } from '@jengo/storage';

const uploader = new DirectCloudUploader(file, {
    ticketEndpoint: '/storage/direct/ticket',   // Requests pre-signed upload URL from backend
    confirmEndpoint: '/storage/direct/confirm', // Confirms metadata after cloud write completes
    onProgress: (p) => console.log(`${p.percent}%`),
});

const result = await uploader.start();
```

---

## Direct Browser Pre-Signed Uploads (Backend)

To upload large files directly from the browser (Inertia.js, React, Vue) to S3 or Cloudflare R2 without passing through the PHP web server:

```php
namespace App\Controllers;

use CodeIgniter\Controller;
use Jengo\Storage\Storage;

class MediaController extends Controller
{
    public function getUploadTicket()
    {
        $userId = auth()->id();
        $filename = "uploads/{$userId}/" . bin2hex(random_bytes(16)) . ".mp4";

        $ticket = Storage::disk('s3')->createUploadUrl($filename, [
            'expires'     => time() + 900,
            'contentType' => 'video/mp4',
            'visibility'  => 'private',
        ]);

        return $this->response->setJSON([
            'uploadUrl' => $ticket->getUrl(),
            'headers'   => $ticket->getHeaders(),
            'key'       => $filename,
        ]);
    }
}
```

---

## Image Transformation Pipeline

Manipulate stored images via a fluent API without external heavyweight dependencies. The pipeline automatically selects the best available driver at runtime (preferring `Imagick` if installed, otherwise utilizing `GD`), requiring zero manual driver configuration.

```php
use Jengo\Storage\Storage;

// Resize, fit, and convert to WebP
Storage::disk('public')
    ->image('products/camera.jpg')
    ->fit(800, 600)
    ->toWebp(quality: 85)
    ->save('products/camera_thumb.webp');

// Watermarking and aspect-ratio resizing
Storage::disk('public')
    ->image('photos/landscape.png')
    ->resize(1920) // Calculates height proportionally
    ->watermark('branding/watermark.png', position: 'bottom-right', opacity: 75)
    ->save('photos/landscape_watermarked.jpg');

// Generating responsive breakpoint sets
$variants = Storage::disk('public')
    ->image('hero.jpg')
    ->generateResponsiveVariants('hero_variants', [
        'sm' => 640,
        'md' => 1024,
        'lg' => 1920,
    ], format: 'webp', quality: 80);
```

---

## CodeIgniter `UploadedFile` Integration

`UploadedFileDecorator` enriches standard uploaded files with automated hash naming and direct disk storage:

```php
use Jengo\Storage\Support\UploadedFileDecorator;

$file = $this->request->getFile('avatar');

if ($file->isValid() && ! $file->hasMoved()) {
    $decorator = new UploadedFileDecorator($file);

    // Store with an automated cryptographic hash name
    $storedPath = $decorator->store('avatars', 'public');
    // Result: avatars/5e884898da28047151d0e56f8dc6292773603d0d.png

    // Store with an explicit filename
    $customPath = $decorator->storeAs('invoices', 'INV-2026.pdf', 's3');
}
```

---

## Testing with `Storage::fake()`

```php
namespace Tests\Feature;

use CodeIgniter\Test\CIUnitTestCase;
use Jengo\Storage\Storage;
use Jengo\Storage\Testing\FileFactory;

class FileUploadTest extends CIUnitTestCase
{
    public function test_user_can_upload_document(): void
    {
        // Intercept disk in memory
        Storage::fake('public');

        $fakeFile = FileFactory::create('contract.pdf', kilobytes: 50, mimeType: 'application/pdf');

        $response = $this->post('/documents/upload', [
            'file' => $fakeFile,
        ]);

        $response->assertStatus(200);

        // Assert file exists on disk
        Storage::disk('public')->assertExists('documents/contract.pdf');

        // Assert file count in directory
        Storage::disk('public')->assertDirectoryFileCount('documents', 1);

        // Assert file size
        Storage::disk('public')->assertSize('documents/contract.pdf', 50 * 1024);
    }
}
```

---

## CLI Spark Commands

### `php spark storage:link`
Connects `writable/storage/app/public` to `public/storage` via a symbolic link.

```bash
php spark storage:link
php spark storage:link --force
```

### `php spark storage:cleanup`
Deletes stale temporary upload chunks and orphaned files older than a specified duration.

```bash
php spark storage:cleanup --hours=24
```
