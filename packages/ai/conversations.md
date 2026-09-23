# Multi-Turn Conversations

Construct rich conversational context with role-based messages:

```php
use Jengo\Ai\Ai;

$chat = Ai::chat([
    ['role' => 'system', 'content' => 'You are a helpful travel assistant.'],
    ['role' => 'user', 'content' => 'I am planning a 3-day trip to Nairobi.'],
    ['role' => 'assistant', 'content' => 'Nairobi has great sights! Do you prefer wildlife or culture?'],
])
->user('I want to see wildlife and national parks.')
->temperature(0.5)
->generate();

echo $chat->text();
```
