# Protecting Endpoints

`jengo\auth` uses a combination of an `auth` filter, an `Authenticate` attribute and guards to protect endpoints. This eliminates the need for writing protection through route files though that is still possible.

You can use this in two ways:

## 1. Using Global Filter (Recommended)

### Add the global `auth` filter to `app/Config/Filters.php`

```php
// app/Config/Filters.php

public $globals = [
    'before' => [
        'auth'
    ],

    // ...
];
```

### Add the `Authenticate` attribute to endpoints in controllers

You can add the attribute to either the entire class or a single method depending on which guard you want to use. Normally you just need to maintain the `universal` guard as defined in the `Auth` config file. You can directly specify the guard to be used in the attribute.

```php
// app/Controllers/ExampleController.php

namespace App\Controllers;

use Jengo\Auth\Attributes\Authenticate;

#[Authenticate(/** you can provide a guard to use here i.e universal, session, token. if not provided the defaultGuard in the config is used otherwise universal is selected */)]
class ExampleController extends BaseController
{
    public function hello ()  {
        return "Hello from Jengo";
    }
}
```

## 2. Using `Filter` and `Authenticate` Attributes Together

This is useful when you only have a few endpoints to authenticate. It is not recommended for large projects.

```php
// app/Controllers/ExampleController.php

namespace App\Controllers;

use Jengo\Auth\Attributes\Authenticate;
use CodeIgniter\Router\Attributes\Filter;

#[Authenticate()]
#[Filter('auth')]
class ExampleController extends BaseController
{
    public function hello()  {
        return "Hello from Jengo";
    }
}
```

You can also provide the auth filter to individual routes in your routes file.
