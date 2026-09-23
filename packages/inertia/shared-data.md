# Shared Data

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
