# WebSockets (Soketi / Pusher / Jengo WS) Setup

```ts
import Broadcaster from '@jengo/broadcasting';

const broadcaster = new Broadcaster({
    broadcaster: 'ws',
    key: 'jengo-app-key',
    wsHost: window.location.hostname,
    wsPort: 6001,
    forceTLS: false,
    authEndpoint: '/broadcasting/auth',
});

// Private channel with automatic CI4 CSRF handshake
broadcaster.private('chat.123')
    .listen('NewMessage', (message) => {
        console.log('Message:', message);
    });

// Presence channel
broadcaster.join('room.lobby')
    .here((users) => console.log('Active users:', users))
    .joining((user) => console.log('Joined:', user))
    .leaving((user) => console.log('Left:', user));
```
