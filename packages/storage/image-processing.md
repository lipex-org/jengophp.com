# Image Transformation Pipeline

Manipulate stored images via a fluent API without external heavyweight dependencies. The pipeline automatically selects the best available driver at runtime (preferring `Imagick` if installed, otherwise utilizing `GD`), requiring zero manual driver configuration.

```php
use Jengo\Storage\Storage;

// Resize, fit, and convert to WebP
Storage::disk('public')
    ->image('products/camera.jpg')
    ->fit(800, 600)
    ->toWebp(quality: 85)
    ->save('products/camera_thumb.webp');

// Watermarking and aspect-ratio resizing
Storage::disk('public')
    ->image('photos/landscape.png')
    ->resize(1920) // Calculates height proportionally
    ->watermark('branding/watermark.png', position: 'bottom-right', opacity: 75)
    ->save('photos/landscape_watermarked.jpg');

// Generating responsive breakpoint sets
$variants = Storage::disk('public')
    ->image('hero.jpg')
    ->generateResponsiveVariants('hero_variants', [
        'sm' => 640,
        'md' => 1024,
        'lg' => 1920,
    ], format: 'webp', quality: 80);
```
