# Configuration (`app/Config/Storage.php`)

```php
namespace Config;

use CodeIgniter\Config\BaseConfig;

class Storage extends BaseConfig
{
    public string $default = 'local';

    public string $signingKey = '';

    public string $signedRoutePrefix = 'storage/signed';

    public array $disks = [
        'local' => [
            'driver'     => 'local',
            'root'       => WRITEPATH . 'storage/app',
            'visibility' => 'private',
        ],

        'public' => [
            'driver'     => 'local',
            'root'       => WRITEPATH . 'storage/app/public',
            'url'        => '/storage',
            'visibility' => 'public',
        ],

        's3' => [
            'driver'                  => 's3',
            'key'                     => '',
            'secret'                  => '',
            'region'                  => 'us-east-1',
            'bucket'                  => '',
            'url'                     => '',
            'endpoint'                => '',
            'use_path_style_endpoint' => false,
        ],

        'r2' => [
            'driver'                  => 's3',
            'key'                     => '',
            'secret'                  => '',
            'region'                  => 'auto',
            'bucket'                  => '',
            'url'                     => '',
            'endpoint'                => '',
            'use_path_style_endpoint' => false,
        ],

        'minio' => [
            'driver'                  => 's3',
            'key'                     => 'minioadmin',
            'secret'                  => 'minioadmin',
            'region'                  => 'us-east-1',
            'bucket'                  => 'app-bucket',
            'endpoint'                => 'http://127.0.0.1:9000',
            'use_path_style_endpoint' => true,
        ],
    ];
}
```

## Environment Configuration (`.env`)

CodeIgniter 4 automatically maps environment variables to configuration class properties using dot notation matching the class name and property paths. You do not need to call `env()` within your configuration files.

Define overrides directly in your root `.env` file:

```ini
# Storage Settings
storage.default = 'local'
storage.signingKey = 'your-32-character-secret-key'

# AWS S3 Disk Configuration
storage.disks.s3.key = 'your-aws-access-key-id'
storage.disks.s3.secret = 'your-aws-secret-access-key'
storage.disks.s3.region = 'us-east-1'
storage.disks.s3.bucket = 'your-s3-bucket-name'
storage.disks.s3.url = 'https://your-s3-bucket-name.s3.amazonaws.com'

# Cloudflare R2 Disk Configuration
storage.disks.r2.key = 'your-r2-access-key-id'
storage.disks.r2.secret = 'your-r2-secret-access-key'
storage.disks.r2.region = 'auto'
storage.disks.r2.bucket = 'your-r2-bucket-name'
storage.disks.r2.endpoint = 'https://<account-id>.r2.cloudflarestorage.com'
storage.disks.r2.url = 'https://cdn.yourdomain.com'

# MinIO Local S3 Disk Configuration
storage.disks.minio.key = 'minioadmin'
storage.disks.minio.secret = 'minioadmin'
storage.disks.minio.region = 'us-east-1'
storage.disks.minio.bucket = 'app-bucket'
storage.disks.minio.endpoint = 'http://127.0.0.1:9000'
storage.disks.minio.use_path_style_endpoint = true
```
