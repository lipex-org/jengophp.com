# The Broadcasting Mental Model

In standard web applications, communication is strictly client-pull:

- **Client Pull (HTTP Request-Response)**: The browser asks, and the server answers. If something changes on the server, the browser cannot know unless it polls (`setInterval(fetch, 2000)`), wasting bandwidth, CPU, and database queries.
- **Server Push (Broadcasting)**: A lightweight pipeline (WebSocket or SSE) remains connected. The instant an event occurs in PHP, calling `broadcast(new Event())` pushes the payload to all subscribed browsers in milliseconds.

```
[ PHP Backend Action ]
        │
        ▼ (triggers event)
broadcast(new OrderStatusUpdated($id, 'Cooking'))
        │
        ▼ (driver sends payload)
[ Broadcaster Engine: SSE or WebSocket ]
        │
        ▼ (pushes frame over open socket)
[ Client Browser Frontend ]
        │
        ▼ (receives event within ~10ms)
DOM updates without page reload
```
