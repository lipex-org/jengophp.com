# Configuration

All configuration is managed through `app/Config/Pesa.php`.

```php
<?php

namespace Config;

use Jengo\Pesa\Config\Pesa as BasePesa;

class Pesa extends BasePesa
{
    public string $default = 'mpesa';
    public string $currency = 'KES';
    public bool $enableLedger = true;
    public string $table = 'pesa_transactions';

    public array $gateways = [
        'mpesa' => [
            'env'                 => 'sandbox', // 'sandbox' or 'live'
            'shortcode'           => '174379',
            'consumer_key'        => '',
            'consumer_secret'     => '',
            'passkey'             => '',
            'initiator_name'      => '',
            'security_credential' => '',
            'cert_path'           => '',
            'callback_url'        => '',
            'timeout_url'         => '',
            'result_url'          => '',
        ],
        'pesapal' => [
            'env'             => 'sandbox',
            'consumer_key'    => '',
            'consumer_secret' => '',
            'ipn_id'          => '',
            'callback_url'    => '',
        ],
        'stripe' => [
            'key'            => '',
            'secret'         => '',
            'webhook_secret' => '',
        ],
        'fake' => [
            'auto_succeed'   => true,
            'latency_ms'     => 100,
        ],
    ];
}
```

---

## Environment Variables Binding

CodeIgniter 4 automatically maps `.env` variables to config properties using the config class name prefix:

```env
# Global Settings
pesa.default = mpesa
pesa.currency = KES

# M-Pesa Settings
pesa.gateways.mpesa.env = sandbox
pesa.gateways.mpesa.shortcode = 174379
pesa.gateways.mpesa.consumer_key = your_consumer_key
pesa.gateways.mpesa.consumer_secret = your_consumer_secret
pesa.gateways.mpesa.passkey = your_passkey
```
