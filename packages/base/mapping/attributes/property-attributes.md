# Property-Level Attributes

Property-level attributes are applied to individual entity properties to control how values are read, transformed, and written during mapping.

## `#[MapFrom('column')]`

Reads value from the specified source column or key.

## `#[MapTo('column')]`

Sets destination key during reverse sync or export.

## `#[MapIgnore]`

Excludes property from mapping. Accepts `both`, `to_target`, or `to_source` to control direction.

## `#[MapCast(Target::class)]`

Hydrates nested child entity or collection (`isCollection: true`).

## `#[MapWith(Transformer::class)]`

Applies custom `ValueTransformerInterface` for forward and reverse transforms. See [Custom Transformers](../transformers).
