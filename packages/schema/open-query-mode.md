# Open Query Mode (Request-Driven)

Open mode automatically inspects the active HTTP Request and binds query options without writing boilerplate controller logic.

## Example

```php
namespace App\Controllers;

use App\Schemas\UserSchema;
use CodeIgniter\RESTful\ResourceController;
use function Jengo\Schema\query;

class UserController extends ResourceController
{
    public function index()
    {
        // Automatically parses:
        // ?include=profile,files
        // &filter[status]=active
        // &sort=-created_at
        // &page=1
        // &limit=15
        $result = query(UserSchema::class)
            ->open()
            ->get();

        return $this->response->setJSON($result);
    }
}
```
