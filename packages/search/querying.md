# Querying & Search Builder

`jengo/search` provides a fluent, chainable search query builder accessible via the `Search` facade or the `search()` helper.

---

## Basic Querying

```php
use Jengo\Search\Facades\Search;

// Filters accept single values or arrays (automatically delegating to whereIn):
$results = Search::query('articles', 'distributed architecture')
    ->where('category_id', [4, 5, 6])
    ->where('status', 'published')
    ->sortBy('created_at', 'desc')
    ->limit(15)
    ->page(1)
    ->get();

foreach ($results as $result) {
    echo $result->title . "\n";
    echo $result->getHighlight('title') . "\n";
}
```

---

## Global Helper Function

You can also use the `search()` global helper:

```php
$articles = search('articles', 'microservices')
    ->whereIn('status', ['published', 'archived'])
    ->get();
```

---

## Highlighting & Snippets

Retrieve matched search highlights with automatic engine-specific formatting tags (e.g. `<em>` or `<mark>`):

```php
$results = Search::query('articles', 'PHP 8.5')
    ->highlight(['title', 'content'])
    ->get();

foreach ($results as $item) {
    // Returns highlighted HTML snippet if available, or fallback plain text
    echo $item->getHighlight('title');
}
```

---

## Pagination & Faceting

```php
$results = Search::query('products', 'laptop')
    ->facets(['brand', 'screen_size'])
    ->paginate(perPage: 25, page: 2)
    ->get();

// Total count matched
$total = $results->total();

// Facet distributions
$facets = $results->facets();
```
