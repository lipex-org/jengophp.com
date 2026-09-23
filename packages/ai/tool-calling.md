# Tool Calling & Autonomous Agents

`jengo/ai` features a multi-turn agentic execution loop. The model can autonomously decide to call one or more PHP functions, receive their outputs, and continue reasoning until reaching the final answer.

## Method 1: PHP 8 Attribute Discovery (`#[AiTool]`)

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

## Method 2: Fluent Tool Definition

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
