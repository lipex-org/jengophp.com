# Defining Resource Configurations

Resource configurations extend `Jengo\Api\Support\ResourceConfig` to define endpoint behavior, relationship permissions, and validation bindings.

## Example

```php
namespace App\Api;

use Jengo\Api\Support\ResourceConfig;
use Jengo\Api\Support\HookContext;
use App\Forms\CreateUserForm;
use App\Forms\UpdateUserForm;

class UserResourceConfig extends ResourceConfig
{
    /**
     * Target API version constraint
     */
    protected $version = 'v1';

    /**
     * Allowed relationships to derive via ?derive=
     */
    protected array $allowedRelations = ['profile', 'posts'];

    /**
     * Fields whose IDs should be obfuscated with Sqids
     */
    protected array $obfuscatedFields = ['id'];

    /**
     * Maximum pagination limit allowed for this resource
     */
    protected int $maxLimit = 100;

    /**
     * HTTP verbs requiring authentication
     */
    protected array $requiredAuth = ['post', 'put', 'patch', 'delete'];

    /**
     * Validation FormHandler classes mapped to HTTP verbs
     */
    protected $formClass = [
        'post' => CreateUserForm::class,
        'put'  => UpdateUserForm::class,
    ];

    /**
     * Resource URL identifier (e.g. /api/v1/users)
     */
    public function name(): string
    {
        return 'users';
    }

    /**
     * Modify data before saving
     */
    public function beforeSave(array $data, ?HookContext $context = null): array
    {
        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        return $data;
    }
}
```

> [!NOTE]
> To use database key obfuscation, your database Entity class must extend `Jengo\Base\Entities\BaseEntity` and declare the targeted fields in its `$obfuscatedFields` property.
