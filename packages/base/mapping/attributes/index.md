# PHP 8 Mapping Attributes

Declare column renaming, exclusions, custom transformations, and nested relationships directly on entity classes.

## On This Section

- [Property-Level Attributes](./property-attributes)
- [Class-Level Dynamic Attribute Mapping](./class-attributes)
- [Attribute Reference Table](./reference)

## Example

```php
namespace App\Entities;

use Jengo\Base\Entities\BaseEntity;
use Jengo\Base\Attributes\Mapping\MapFrom;
use Jengo\Base\Attributes\Mapping\MapTo;
use Jengo\Base\Attributes\Mapping\MapIgnore;
use Jengo\Base\Attributes\Mapping\MapCast;
use Jengo\Base\Attributes\Mapping\MapWith;

class AppUser extends BaseEntity
{
    #[MapFrom('user_id')]
    #[MapTo('user_id')]
    public ?int $id = null;

    #[MapFrom('user_email')]
    #[MapTo('user_email')]
    public ?string $email = null;

    #[MapWith(PhoneTransformer::class)]
    public ?string $phone = null;

    #[MapIgnore]
    public ?string $internalCache = null;

    #[MapCast(AddressEntity::class)]
    public ?AddressEntity $address = null;

    #[MapCast(RoleEntity::class, isCollection: true)]
    public array $roles = [];
}
```
