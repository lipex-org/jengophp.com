# How it Works

When Vite starts, the `@jengo/vite` plugin executes a hidden CodeIgniter CLI command:

```bash
php spark jengo:vite config
```

This command quickly scans your project, finds all `.entrypoint.*` files, and feeds them back to Vite as the build inputs.
