# The Jengo Installer

The Jengo Installer (`jengo new`) is a powerful, interactive CLI tool designed to scaffold your entire application in seconds.

## Interactive Mode

By default, running `jengo new <app-name>` triggers an interactive wizard. The wizard will ask you to select:

1. **Starter Kit**: Choose between the Default PHP kit or modern SPAs (React, Vue, Svelte).
2. **Package Manager**: Select `npm`, `pnpm`, or `yarn`.
3. **TypeScript**: Decide if you want full TypeScript support (strongly recommended for SPAs).
4. **The Gatekeeper**: Opt-in to install our CodeIgniter Shield auth integration.
5. **The Vault**: Opt-in to establish our API foundation.
6. **Tailwind CSS**: Decide if you want Tailwind installed and configured.

## Non-Interactive Mode (CI/CD)

For automated setups or if you already know exactly what you want, you can pass your preferences directly via command-line flags. The installer will skip the prompts for any options provided.

### Example: React SPA with Auth

```bash
jengo new my-app --kit=react --auth --pm=pnpm
```

### Available Flags

- `--kit=<name>`: `default`, `react`, `vue`, or `svelte`.
- `--auth`: Installs the CodeIgniter Shield integration.
- `--api`: Installs the Jengo API suite.
- `--ts`: Installs TypeScript support and configurations.
- `--no-tailwind`: Skips Tailwind CSS installation.
- `--pm=<manager>`: `npm`, `pnpm`, or `yarn`.
- `--force` (`-f`): Overwrites the target directory if it already exists.

## Current Directory Installation

If you've already created an empty directory and want to scaffold Jengo inside it, you can pass `.` as the application name:

```bash
mkdir my-app
cd my-app
jengo new .
```

The installer will automatically name your application based on the current folder's name.
