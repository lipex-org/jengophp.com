# Exception Handling and Error Pages <Badge type="tip" text="New in v1.1.23" />

Standard CodeIgniter 4 exception handlers return raw PHP HTML views for uncaught errors, which disrupts the client-side SPA navigation cycle. Starting in **v1.1.23**, `jengo/inertia` provides `InertiaExceptionHandler` to seamlessly render your Inertia error components for both SPA requests and direct browser visits with appropriate HTTP status codes.

## Enabling the Exception Handler

In your `app/Config/Exceptions.php` file, return `InertiaExceptionHandler` inside the `handler()` method:

```php
namespace Config;

use CodeIgniter\Config\BaseConfig;
use CodeIgniter\Debug\ExceptionHandlerInterface;
use Jengo\Inertia\Debug\InertiaExceptionHandler;
use Throwable;

class Exceptions extends BaseConfig
{
    // ...

    public function handler(int $statusCode, Throwable $exception): ExceptionHandlerInterface
    {
        return new InertiaExceptionHandler($this);
    }
}
```

Running `php spark jengo:install inertia` automatically publishes this configuration file into `app/Config/Exceptions.php`.

## Configuring Error Pages

You can customize which Inertia components render for specific HTTP status codes in `app/Config/Inertia.php`:

```php
namespace Config;

use Jengo\Inertia\Config\Inertia as BaseInertia;

class Inertia extends BaseInertia
{
    /**
     * Map HTTP status codes to Inertia error components.
     *
     * @var array<int|string, string>
     */
    public array $errorPages = [
        401 => 'error',
        403 => 'error',
        404 => 'error',
        419 => 'error',
        500 => 'error',
        503 => 'error',
        'error' => 'error',
    ];

    /**
     * Whether to show CodeIgniter's detailed HTML debug trace in development
     * for 500 errors instead of the Inertia error component.
     * Defaults to false.
     */
    public bool $showDebugInDevelopment = false;
}
```

## Error Component Props

When an exception occurs, the resolved error page component receives the following props:

- **`status`** (`number`): The HTTP status code (e.g. `404`, `500`, `403`).
- **`message`** (`string`): The error or exception message.
- **`exception`** (`object|null`): When `display_errors` is enabled in development, contains detailed exception information including `title`, `type`, `file`, `line`, and `trace`. In production, this is omitted.

Example in React (`resources/js/inertia/pages/error.tsx`):

```tsx
import { Head } from '@inertiajs/react';

interface ErrorProps {
    status: number;
    message?: string;
    exception?: {
        title?: string;
        message?: string;
        file?: string;
        line?: number;
    };
}

export default function ErrorPage({ status, message, exception }: ErrorProps) {
    return (
        <div>
            <Head title={`Error ${status}`} />
            <h1>{status}</h1>
            <p>{message}</p>
            {exception && (
                <pre>{exception.file}:{exception.line}</pre>
            )}
        </div>
    );
}
```
