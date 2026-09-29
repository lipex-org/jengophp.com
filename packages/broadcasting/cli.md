# CLI Commands

`jengo/broadcasting` provides Spark CLI commands to run local WebSocket servers, stream SSE events, inspect broadcast routing tables, and test event delivery.

---

## Available Commands

| Command | Description |
| :--- | :--- |
| `php spark broadcast:serve` | Starts the Ratchet/Workerman WebSocket daemon. |
| `php spark broadcast:sse` | Starts a standalone local Server-Sent Events (SSE) daemon for low-overhead testing. |
| `php spark broadcast:routes` | Lists all registered private and presence channel authorization routes. |
| `php spark broadcast:test` | Fires a test event to verify driver and channel dispatch. |

---

## Running the WebSocket Server

Start the local WebSocket development daemon:

```bash
php spark broadcast:serve
```

### Options

| Option | Default | Description |
| :--- | :--- | :--- |
| `--port` | `8080` | Port for the WebSocket server to listen on. |
| `--host` | `0.0.0.0` | Host IP binding. |
| `--ssl` | `false` | Enable TLS/WSS encryption. |

```bash
php spark broadcast:serve --port=6001 --host=127.0.0.1
```

---

## Testing Server-Sent Events (SSE)

For SSE driver architectures:

```bash
php spark broadcast:sse --port=8085
```

Clients can subscribe to the SSE stream at `http://localhost:8085/sse`.

---

## Inspecting Broadcast Routes

To audit all declared broadcast channel authorization callbacks:

```bash
php spark broadcast:routes
```

Example output:

```text
+-----------------------+--------------------+--------------------------------+
| Channel Pattern       | Type               | Authorization Handler          |
+-----------------------+--------------------+--------------------------------+
| orders.{orderId}      | Private            | App\Channels\OrderChannel      |
| room.{roomId}         | Presence           | App\Channels\ChatRoomChannel   |
| system.announcements  | Public             | None (Open)                    |
+-----------------------+--------------------+--------------------------------+
```

---

## Testing Event Dispatch

Verify your broadcast driver configuration (Pusher, Reverb, Redis, or SSE) by triggering a test event from the terminal:

```bash
php spark broadcast:test orders.101 --event=OrderUpdated --data='{"status":"shipped"}'
```

The command logs delivery payloads, timestamps, driver responses, and target socket IDs.
