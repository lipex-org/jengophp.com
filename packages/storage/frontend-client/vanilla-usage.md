# Vanilla TypeScript / JavaScript Usage

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
