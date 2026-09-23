# Defining Roles and Permissions

Edit `app/Libraries/Vima/Setup.php` to declare your application's permissions and roles:

```php
namespace App\Libraries\Vima;

use Vima\Core\Config\Contracts\SetupProviderInterface;
use Vima\Core\Role\Entities\Role;
use Vima\Core\Permission\Entities\Permission;

class Setup implements SetupProviderInterface
{
    public function get(): array
    {
        return [
            'permissions' => [
                Permission::define('posts.create', 'Create new blog posts'),
                Permission::define('posts.edit', 'Edit existing blog posts'),
                Permission::define('posts.publish', 'Publish drafts live'),
                Permission::define('users.manage', 'Manage team members'),
            ],
            'roles' => [
                Role::define('editor', 'Content Editor')
                    ->withPermissions(['posts.create', 'posts.edit']),
                Role::define('admin', 'Administrator')
                    ->inherits(['editor'])
                    ->withPermissions(['posts.publish', 'users.manage']),
            ],
        ];
    }
}
```

Roles support inheritance via `->inherits([...])`, so a role can extend the permissions of another.
