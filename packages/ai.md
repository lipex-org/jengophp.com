# jengo/ai

> **Status:** Production Ready &bull; **Version:** `v1.0.0`

`jengo/ai` is an enterprise-grade, multi-provider generative AI SDK, autonomous agent engine, and vector search toolkit engineered specifically for **CodeIgniter 4** and the **Jengo Framework**.

---

## Key Capabilities

- **Multi-Provider Driver Engine**: Seamlessly switch between **OpenAI**, **Anthropic Claude**, **Google Gemini**, **DeepSeek**, **Groq**, **OpenRouter** (300+ models with unified tool calling), and **Ollama** (offline local LLMs).
- **Native CI4 Dot-Notation `.env` Support**: Zero custom environment variable hacks. Configures cleanly using CodeIgniter 4's built-in `ai.providers.<driver>.<key>` dot-notation system with zero runtime overhead.
- **Fluent Request & Multi-Turn Chat Builder**: Intuitive, chainable API supporting single prompts, conversational dialogs, role histories (`system`, `user`, `assistant`, `tool`), temperature, top-p, and token budgets.
- **Schema-First Structured JSON Outputs**: Strict JSON schema enforcement with type validation (`->schema([...])->asArray()`, `->asObject()`) for reliable AI-driven data extraction and workflow automation.
- **Autonomous Tool Calling & Reflection Discovery**: Define custom tools manually or auto-discover methods via PHP 8 `#[AiTool]` and `#[AiParameter]` attributes. Supports multi-turn recursive execution loops with automatic result feeding.
- **Real-Time Token Streaming & Native SSE**: Stream LLM tokens in real time with a one-line CodeIgniter 4 Server-Sent Events (SSE) controller response (`->stream()->toSseResponse()`).
- **Vector Embeddings & Semantic Search**: Generate high-dimensional vector embeddings and calculate cosine similarity using `VectorMath` for RAG and semantic retrieval.
- **Parameterized Prompt Templates**: Reusable template engine supporting `{variable}` interpolation and role casting.
- **Zero-Cost Testing Double (`Ai::fake()`)**: Comprehensive in-memory fake with recorded request inspection, sequenced responses, tool call simulation, and rich PHPUnit assertions (`assertPromptSent`, `assertModel`, `assertDriver`, `assertToolCalled`).

---

## Installation

Install the package via Composer:

```bash
composer require jengo/ai
```

Publish the configuration file using the Jengo Spark CLI:

```bash
php spark jengo:install ai
```

This publishes `app/Config/Ai.php` to your application.

---

## Configuration

`jengo/ai` integrates natively with CodeIgniter 4's configuration engine. You can configure defaults in `app/Config/Ai.php` and override any setting via your `.env` file using standard CI4 dot-notation.

### Configuration File (`app/Config/Ai.php`)

```php
namespace Config;

use Jengo\Ai\Config\Ai as BaseAi;

class Ai extends BaseAi
{
    /**
     * Default AI Provider Driver
     * Options: 'openai', 'anthropic', 'gemini', 'deepseek', 'groq', 'openrouter', 'ollama'
     */
    public string $default = 'openai';

    /**
     * Provider API Credentials and Options
     */
    public array $providers = [
        'openai' => [
            'key'          => '',
            'organization' => null,
            'model'        => 'gpt-4o-mini',
            'base_url'     => 'https://api.openai.com/v1',
            'timeout'      => 30,
            'retry'        => 3,
        ],
        'anthropic' => [
            'key'      => '',
            'model'    => 'claude-3-5-sonnet-20241022',
            'base_url' => 'https://api.anthropic.com/v1',
            'timeout'  => 30,
            'retry'    => 2,
        ],
        'gemini' => [
            'key'      => '',
            'model'    => 'gemini-2.0-flash',
            'base_url' => 'https://generativelanguage.googleapis.com/v1beta',
            'timeout'  => 30,
            'retry'    => 2,
        ],
        'deepseek' => [
            'key'      => '',
            'model'    => 'deepseek-chat',
            'base_url' => 'https://api.deepseek.com/v1',
            'timeout'  => 60,
            'retry'    => 2,
        ],
        'groq' => [
            'key'      => '',
            'model'    => 'llama-3.3-70b-versatile',
            'base_url' => 'https://api.groq.com/openai/v1',
            'timeout'  => 15,
            'retry'    => 2,
        ],
        'openrouter' => [
            'key'       => '',
            'model'     => 'openai/gpt-4o-mini',
            'base_url'  => 'https://openrouter.ai/api/v1',
            'site_url'  => '',
            'site_name' => 'Jengo AI',
            'timeout'   => 60,
            'retry'     => 2,
        ],
        'ollama' => [
            'base_url' => 'http://localhost:11434',
            'model'    => 'llama3.2',
            'timeout'  => 120,
            'retry'    => 1,
        ],
    ];

    /**
     * Global Generation Defaults
     */
    public array $defaults = [
        'temperature' => 0.7,
        'max_tokens'  => 2048,
        'max_steps'   => 5, // Maximum recursive tool-call steps in agentic mode
    ];
}
```

### Environment Variables (`.env`)

Leverage CodeIgniter 4's native dot-notation to populate credentials without custom environment variables:

```ini
# Default Provider
ai.default = 'openrouter'

# Provider API Keys & Defaults
ai.providers.openrouter.key = 'sk-or-v1-xxxxxxxxxxxxxxxxxxxx'
ai.providers.openrouter.model = 'anthropic/claude-3.5-sonnet'

ai.providers.openai.key = 'sk-proj-xxxxxxxxxxxxxxxxxxxx'
ai.providers.openai.model = 'gpt-4o-mini'

ai.providers.anthropic.key = 'sk-ant-api03-xxxxxxxxxxxxxxxxxxxx'
ai.providers.gemini.key = 'AIzaSyxxxxxxxxxxxxxxxxxxxx'
ai.providers.deepseek.key = 'sk-xxxxxxxxxxxxxxxxxxxx'
ai.providers.groq.key = 'gsk_xxxxxxxxxxxxxxxxxxxx'

# Global Settings
ai.defaults.temperature = 0.7
ai.defaults.max_tokens = 2048
```

---

## Quick Start

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

---

## Multi-Turn Conversations

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

---

## Schema-First Structured Output

Eliminate brittle regex parsing. Force the LLM to return strictly validated JSON structures directly mapped to PHP arrays or objects:

```php
use Jengo\Ai\Ai;

$userProfile = ai('Extract user details: John Doe, 32 years old, software engineer based in Nairobi, likes PHP and Rust.')
    ->system('Extract structured user information.')
    ->schema([
        'name'       => 'string',
        'age'        => 'integer',
        'occupation' => 'string',
        'city'       => 'string',
        'skills'     => 'array',
        'bio'        => 'string|nullable',
    ])
    ->asArray();

// Returns type-safe PHP array:
// [
//     'name'       => 'John Doe',
//     'age'        => 32,
//     'occupation' => 'software engineer',
//     'city'       => 'Nairobi',
//     'skills'     => ['PHP', 'Rust'],
//     'bio'        => null,
// ]
```

You can also use `->asObject()` to receive a standard `stdClass` object.

---

## Tool Calling & Autonomous Agents

`jengo/ai` features a multi-turn agentic execution loop. The model can autonomously decide to call one or more PHP functions, receive their outputs, and continue reasoning until reaching the final answer.

### Method 1: PHP 8 Attribute Discovery (`#[AiTool]`)

Decorate any service or repository methods with `#[AiTool]` and `#[AiParameter]`:

```php
namespace App\AiTools;

use Jengo\Ai\Attributes\AiTool;
use Jengo\Ai\Attributes\AiParameter;

class StoreAssistant
{
    #[AiTool(
        name: 'searchProducts',
        description: 'Search the product catalog for availability and pricing.'
    )]
    public function searchProducts(
        #[AiParameter(description: 'Search keywords, e.g. "Pixel 8" or "Laptop"')]
        string $query,
        #[AiParameter(description: 'Optional category filter', required: false)]
        ?string $category = null
    ): array {
        return model('ProductModel')
            ->like('name', $query)
            ->findAll();
    }

    #[AiTool(
        name: 'applyCoupon',
        description: 'Validate and calculate discount for a promotional coupon code.'
    )]
    public function applyCoupon(
        #[AiParameter(description: 'The coupon code string, e.g. "VIP50"')]
        string $code,
        #[AiParameter(description: 'The order subtotal amount in USD')]
        float $subtotal
    ): array {
        if ($code === 'VIP50') {
            return ['valid' => true, 'discount' => $subtotal * 0.5, 'final_price' => $subtotal * 0.5];
        }

        return ['valid' => false, 'discount' => 0.0, 'message' => 'Invalid coupon code.'];
    }
}
```

Attach your tools directly with `->withToolsFrom()`:

```php
use App\AiTools\StoreAssistant;

$response = ai('Do we have any Pixel phones in stock? If so, what is the price after applying coupon VIP50?')
    ->withToolsFrom(new StoreAssistant())
    ->maxSteps(5) // Max recursive agent steps
    ->generate();

echo $response->text();
// The model autonomously calls searchProducts('Pixel'), calculates the discount with applyCoupon('VIP50', 799), and provides a complete final answer!
```

### Method 2: Fluent Tool Definition

You can also register tools programmatically:

```php
use Jengo\Ai\Support\Tool;

$weatherTool = Tool::make('getWeather', 'Get the current weather for a city')
    ->parameter('city', 'string', 'The city name, e.g. London')
    ->parameter('unit', 'string', 'Temperature unit: c or f', required: false)
    ->handler(function (string $city, string $unit = 'c') {
        return ['city' => $city, 'temp' => 22, 'unit' => $unit, 'condition' => 'Sunny'];
    });

$answer = ai('What is the weather in Tokyo right now?')
    ->withTools($weatherTool)
    ->text();
```

---

## Real-Time Streaming & Native CI4 SSE

Stream tokens dynamically to your frontend (React, Vue, Inertia, or vanilla JavaScript).

### Native Server-Sent Events (SSE) Controller

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

### Callback-Based Streaming

```php
ai('Write an essay on modern PHP architecture.')
    ->stream(function (string $chunk, string $accumulated) {
        echo $chunk;
        flush();
    });
```

---

## Vector Embeddings & Similarity Search

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

---

## Parameterized Prompt Templates

Create reusable, type-safe prompt templates with `{variable}` placeholders:

```php
use Jengo\Ai\Support\PromptTemplate;

$template = PromptTemplate::make('Summarize the following customer ticket for {agent_name} in {language}:\n\n"{ticket_body}"');

$prompt = $template->render([
    'agent_name'  => 'Sarah',
    'language'    => 'Spanish',
    'ticket_body' => 'Customer is having trouble syncing invoices with QuickBooks.',
]);

$response = ai($prompt)->text();
```

---

## Zero-Cost Testing Double (`Ai::fake()`)

Prevent expensive API calls and network flakiness in your PHPUnit tests by swapping in the testing double:

```php
namespace Tests\Feature;

use CodeIgniter\Test\CIUnitTestCase;
use Jengo\Ai\Ai;

class AiFeatureTest extends CIUnitTestCase
{
    public function testCustomerSupportResponse(): void
    {
        // Swap client with fake canned response
        $fake = Ai::fake('Your return request has been approved.');

        $response = ai('Can I return order #1042?')->text();

        $this->assertSame('Your return request has been approved.', $response);

        // Assertions
        $fake->assertPromptSent('order #1042');
        $fake->assertPromptNotSent('delete account');
    }

    public function testSequencedResponses(): void
    {
        $fake = Ai::fakeSequence()
            ->push('First answer')
            ->push('Second answer');

        $this->assertSame('First answer', ai('Question 1')->text());
        $this->assertSame('Second answer', ai('Question 2')->text());
    }

    public function testToolCallSimulation(): void
    {
        $fake = Ai::fake();
        $fake->pushToolCall('searchProducts', ['query' => 'Pixel 9']);

        // Test your tool-handling logic...
        $fake->assertToolCalled('searchProducts');
    }
}
```

### Available Assertions

- `assertPromptSent(string|callable $prompt)`
- `assertPromptNotSent(string|callable $prompt)`
- `assertModel(string $model)`
- `assertDriver(string $driver)`
- `assertToolCalled(string $toolName, ?callable $callback = null)`

---

## Supported Providers & Models

| Provider | Driver Identifier | Recommended Models | Tool Calling Support |
| :--- | :--- | :--- | :--- |
| **OpenAI** | `openai` | `gpt-4o`, `gpt-4o-mini`, `o1`, `o3-mini` | Supported (Native) |
| **Anthropic** | `anthropic` | `claude-3-5-sonnet-20241022`, `claude-3-5-haiku-20241022` | Supported (Native) |
| **Google Gemini** | `gemini` | `gemini-2.0-flash`, `gemini-1.5-pro` | Supported (Native) |
| **DeepSeek** | `deepseek` | `deepseek-chat`, `deepseek-reasoner` | Supported (Native) |
| **Groq** | `groq` | `llama-3.3-70b-versatile`, `mixtral-8x7b-32768` | Supported (Native) |
| **OpenRouter** | `openrouter` | 300+ models (OpenAI, Anthropic, Meta, Mistral, Qwen) | Supported (Native) |
| **Ollama** | `ollama` | `llama3.2`, `mistral`, `qwen2.5`, `deepseek-r1` | Supported (Native) |
