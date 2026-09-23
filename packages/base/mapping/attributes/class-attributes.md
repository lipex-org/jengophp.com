# Class-Level Dynamic Attribute Mapping

For CodeIgniter 4 entities that rely on dynamic `$attributes` without declared PHP properties, use class-level attributes.

## Example

```php
namespace App\Entities;

use Jengo\Base\Entities\BaseEntity;
use Jengo\Base\Attributes\Mapping\MapProperty;
use Jengo\Base\Attributes\Mapping\MapSource;

#[MapSource(\CodeIgniter\Shield\Entities\User::class)]
#[MapProperty(target: 'email', source: 'user_email')]
#[MapProperty(target: 'status', source: 'is_active')]
class AppUser extends BaseEntity
{
}
```

- **`#[MapSource(Source::class)]`**: Sets the default paired origin class for `toOriginal()`.
- **`#[MapProperty(target, source)]`**: Maps source key to target attribute for dynamic entity attributes.
