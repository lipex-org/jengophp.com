# Real-Time Streaming & Native CI4 SSE

Stream tokens dynamically to your frontend (React, Vue, Inertia, or vanilla JavaScript).

## Native Server-Sent Events (SSE) Controller

In your CodeIgniter 4 Controller, return `->toSseResponse()`:

```php
namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class AiStreamController extends ResourceController
{
    public function ask()
    {
        $prompt = $this->request->getGet('prompt') ?? 'Tell me a short story.';

        return ai($prompt)
            ->driver('openrouter')
            ->model('anthropic/claude-3.5-sonnet')
            ->stream()
            ->toSseResponse();
    }
}
```

The controller sends standard `data: {"chunk": "...", "accumulated": "..."}\n\n` frames and terminates with `data: [DONE]\n\n`.

## Callback-Based Streaming

```php
ai('Write an essay on modern PHP architecture.')
    ->stream(function (string $chunk, string $accumulated) {
        echo $chunk;
        flush();
    });
```
