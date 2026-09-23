# Quick Start

Use the global `ai()` helper or the `Ai` facade to trigger prompts:

```php
use Jengo\Ai\Ai;

// 1. Simple text generation via default driver
$answer = ai('Explain the event loop in Node.js in two sentences.')->text();

// 2. Explicit driver and model switching
$summary = ai('Summarize this quarterly earnings report...')
    ->driver('anthropic')
    ->model('claude-3-5-sonnet-20241022')
    ->temperature(0.2)
    ->text();

// 3. System prompt & parameter tuning
$response = Ai::prompt('Translate this invoice description to French: Web Development')
    ->system('You are an expert commercial translator. Output only the translation.')
    ->temperature(0.0)
    ->maxTokens(100)
    ->generate();

echo $response->text(); // "Développement Web"
echo $response->usage->totalTokens; // e.g. 35
```
