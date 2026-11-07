# Basic Usage

## Returning a Page

To render a page, use the `Jengo\Inertia\Inertia` facade. `Inertia::render()` returns an instance implementing CodeIgniter 4's `ResponsableInterface`.

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

You can also use the global `inertia()` helper function:

```php
public function show(int $id)
{
    return inertia('Users/Show', [
        'user' => model('UserModel')->find($id),
    ]);
}
```

---

## The Root Template

When a user visits an Inertia application directly via browser URL bar (an initial request), `jengo/inertia` renders a standard CodeIgniter HTML layout that serves as the root template.

By default, the package loads `app/Views/app.php`:

```php
<?php
use Jengo\Inertia\Inertia;
use function Jengo\Base\vite_tags;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jengo App</title>

    <!-- Vite Assets -->
    <?= vite_tags(); ?>

    <!-- Inertia SSR Head Tags -->
    <?= Inertia::init($page, true); ?>
</head>
<body>
    <!-- Inertia App Container & JSON Payload -->
    <?= Inertia::init($page); ?>
</body>
</html>
```

### Template Directives

* `<?= Inertia::init($page) ?>`: Renders the Inertia v3 JSON script payload tag `<script type="application/json" data-page="app">...</script>` and the mount point `<div id="app"></div>` (or server-rendered HTML when SSR is active).
* `<?= Inertia::init($page, true) ?>`: Renders server-rendered head elements (title, meta tags) when Server-Side Rendering (SSR) is enabled.

### Configuring the Root View

The default root view is configured in `app/Config/Inertia.php`:

```php
namespace Config;

use Jengo\Inertia\Config\Inertia as BaseInertia;

class Inertia extends BaseInertia
{
    /**
     * The root template that's loaded on the first page visit.
     */
    public string $rootView = 'app';
}
```

You can also dynamically switch the root view per-request inside a controller or filter:

```php
Inertia::setRootView('admin_layout');
```

---

## Redirects & External Locations

### Standard Redirects & 303 Status Codes

When redirecting after a form submission (`PUT`, `PATCH`, or `DELETE`), standard HTTP dictates a `303 See Other` redirect so that the browser issues a `GET` request to the redirect destination. `jengo/inertia`'s middleware automatically handles this translation.

```php
public function update(int $id)
{
    model('UserModel')->update($id, $this->request->getPost());

    return redirect()->to('/users');
}
```

### External Redirects (`Inertia::location`)

If you need to redirect the user to an external domain or a non-Inertia endpoint (e.g. an OAuth login flow or payment gateway), using a standard CodeIgniter redirect will fail inside an XHR visit. Use `Inertia::location()` instead:

```php
public function checkout()
{
    return Inertia::location('https://stripe.com/checkout');
}
```

When called during an Inertia visit, this sends a `409 Conflict` response with the `X-Inertia-Location` header, instructing the client-side adapter to perform a full window redirect.
