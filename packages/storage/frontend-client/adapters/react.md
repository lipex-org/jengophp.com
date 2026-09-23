# React Adapter (`@jengo/storage/react`)

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
