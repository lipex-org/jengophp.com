# Server-Sent Events (SSE) Setup

Zero-daemon streaming directly through CodeIgniter 4's SSE controller:

```ts
import Broadcaster from '@jengo/broadcasting';

const broadcaster = new Broadcaster({
    broadcaster: 'sse',
    endpoint: '/broadcasting/sse',
    authEndpoint: '/broadcasting/auth',
});

// Subscribe to a public channel
broadcaster.channel('orders')
    .listen('OrderCreated', (event) => {
        console.log('New Order:', event);
    });
```
