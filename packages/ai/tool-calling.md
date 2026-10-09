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

### Dependency Injection & Container Autowiring

You can pass class-strings directly to `withToolsFrom()`. The tool class is instantiated via the PSR-11 container (`$this->make()` or `Services::autowire()`), resolving all constructor dependencies automatically:

```php
namespace App\AiTools;

use App\Repositories\ProductRepository;
use Jengo\Ai\Attributes\AiTool;
use Jengo\Ai\Attributes\AiParameter;

class InventoryAssistant
{
    public function __construct(
        protected ProductRepository $products
    ) {}

    #[AiTool(name: 'findStock', description: 'Look up product stock levels')]
    public function findStock(#[AiParameter(description: 'SKU or name')] string $query): array
    {
        return $this->products->findBySkuOrName($query);
    }
}

// Pass the class string directly — constructor dependencies are autowired:
$answer = ai('Check stock for SKU-100')
    ->withToolsFrom(InventoryAssistant::class)
    ->text();
```

## Method 2: Fluent Tool Definition

You can also register tools programmatically using `Tool::make()`. Tool handlers also benefit from dependency injection — any parameters not provided by the AI model can be autowired from the container:

```php
use Jengo\Ai\Support\Tool;
use App\Services\WeatherService;

$weatherTool = Tool::make('getWeather', 'Get the current weather for a city')
    ->parameter('city', 'string', 'The city name, e.g. London')
    ->parameter('unit', 'string', 'Temperature unit: c or f', required: false)
    ->handler(function (string $city, string $unit = 'c', WeatherService $weather) {
        // $weather is automatically resolved from the DI container!
        return $weather->getForecast($city, $unit);
    });

$answer = ai('What is the weather in Tokyo right now?')
    ->withTools($weatherTool)
    ->text();
```
