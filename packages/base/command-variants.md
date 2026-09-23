# Command Variant Architecture

Jengo introduces a highly extensible **Command Variant** architecture to CodeIgniter 4. This system moves away from flat, bloated CLI lists in favor of organized, "Master/Variant" command structures.

## How it Works

Instead of registering dozens of individual commands (like `jengo:make-action`, `jengo:make-page`, etc.), Jengo uses a single **Master Command** (e.g., `jengo:make`) that acts as a dynamic router.

When you run a command like `php spark jengo:make page`, the Master command:

1. Detects the first argument (`page`).
2. Scans the registered namespaces for a matching **Variant class** (e.g., `PageVariant`).
3. Executes the variant's logic seamlessly.

## Benefits

- **Clean CLI**: Running `php spark list` only shows the high-level Master commands, keeping the interface focused and professional.
- **Dynamic Help**: Master commands automatically generate their help screens by discovering available variants and their specific arguments/options.
- **Infinite Extensibility**: You can add your own variants without modifying the Jengo core.

## Extending with Custom Variants

To add a new variant to a Master command, simply create a class in your `App` namespace that implements `Jengo\Base\Contracts\CommandVariantInterface` (or extends `AbstractVariant`).

For example, to add `php spark jengo:make component`:

1. Create `app/Commands/Variants/Make/ComponentVariant.php`.
2. Implement the `name()`, `description()`, and `run()` methods.
3. Jengo will automatically pick it up and list it under `jengo:make`!
