# Performance Architecture

The mapping system is engineered for fast-run batch processing.

- **Static Reflection Caching**: Property mappings, attributes, and transformers are evaluated once per class lifecycle and cached in static memory. Subsequent hydrations execute in O(1) time without reflection overhead.
- **Direct Entity Extraction**: For CodeIgniter 4 entities, raw data is read directly via `$source->toRawArray()`, avoiding unnecessary getter loops.
- **Single-Pass Collection Hydration**: Efficiently maps thousands of records with minimal memory allocations.
