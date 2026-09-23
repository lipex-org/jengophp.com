# Direct Browser Pre-Signed Uploads (Backend)

To upload large files directly from the browser (Inertia.js, React, Vue) to S3 or Cloudflare R2 without passing through the PHP web server:

```php
namespace App\Controllers;

use CodeIgniter\Controller;
use Jengo\Storage\Storage;

class MediaController extends Controller
{
    public function getUploadTicket()
    {
        $userId = auth()->id();
        $filename = "uploads/{$userId}/" . bin2hex(random_bytes(16)) . ".mp4";

        $ticket = Storage::disk('s3')->createUploadUrl($filename, [
            'expires'     => time() + 900,
            'contentType' => 'video/mp4',
            'visibility'  => 'private',
        ]);

        return $this->response->setJSON([
            'uploadUrl' => $ticket->getUrl(),
            'headers'   => $ticket->getHeaders(),
            'key'       => $filename,
        ]);
    }
}
```

For the client-side counterpart, see [Direct Cloud Transfers with `@jengo/storage`](./frontend-client/direct-cloud).
