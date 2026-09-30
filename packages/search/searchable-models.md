# Searchable Models

To make a CodeIgniter 4 Model or Entity searchable, add the `Searchable` trait and implement `SearchableInterface` (or use PHP 8's `#[SearchIndex]` attribute).

---

## Defining a Searchable Model

```php
<?php

namespace App\Models;

use CodeIgniter\Model;
use Jengo\Search\Attributes\SearchIndex;
use Jengo\Search\Contracts\SearchableInterface;
use Jengo\Search\Traits\Searchable;

#[SearchIndex(
    name: 'articles',
    searchableAttributes: ['title', 'content', 'author_name'],
    filterableAttributes: ['category_id', 'status', 'published_at'],
    sortableAttributes: ['created_at', 'views_count'],
    primaryKey: 'id'
)]
class ArticleModel extends Model implements SearchableInterface
{
    use Searchable;

    protected $table = 'articles';
    protected $primaryKey = 'id';
    protected $allowedFields = ['title', 'content', 'author_name', 'category_id', 'status', 'created_at'];

    /**
     * Optional: customize the data sent to the search engine.
     */
    public function toSearchableArray(): array
    {
        return [
            'id'            => (int) $this->id,
            'title'         => $this->title,
            'content'       => strip_tags((string) $this->content),
            'author_name'   => $this->author_name,
            'category_id'   => (int) $this->category_id,
            'status'        => $this->status,
            'created_at'    => strtotime((string) $this->created_at),
        ];
    }
}
```

## Automatic Lifecycle Hooks

Models using the `Searchable` trait automatically hook into CodeIgniter 4's Model events:
- **`afterInsert`**: Automatically indexes newly created records into your search engine.
- **`afterUpdate`**: Automatically synchronizes updated records to the search index.
- **`afterDelete`**: Automatically removes deleted records from the search index.

No manual `$model->searchIndex()` call is required during standard `$model->save()` or `$model->delete()` operations.

---

## Asynchronous Background Indexing

To prevent search engine latency during HTTP requests, enable background queues in `app/Config/Search.php`:

```php
public bool $queue = true;
```

When enabled, all document additions, updates, and removals are dispatched to the `jengo/queues` worker queue via `SyncSearchIndexJob`.

---

## Manual Index Synchronization

You can also manually trigger indexing or purging on model instances or query batches:

```php
$article = $articleModel->find(10);

// Index or re-index this single document
$article->searchIndex();

// Or purge from search index
$article->searchUnindex();
```

---

## Bulk Import via CLI

To import existing database records in chunks into your search cluster:

```bash
php spark jengo:search import "App\Models\ArticleModel" --chunk 500
```

