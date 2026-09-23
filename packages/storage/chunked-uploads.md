# Chunked Multipart File Uploads (Backend)

Handling large file uploads through conventional single-request multipart forms often encounters PHP limits (`upload_max_filesize`, `post_max_size`, memory ceilings, and request timeouts). `jengo/storage` includes built-in backend controllers and routes for chunked, resumable multipart uploads.

For the matching client-side library, see the [Frontend Client (`@jengo/storage`)](./frontend-client/).

## How It Works

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

## Built-in Endpoints

| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/storage/chunks/upload` | Receives individual chunk `.part` file and index |
| `POST` | `/storage/chunks/assemble` | Verifies chunk completeness and streams into final file |
| `POST` | `/storage/chunks/abort` | Aborts session and purges staged temporary chunks |
