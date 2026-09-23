# Basic Usage

## Returning a Page

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
