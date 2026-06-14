# Jengo Documentation

This directory contains the source for the official Jengo documentation, built with [VitePress](https://vitepress.dev/).

## Structure

- **`.vitepress/`**: Configuration, theme, and sidebar settings.
- **`guide/`**: Conceptual guides (Getting Started, Auth, Installer, etc.).
- **`packages/`**: Detailed API and usage documentation for individual Jengo packages (`base`, `inertia`, `schema`, `vite-plugin`).
- **`index.md`**: The documentation homepage.

## Development

To run the documentation site locally:

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start the dev server**:
    ```bash
    npm run dev
    ```

3.  **Build for production**:
    ```bash
    npm run build
    ```

The site will be available at `http://localhost:5173` (or the next available port).

## Deployment

The documentation is automatically deployed via GitHub Actions when changes are pushed to the `main` branch.
