# Svelte Adapter (`@jengo/storage/svelte`)

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
