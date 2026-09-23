# Custom Notification Senders & Queues

Swap the default mailer with an asynchronous background queue or third-party service by implementing `Jengo\Auth\Contracts\NotificationSenderInterface`:

```php
namespace App\Notifications;

use Jengo\Auth\Contracts\NotificationSenderInterface;
use Jengo\Auth\Entities\User;

class QueuedAuthNotifier implements NotificationSenderInterface
{
    public function sendMagicLink(User $user, string $token, string $url): bool
    {
        queue('emails')->push(new SendMagicLinkJob($user->getEmail(), $url));
        return true;
    }

    public function sendPasswordReset(User $user, string $token, string $url): bool
    {
        queue('emails')->push(new SendPasswordResetJob($user->getEmail(), $url));
        return true;
    }

    public function sendMfaCode(User $user, string $code): bool
    {
        return true;
    }

    public function sendActivation(User $user, string $token, string $url): bool
    {
        return true;
    }

    public function sendNotification(string $type, User $user, array $data = []): bool
    {
        return true;
    }
}
```

## Registering Your Custom Sender

Register your custom sender in `app/Config/Auth.php`:

```php
public string $notifier = \App\Notifications\QueuedAuthNotifier::class;
```
