# jengo/inertia

`jengo/inertia` is the official CodeIgniter 4 adapter for [Inertia.js](https://inertiajs.com/).

Inertia allows you to create fully client-side rendered, single-page apps (SPAs) without much of the complexity that comes with modern SPAs. It does this by leveraging existing server-side routing and controllers.

## Core Concept

Instead of returning a CodeIgniter View (`view('welcome')`), you return an Inertia response. Inertia intercepts this on the client side and dynamically swaps the page component without reloading the browser.

## Basic Usage

### Returning a Page

To render a page, use the `Jengo\Inertia\Inertia` facade. `Inertia::render()` returns a fluent `Response` object.

```php
namespace App\Controllers;

use Jengo\Inertia\Inertia;

class DashboardController extends BaseController
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'totalUsers' => 150,
            'recentActivity' => [...]
        ]);
    }
}
```

## Inertia v3 Features

Jengo fully supports the Inertia v3 protocol, providing advanced control over how data is loaded and synchronized.

### Advanced Prop Types

- **`Inertia::defer()`**: Loads a prop in a subsequent request, preventing it from blocking the initial page load.
- **`Inertia::lazy()`**: Prop that is only resolved when explicitly requested via a partial reload.
- **`Inertia::once()`**: Data that loads once and is reused on subsequent page visits.
- **`Inertia::merge()` / `prepend()`**: Controls how arrays/lists are updated on the client during navigation.
- **`Inertia::always()`**: Ensures a prop is included even during partial reloads.

```php
return Inertia::render('Dashboard', [
    'stats' => Inertia::defer(fn() => $this->getStats()),
    'logs' => Inertia::prepend($this->getRecentLogs()),
    'config' => Inertia::once(fn() => $this->getAppConfig()),
]);
```

### History & Navigation Control

The `render()` response can be configured to manage the browser history state:

```php
return Inertia::render('Profile/Edit', $data)
    ->encryptHistory()    // Encrypts history state
    ->clearHistory()      // Clears previous history
    ->preserveFragment(); // Preserves #fragments across redirects
```


### Shared Data

Often, you need to share data across all Inertia pages (e.g., the authenticated user, flash messages, or global app settings). 

You can share data globally using the `Inertia::share()` method. The best place to do this is via a CodeIgniter Filter or BaseController.

```php
namespace App\Controllers;

use Jengo\Inertia\Inertia;

class BaseController extends \CodeIgniter\Controller
{
    public function initController(\CodeIgniter\HTTP\RequestInterface $request, \CodeIgniter\HTTP\ResponseInterface $response, \Psr\Log\LoggerInterface $logger)
    {
        parent::initController($request, $response, $logger);

        // Share authenticated user
        if (auth()->loggedIn()) {
            Inertia::share('auth', [
                'user' => [
                    'id' => auth()->id(),
                    'username' => auth()->user()->username,
                ]
            ]);
        }

        // Share Flash Messages
        Inertia::share('flash', [
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }
}
```

## The Client Side

When using the Jengo Installer (`jengo new my-app --kit=react`), your client-side architecture is automatically set up in `resources/js/`.

### Directory Structure
- `resources/js/Pages/`: Contains your Inertia page components.
- `resources/js/Layouts/`: Contains reusable layouts (e.g., `AppLayout`, `GuestLayout`).
- `resources/js/app.entrypoint.(tsx|js)`: The main Vite entrypoint that boots the Inertia application.

### Accessing Shared Data in React (Example)

```tsx
import { usePage } from '@inertiajs/react';

export default function Dashboard() {
    // Access the shared data defined in the BaseController
    const { auth, flash, totalUsers } = usePage().props;

    return (
        <div>
            <h1>Welcome back, {auth.user.username}!</h1>
            {flash.success && <div className="alert">{flash.success}</div>}
            
            <p>Total Users: {totalUsers}</p>
        </div>
    );
}
```

## SSR (Server-Side Rendering) Support

The package is designed with SSR capabilities in mind. The Jengo installer ensures that your frontend frameworks (React, Vue, Svelte) and their respective Inertia adapters are installed as production dependencies (`dependencies` vs `devDependencies` in `package.json`), which is a strict requirement for Node-based SSR execution.
