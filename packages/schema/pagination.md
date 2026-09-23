# Pagination & Infinite Scrolling

## 1. Traditional Offset Pagination

```php
$result = query(UserSchema::class)
    ->paginate(page: 2, limit: 10)
    ->get();

$pagination = $result->pagination;

echo $pagination->page;        // 2
echo $pagination->limit;       // 10
echo $pagination->total;       // e.g. 84
echo $pagination->totalPages;  // 9
echo $pagination->hasMore;     // true
echo $pagination->nextPage;    // 3
echo $pagination->prevPage;    // 1
```

## 2. Cursor Pagination (Infinite Scrolling)

Opaque base64 cursors provide zero-offset performance degradation for infinite scroll feeds:

```php
// Initial request
$firstPage = query(UserFileSchema::class)
    ->sort('size', 'ASC')
    ->limit(10)
    ->get();

$nextCursor = $firstPage->pagination->nextCursor;

// Next request passing the cursor token
$nextPage = query(UserFileSchema::class)
    ->sort('size', 'ASC')
    ->after($nextCursor)
    ->limit(10)
    ->get();
```

## 3. Pagination Clamping

Prevent empty screens when users request out-of-range pages (e.g. after deleting records or following a stale URL).

By default, clamping is set to `'auto'` context-aware mode:

- **UI / Web requests** (standard web navigation and Inertia.js requests): Clamping is **enabled by default**, automatically snapping out-of-bounds page requests to the last valid page.
- **Pure API requests** (`/api/*` endpoints, `Accept: application/json` without Inertia, or cursor pagination): Clamping is **disabled by default**, allowing API clients and infinite scroll components to receive empty datasets (`data: []`) to know when to stop fetching.

```php
// In a UI/Inertia controller, requesting page 99 when only 5 pages exist
// automatically clamps to page 5:
$result = query(UserSchema::class)
    ->paginate(page: 99, limit: 10)
    ->get();

// Clamping transparency metadata
echo $result->pagination->page;          // 5 (actual page returned)
echo $result->pagination->clamped;       // true
echo $result->pagination->requestedPage; // 99 (original requested page)

// Explicit overrides:
query(UserSchema::class)->clamp(false); // Force off (e.g. for infinite scroll)
query(UserSchema::class)->clamp(true);  // Force on
```

You can customize the global clamping default in `app/Config/JengoSchema.php`:

```php
// 'auto' (context-aware), true (always on), or false (always off)
public bool|string $clamp = 'auto';
```
