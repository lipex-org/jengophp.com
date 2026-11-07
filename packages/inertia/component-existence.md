# Component Existence Checks <Badge type="tip" text="New" />

When a page component name is misspelled or missing on the frontend, Inertia client-side routers traditionally render a blank screen. To eliminate this issue and improve developer experience, `jengo/inertia` provides **server-side component existence verification**.

---

## The Blank Screen Problem

In standard Inertia adapters, if a controller returns:

```php
return Inertia::render('Dashbord'); // typo in 'Dashboard'
```

The server returns a 200 JSON response with `component: 'Dashbord'`. The frontend router fails to find the component in its `resolvePageComponent()` glob, resulting in a blank white screen with an uncaught runtime error in the browser console.

---

## Enabling Server-Side Checks

`jengo/inertia` allows verifying that the component file physically exists on disk before dispatching the response.

Configure the `$pages` array in `app/Config/Inertia.php`:

```php
namespace Config;

use Jengo\Inertia\Config\Inertia as BaseInertia;

class Inertia extends BaseInertia
{
    /**
     * Inertia page component configuration.
     * Strict snake_case keys are enforced.
     *
     * @var array<string, mixed>
     */
    public array $pages = [
        'ensure_page_exists' => true,
        'pages' => [],
        'extensions' => ['vue', 'jsx', 'tsx', 'svelte', 'js', 'ts'],
        'error' => 'error',
    ];

    public function __construct()
    {
        parent::__construct();

        // Default component lookup directories
        $this->pages['pages'] = [
            resource_path('js/inertia/pages'),
            resource_path('js/Pages'),
            resource_path('js/pages'),
        ];
    }
}
```

### Configuration Options

| Option | Type | Default | Description |
| :--- | :---: | :---: | :--- |
| `ensure_page_exists` | `bool` | `false` | When `true`, validates component files on disk before rendering. |
| `pages` | `array` | `[resource_path('js/Pages'), ...]` | Explicit array of directory paths searched for page components. |
| `extensions` | `array` | `['vue', 'jsx', 'tsx', 'svelte', 'js', 'ts']` | Supported frontend file extensions. |
| `error` | `string` | `'error'` | Component name fallback for 404 page not found errors. |

> [!TIP]
> Note that keys in the `$pages` array strictly use `snake_case` (e.g. `ensure_page_exists` rather than camelCase or kebab-case).

---

## How It Works

When `ensure_page_exists` is enabled and `Inertia::render('Users/Index')` is called:

1. `ResponseFactory::pageExists()` checks the configured `pages` directories.
2. It tests exact names and PascalCase variants (e.g. `users/index` or `Users/Index`).
3. It checks for direct extension matches (e.g. `Users/Index.vue`, `Users/Index.tsx`).
4. It checks for folder index conventions (e.g. `Users/index.vue`, `Users/Index.svelte`).
5. If no match is found, `Inertia::render()` throws a `CodeIgniter\Exceptions\PageNotFoundException`.
6. `InertiaExceptionHandler` intercepts the exception and renders a 404 Inertia error component (e.g. `errors/404` or `error`), providing clean visual feedback instead of a blank screen.

---

## Manual Component Check API

You can check component existence programmatically anywhere using the `Inertia` facade:

```php
use Jengo\Inertia\Inertia;

if (Inertia::pageExists('Dashboard')) {
    return Inertia::render('Dashboard');
}

// Check with custom directory paths override
$exists = Inertia::pageExists('Custom/Page', [
    resource_path('js/custom_pages'),
]);
```

---

## Component Existence in Tests

You can enforce page component existence verification during automated tests by configuring the `$testing` array in `app/Config/Inertia.php`:

```php
public array $testing = [
    'ensure_page_exists' => true,
    'page_paths' => [
        resource_path('js/Pages'),
    ],
];
```

When enabled, the `AssertableInertia` assertion helper verifies that the component file exists on disk whenever `$page->component(...)` is invoked:

```php
$result = $this->get('/dashboard');

$result->assertInertia(fn (AssertableInertia $page) => $page
    ->component('Dashboard') // Fails if Dashboard.vue/tsx does not exist on disk
    ->has('totalUsers')
);
```

If the component file is missing, the test fails immediately with:
`Inertia page component file [Dashboard] does not exist on disk.`
