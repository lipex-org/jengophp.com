# Configuration

Your `vite.config.ts` requires almost zero configuration.

```typescript
import { defineConfig } from 'vite';
import jengo from '@jengo/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        jengo(),   // Handles dynamic entrypoints and manifest generation
        react(),   // Framework specific plugins
    ],
    // No need to define outDir, manifest, or rollupOptions.input!
});
```

The plugin automatically configures:

- `build.outDir`: Set to `public/dist`.
- `build.manifest`: Set to `true` (so CI4 knows how to load assets).
- `publicDir`: Set to `resources/static`.
