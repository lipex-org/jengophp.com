# Live Interactive Polling Room (Presence Channels)

**Scenario**: Real-time quiz or poll. Shows who is currently online in the room and tallies poll results in real time.

```php
// In app/Config/Channels.php
Broadcast::channel('poll.{id}', function ($user, string $id): array|false {
    if (! $user) return false;
    return ['id' => (string) $user->id, 'name' => (string) $user->name];
});
```
