# Attribute Reference

| Attribute | Target | Description |
| :--- | :--- | :--- |
| `#[MapFrom('column')]` | Property / Method | Reads value from the specified source column or key. |
| `#[MapTo('column')]` | Property / Method | Sets destination key during reverse sync or export. |
| `#[MapProperty(target, source)]` | Class | Maps source key to target attribute for dynamic entity attributes. |
| `#[MapIgnore]` | Property | Excludes property from mapping (`both`, `to_target`, or `to_source`). |
| `#[MapCast(Target::class)]` | Property | Hydrates nested child entity or collection (`isCollection: true`). |
| `#[MapWith(Transformer::class)]` | Property | Applies custom `ValueTransformerInterface` for forward and reverse transforms. |
| `#[MapSource(Source::class)]` | Class | Sets the default paired origin class for `toOriginal()`. |
