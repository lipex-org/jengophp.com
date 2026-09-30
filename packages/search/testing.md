# Testing with Search::fake()

`jengo/search` includes a comprehensive in-memory test double driver that records all queries, indexed documents, and flush events without needing a real search cluster running in your CI/CD test pipeline.

---

## Activating Search::fake()

```php
use Jengo\Search\Facades\Search;
use PHPUnit\Framework\TestCase;

class SearchIntegrationTest extends TestCase
{
    protected function tearDown(): void
    {
        Search::resetFake();
        parent::tearDown();
    }

    public function testArticlesAreIndexedWhenCreated(): void
    {
        $fake = Search::fake();

        // Perform model creation or indexing
        $model = new \App\Models\ArticleModel();
        $model->insert([
            'id'    => 1,
            'title' => 'Building Fast Search in CodeIgniter',
        ]);

        // Assertions
        $fake->assertIndexed('articles', 1);
        $fake->assertIndexed('articles', 1, function ($doc) {
            return $doc['title'] === 'Building Fast Search in CodeIgniter';
        });
        $fake->assertNotIndexed('articles', 999);
    }
}
```

---

## Available Test Assertions

| Method | Description |
| :--- | :--- |
| `$fake->assertIndexed($index, $id, ?callable $callback)` | Assert document was added to index, optionally verifying data via callback |
| `$fake->assertNotIndexed($index, $id)` | Assert document ID does not exist in index |
| `$fake->assertIndexCount($index, int $count)` | Assert total count of documents in index |
| `$fake->assertFlushed($index)` | Assert index was cleared/flushed |
| `$fake->assertNothingIndexed()` | Assert zero indexing operations occurred |
