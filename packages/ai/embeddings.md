# Vector Embeddings & Similarity Search

Generate high-dimensional embeddings for retrieval-augmented generation (RAG) and search:

```php
use Jengo\Ai\Ai;
use Jengo\Ai\Support\VectorMath;

// 1. Generate embeddings
$queryVector = Ai::embed('How do I reset my password?');
$docVector1  = Ai::embed('To change your account password, navigate to Account Settings > Security.');
$docVector2  = Ai::embed('Our annual company retreat is scheduled for November in Mombasa.');

// 2. Calculate cosine similarity (-1.0 to 1.0)
$sim1 = VectorMath::cosineSimilarity($queryVector, $docVector1); // e.g. 0.89 (High relevance)
$sim2 = VectorMath::cosineSimilarity($queryVector, $docVector2); // e.g. 0.12 (Low relevance)

// 3. Batch embedding
$batchVectors = Ai::embedMany([
    'Article 1 summary...',
    'Article 2 summary...',
    'Article 3 summary...',
]);
```
