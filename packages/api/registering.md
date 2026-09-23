# Registering Resources

Register your resource configurations in `app/Config/JengoApi.php`:

```php
namespace Config;

use Jengo\Api\Config\JengoApi as BaseJengoApi;
use App\Api\UserResourceConfig;
use App\Api\PostResourceConfig;

class JengoApi extends BaseJengoApi
{
    public string $apiName = 'My Application API';
    public string $apiBaseUrl = '/api';

    public array $resources = [
        UserResourceConfig::class,
        PostResourceConfig::class,
    ];
}
```
