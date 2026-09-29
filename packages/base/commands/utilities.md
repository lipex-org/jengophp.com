# Utility Commands (`optimize`, `clear`, `tinker`, `sqids`, `ai`, `vite`)

`jengo/base` provides utility CLI commands to streamline maintenance, caching, interactive debugging, and AI integration.

---

## 1. Performance Optimization (`jengo:optimize`)

Compiles and pre-caches the complete module discovery manifest:

```bash
php spark jengo:optimize
```

Writes the compiled module mapping to `.jengo/cache/modules.php`, eliminating runtime filesystem scanning across `modules/` in production.

---

## 2. Cache Purging (`jengo:clear`)

Cleans up cached framework artifacts and compiled manifests:

```bash
php spark jengo:clear cache
```

Options:
- `cache`: Clears compiled module manifests and Jengo runtime caches.
- `--all`: Purges CI4 view caches, schema query caches, and temporary build artifacts.

---

## 3. Interactive REPL (`jengo:tinker`)

Launches an interactive PsySH shell with the CodeIgniter 4 application and Jengo container fully booted:

```bash
php spark jengo:tinker
```

Inside tinker:
```php
>>> $user = model('UserModel')->first();
>>> echo $user->username;
>>> container(MyService::class)->execute();
```

---

## 4. Sqids Obfuscation CLI (`jengo:sqids`)

Encode and decode numeric database IDs directly from your terminal:

```bash
# Encode ID
php spark jengo:sqids hash 42

# Decode Hash
php spark jengo:sqids unhash "b9X"
```

---

## 5. AI Rules & Manifest Discovery (`jengo:ai`)

Scans your application and installed packages for AI capabilities, tools, and schema endpoints, compiling an updated AI context manifest:

```bash
php spark jengo:ai discover
```

Generates:
- `.jengo/ai/manifest.json`: Structured capability map for AI subagents.
- `.jengo/ai/rules.md`: Project-specific AI coding rules.
- `.cursorrules` / `.clinerules`: Syncs active IDE rule files.

---

## 6. Vite Configuration Diagnostics (`jengo:vite`)

Inspects and verifies your frontend Vite integration:

```bash
php spark jengo:vite config
```

Verifies:
- `vite.config.js` or `vite.config.ts` existence and entrypoints
- `public/build/manifest.json` hot-reload state
- Development server status on `http://localhost:5173`
