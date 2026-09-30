# Defining & Dispatching Jobs

Learn how to write queueable job classes and dispatch them in your application.

---

## Defining Jobs

Jobs implement `Jengo\Queues\Contracts\ShouldQueue` and use the `Queueable` and `InteractsWithQueue` traits.

Create a new job class under `app/Jobs/`:

```php
<?php

namespace App\Jobs;

use Jengo\Queues\Contracts\ShouldQueue;
use Jengo\Queues\Traits\InteractsWithQueue;
use Jengo\Queues\Traits\Queueable;
use Throwable;

class SendWelcomeEmail implements ShouldQueue
{
    use Queueable;
    use InteractsWithQueue;

    /**
     * Max retry attempts before failing.
     */
    public int $tries = 3;

    /**
     * Timeout in seconds.
     */
    public int $timeout = 60;

    /**
     * Delay in seconds between retries.
     */
    public int $backoff = 10;

    public function __construct(public int $userId, public string $email)
    {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Perform the task
        log_message('info', "Sending welcome email to user {$this->userId} ({$this->email})...");
    }

    /**
     * Handle a job failure.
     */
    public function failed(Throwable $exception): void
    {
        log_message('error', "Failed to send welcome email: {$exception->getMessage()}");
    }
}
```

---

## Dispatching Jobs

### 1. Using the `dispatch()` Helper

```php
use App\Jobs\SendWelcomeEmail;

// Dispatch immediately to default queue
dispatch(new SendWelcomeEmail(10, 'user@example.com'));

// Dispatch with delay
dispatch_later(60, new SendWelcomeEmail(10, 'user@example.com'));
```

### 2. Fluent Dispatch from Job Instance

```php
(new SendWelcomeEmail(10, 'user@example.com'))
    ->onQueue('emails')
    ->onConnection('redis')
    ->delay(120)
    ->tries(5)
    ->backoff(30)
    ->dispatch();
```

### 3. Using the `Queue` Facade

```php
use Jengo\Queues\Facades\Queue;

// Push to default connection
Queue::push(new SendWelcomeEmail(10, 'user@example.com'));

// Push to specific queue on specific connection
Queue::connection('redis')->push(new SendWelcomeEmail(10, 'user@example.com'), '', 'emails');

// Push with delay
Queue::later(300, new SendWelcomeEmail(10, 'user@example.com'));
```

---

## Job Lifecycle Controls

Inside your job's `handle()` method, you can interact with the current job execution context:

```php
public function handle(): void
{
    if ($this->attempts() > 2) {
        log_message('warning', "Job attempt {$this->attempts()} running...");
    }

    if ($someCondition) {
        // Release job back to queue with 60s delay
        $this->release(60);
        return;
    }

    // Delete job manually if needed
    $this->delete();
}
```
