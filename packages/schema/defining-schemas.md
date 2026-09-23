# Defining Schemas

Schemas represent your database tables and their relationships to entities and other schemas using PHP 8 Attributes.

## Example Schema

```php
namespace App\Schemas;

use App\Entities\User;
use App\Models\UserModel;
use Jengo\Schema\Attributes\Computed;
use Jengo\Schema\Attributes\Field;
use Jengo\Schema\Attributes\Model;
use Jengo\Schema\Attributes\PrimaryKey;
use Jengo\Schema\Attributes\Relations\BelongsTo;
use Jengo\Schema\Attributes\Relations\HasMany;
use Jengo\Schema\Hydration\Enums\Cast;

#[Model(model: UserModel::class, entity: User::class)]
class UserSchema
{
    #[PrimaryKey]
    public int $id;

    #[Field(searchable: true)]
    public string $first_name;

    #[Field(searchable: true)]
    public string $last_name;

    #[Field(searchable: true)]
    public string $email;

    #[Field(cast: Cast::DATETIME)]
    public string $created_at;

    #[BelongsTo(schema: ProfileSchema::class, from: 'id', to: 'user_id')]
    public ?ProfileSchema $profile = null;

    #[HasMany(schema: UserFileSchema::class, from: 'id', to: 'user_id')]
    public array $files = [];

    #[Computed('full_name', ['first_name', 'last_name'])]
    public function getFullName(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    #[Computed('file_count', ['files'])]
    public function getFileCount(): int
    {
        return count($this->files);
    }
}
```

## Schema Attributes

- **`#[Model(model: string, entity: ?string)]`**: Maps the schema to a CodeIgniter 4 Model and specifies the hydration target entity.
- **`#[PrimaryKey]`**: Identifies the primary key property.
- **`#[Field(searchable: bool, cast: ?Cast)]`**: Configures field behavior, including search indexing and hydration type casting.
- **`#[BelongsTo(schema: string, from: string, to: ?string)]`**: Defines a one-to-one or many-to-one relationship.
- **`#[HasMany(schema: string, from: string, to: ?string)]`**: Defines a one-to-many relationship (hydrated as a typed list).
- **`#[Computed(name: string, dependants: array, cast: ?Cast)]`**: Calculates dynamic fields post-hydration. Dependencies (including relationships) are resolved in topological order.

## Field Casting (`Cast` Enum)

The `Jengo\Schema\Hydration\Enums\Cast` enum supports automatic conversion:

- `Cast::INT`: Cast to integer.
- `Cast::FLOAT`: Cast to float/decimal.
- `Cast::BOOL`: Cast to boolean.
- `Cast::STRING`: Cast to string.
- `Cast::ARRAY`: Decode JSON string into a PHP array.
- `Cast::DATETIME`: Parse into datetime representation.
