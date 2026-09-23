# Interactive Browser Preview

Call `->preview()` on any document, schema report, or view to render an interactive in-browser preview toolbar:

```php
return Pdf::invoice('INV-001')->preview();
```

## Features Included in the Preview Canvas

- **Dark Mode Toolbar**: Live page navigation and status counters.
- **Smart DOM Pagination**: Dynamic splitting of tables and content into physical millimeter sheet frames.
- **Zoom Controls**: Zoom in/out, 100% reset, and Fit-to-Width.
- **Display Modes**: Toggle between multi-page sheet view and continuous scrolling.

## Keyboard Shortcuts

- `Ctrl + P` / `Cmd + P`: Instant print.
- `Ctrl + S` / `Cmd + S`: Direct PDF download.
- `+` / `-`: Zoom in / Zoom out.
- `0`: Reset Zoom.
- `F` / `f`: Toggle Slide-Over Filter Drawer.
- `Esc`: Close Slide-Over Filter Drawer.

## Next Steps

Add dynamic filter fields to your preview with the [Filtering & Slide-Over Drawer](./filtering/).
