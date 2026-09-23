# Direct Cloud Transfers with `@jengo/storage`

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

For the backend ticket generation, see [Direct Browser Pre-Signed Uploads](../direct-uploads).
