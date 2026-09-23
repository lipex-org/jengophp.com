# Testing with `Storage::fake()`

```php
namespace Tests\Feature;

use CodeIgniter\Test\CIUnitTestCase;
use Jengo\Storage\Storage;
use Jengo\Storage\Testing\FileFactory;

class FileUploadTest extends CIUnitTestCase
{
    public function test_user_can_upload_document(): void
    {
        // Intercept disk in memory
        Storage::fake('public');

        $fakeFile = FileFactory::create('contract.pdf', kilobytes: 50, mimeType: 'application/pdf');

        $response = $this->post('/documents/upload', [
            'file' => $fakeFile,
        ]);

        $response->assertStatus(200);

        // Assert file exists on disk
        Storage::disk('public')->assertExists('documents/contract.pdf');

        // Assert file count in directory
        Storage::disk('public')->assertDirectoryFileCount('documents', 1);

        // Assert file size
        Storage::disk('public')->assertSize('documents/contract.pdf', 50 * 1024);
    }
}
```

## Available Assertions

- `assertExists`
- `assertMissing`
- `assertSize`
- `assertChecksum`
- `assertDirectoryFileCount`
