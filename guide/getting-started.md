# Getting Started

Welcome to Jengo, the premium ecosystem for rapid CodeIgniter 4 development.

Jengo is designed to provide a modern, "Breeze-like" experience for CI4, coming out of the box with everything you need to build robust, modern web applications.

## Prerequisites

Before installing Jengo, ensure your local environment meets the following requirements:
- **PHP 8.2** or higher
- **Composer** (Globally installed)
- **Node.js & npm/pnpm/yarn** (For frontend assets)

## Installation

The best way to start a new Jengo project is by using the official Jengo Installer. Install it globally via Composer:

```bash
composer global require jengo/installer
```

> **Note:** Make sure your global Composer `bin` directory is in your system's `PATH`.

## Creating Your First App

Once the installer is available, you can bootstrap a new application simply by running:

```bash
jengo new my-app
```

The interactive installer will guide you through the process, asking for your preferred starter kit, package manager, and whether you'd like to include Authentication and API suites.

## Starting the Development Server

Jengo heavily utilizes **Vite** for blazing-fast frontend development. 

Navigate to your new project and start the PHP server:

```bash
cd my-app
php spark serve
```

In a separate terminal, start the Vite development server to enable Hot Module Replacement (HMR):

```bash
npm run dev
```

You can now access your application in the browser!

