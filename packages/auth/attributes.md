# Declarative PHP 8 Attributes

Protect controllers and actions declaratively without writing manual filters.

## Protecting Actions

```php
namespace App\Controllers;

use Jengo\Auth\Attributes\Authenticate;
use Jengo\Auth\Attributes\Can;
use Jengo\Auth\Attributes\Role;

#[Authenticate]
class ArticleController extends BaseController
{
    #[Can('posts.create')]
    public function new()
    {
        return view('articles/create');
    }

    #[Role('admin')]
    public function destroy(int $id)
    {
        // Only users with the 'admin' role can delete
    }
}
```

## Restricting Endpoints to Guests

To restrict an endpoint to guests only (e.g., login or registration page):

```php
use Jengo\Auth\Attributes\Guest;

#[Guest]
class LoginController extends BaseController
{
    public function show()
    {
        return view('auth/login');
    }
}
```
