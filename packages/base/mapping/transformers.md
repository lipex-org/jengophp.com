# Custom Transformers

Implement `Jengo\Base\Mapping\Contracts\ValueTransformerInterface` to provide custom bidirectional transformations.

## Example

```php
namespace App\Transformers;

use Jengo\Base\Mapping\Contracts\ValueTransformerInterface;

class JsonArrayTransformer implements ValueTransformerInterface
{
    public function transform(mixed $value, string $sourceKey, object|array $source): mixed
    {
        return is_string($value) ? json_decode($value, true) : (array) $value;
    }

    public function reverse(mixed $value, string $targetKey, object|array $target): mixed
    {
        return json_encode($value);
    }
}
```

Attach a transformer to a property using the `#[MapWith(Transformer::class)]` attribute. See [Property-Level Attributes](./attributes/property-attributes).
