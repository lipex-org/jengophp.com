# Configuration (`app/Config/Pdf.php`)

```php
namespace Config;

use Jengo\Pdf\Config\Pdf as BasePdf;

class Pdf extends BasePdf
{
    /**
     * Default driver ('dompdf' or 'chromium')
     */
    public string $driver = 'dompdf';

    /**
     * Default paper format ('A4', 'Letter', 'Legal', 'A3', 'A5')
     */
    public string $paperFormat = 'A4';

    /**
     * Default orientation ('portrait' or 'landscape')
     */
    public string $orientation = 'portrait';

    /**
     * Default watermark text or configuration
     */
    public string|bool $watermark = 'JENGO';

    /**
     * Chromium driver settings
     */
    public array $chromium = [
        'binary'   => 'google-chrome-stable', // or 'chromium', 'chromium-browser'
        'timeout'  => 30,
        'temp_dir' => WRITEPATH . 'temp/pdf',
    ];
}
```
