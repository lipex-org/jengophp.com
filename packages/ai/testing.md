# Zero-Cost Testing Double (`Ai::fake()`)

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

## Available Assertions

- `assertPromptSent(string|callable $prompt)`
- `assertPromptNotSent(string|callable $prompt)`
- `assertModel(string $model)`
- `assertDriver(string $driver)`
- `assertToolCalled(string $toolName, ?callable $callback = null)`
