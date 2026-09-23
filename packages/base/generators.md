# Resource Generators

Generate clean, boilerplate-ready architecture components with the `jengo:make` Master Command:

```bash
php spark jengo:make action {name}   # Generates a single-action class.
php spark jengo:make event {name}    # Generates a strongly typed event and optional listener.
php spark jengo:make layout {name}   # Generates a new UI layout file.
php spark jengo:make page {name}     # Generates a new view page with layout extension.
php spark jengo:make repo {name}     # Generates a Repository class for a model.
```

## Operations & Diagnostics

### The Auditor

```bash
php spark jengo:audit
```

Scans your project for security misconfigurations.

### The Observer

```bash
php spark jengo:tail log
```

Streams CodeIgniter log files in real-time with color-coding and search filters.

### The Guardian

```bash
php spark jengo:health
```

Diagnoses application health and configuration status.

### Vite Integration

```bash
php spark jengo:vite config
```

Returns the dynamic entrypoint configuration as JSON for the Vite plugin. See [@jengo/vite](/packages/vite-plugin/).
