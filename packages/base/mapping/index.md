# Data Mappings

`jengo/base` includes a high-performance, bidirectional data mapping engine (`Jengo\Base\Mapping\Mapper`). It enables seamless mapping between arrays, third-party CodeIgniter 4 entities, generic objects/DTOs, and Jengo entities.

## On This Section

- [The Problem It Solves](#the-problem-it-solves)
- [Direct Entity Mapping](./direct-mapping)
- [The Central Mapper Engine](./mapper-engine)
- [Bi-Directional Synchronization](./syncing)
- [PHP 8 Mapping Attributes](./attributes/)
- [Custom Transformers](./transformers)
- [Performance Architecture](./performance)

## The Problem It Solves

Third-party CodeIgniter 4 packages (such as CodeIgniter Shield, Myth:Auth, or custom vendor packages) frequently provide their own `Entity` classes extending `CodeIgniter\Entity\Entity`. Because PHP does not support multiple inheritance, application entities cannot extend both the third-party entity and `Jengo\Base\Entities\BaseEntity`.

With the mapping system, you can define a domain entity extending `BaseEntity` (with Sqids ID obfuscation, `$hidden`, `$visible`, and custom casting), and map the third-party entity or raw array into it with zero friction.
