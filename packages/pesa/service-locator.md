# Service Locator & Dependency Injection

While `jengo/pesa` provides the static `Pesa` facade and `pesa()` helper function, it is built directly on top of CodeIgniter 4's Service Locator (`Config\Services::pesa()`).

---

## 1. Using `service('pesa')`

You can resolve the `PesaManager` instance anywhere in CodeIgniter using the global `service()` helper:

```php
use Jengo\Pesa\PesaManager;

/** @var PesaManager $pesa */
$pesa = service('pesa');

// Invoke gateway operations
$response = $pesa->gateway('mpesa')->stkPush($stkRequest);
```

---

## 2. Constructor & Method Injection in Controllers

Inject the service directly into your controllers or domain actions:

```php
namespace App\Controllers;

use App\Controllers\BaseController;
use Jengo\Pesa\DTO\StkRequest;
use Jengo\Pesa\PesaManager;

class CheckoutController extends BaseController
{
    protected PesaManager $pesa;

    public function __construct(?PesaManager $pesa = null)
    {
        $this->pesa = $pesa ?? service('pesa');
    }

    public function pay()
    {
        $response = $this->pesa->gateway('mpesa')->stkPush(new StkRequest(
            phone: (string) $this->request->getPost('phone'),
            amount: 500,
            accountReference: 'INV-101'
        ));

        return $this->response->setJSON($response->toArray());
    }
}
```

---

## 3. Dynamic Multi-Tenant Configuration

In multi-tenant SaaS applications where different organizations have their own M-Pesa shortcodes, passkeys, or Stripe accounts:

You can instantiate a fresh, isolated `PesaManager` with a dynamic `PesaConfig` instance by setting `$getShared = false`:

```php
use Jengo\Pesa\Config\Pesa as PesaConfig;
use Jengo\Pesa\Config\Services as PesaServices;

// Build tenant-specific configuration at runtime
$tenantConfig = new PesaConfig();
$tenantConfig->gateways['mpesa'] = [
    'env'             => 'live',
    'shortcode'       => $tenant->mpesa_shortcode,
    'consumer_key'    => $tenant->mpesa_key,
    'consumer_secret' => $tenant->mpesa_secret,
    'passkey'         => $tenant->mpesa_passkey,
    'callback_url'    => route_to('pesa.webhook', 'mpesa'),
];

// Create an isolated non-shared manager instance
$tenantPesaManager = PesaServices::pesa($tenantConfig, false);

// Execute STK push on the tenant's shortcode
$response = $tenantPesaManager->gateway('mpesa')->stkPush($request);
```
