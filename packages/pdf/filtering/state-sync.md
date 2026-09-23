# State Synchronization & Direct Downloads

- **URL Synchronization**: Modifying filter inputs synchronizes active filter parameters with the browser query string via `window.history.replaceState`. Refreshing or bookmarking the page preserves all active filter states.
- **Download Parity**: The preview toolbar "Download PDF" button carries forward all active filter parameters. In addition, calling `->inline()` or `->download()` directly on a filtered document automatically reads matching request query parameters and applies the `onFilter` callback prior to generating the binary PDF output.
