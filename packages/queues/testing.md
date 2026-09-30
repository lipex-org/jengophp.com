# Testing with Queue::fake()

`jengo/queues` includes built-in test double capabilities to ensure jobs are dispatched without executing actual network calls or running database queries during test suites.

---

## Basic Testing Setup

Use `Queue::fake()` in your test cases or use the `QueueTestAssertionsTrait`:

```php
<?php

namespace Tests\Feature;

use App\Jobs\SendWelcomeEmail;
use CodeIgniter\Test\CIUnitTestCase;
use Jengo\Queues\Facades\Queue;
use Jengo\Queues\Testing\QueueTestAssertionsTrait;
use PHPUnit\Framework\Attributes\Test;

class RegistrationTest extends CIUnitTestCase
{
    use QueueTestAssertionsTrait;

    protected function tearDown(): void
    {
        $this->tearDownQueueFake();
        parent::tearDown();
    }

    #[Test]
    public function user_registration_dispatches_welcome_email(): void
    {
        // 1. Intercept all queue pushes
        $this->fakeQueue();

        // Ensure nothing was pushed initially
        $this->assertNothingPushed();

        // 2. Perform user action
        $user = ['id' => 1, 'email' => 'jane@example.com'];
        dispatch(new SendWelcomeEmail($user['id'], $user['email']));

        // 3. Assert job was pushed
        $this->assertPushed(SendWelcomeEmail::class);
        $this->assertPushedTimes(SendWelcomeEmail::class, 1);

        // 4. Assert job payload properties
        $this->assertPushed(SendWelcomeEmail::class, function (SendWelcomeEmail $job) {
            return $job->email === 'jane@example.com';
        });
    }
}
```

---

## Available Test Assertions

| Method | Description |
| :--- | :--- |
| `assertPushed($jobClass, $callback = null)` | Assert that a specific job was pushed at least once. |
| `assertPushedTimes($jobClass, $times, $callback = null)` | Assert that a specific job was pushed an exact number of times. |
| `assertPushedOn($queue, $jobClass, $callback = null)` | Assert that a specific job was pushed to a specific queue. |
| `assertNotPushed($jobClass, $callback = null)` | Assert that a job was never pushed to the queue. |
| `assertNothingPushed()` | Assert that no jobs were pushed to any queue. |
