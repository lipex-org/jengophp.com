# Local Development WebSocket Server

Start the built-in development daemon:

```bash
# Default host 0.0.0.0, port 6001
php spark broadcast:serve

# Custom options
php spark broadcast:serve --host=127.0.0.1 --port=8080
```

> [!NOTE]
> The built-in daemon is designed strictly as a zero-dependency local development and testing convenience. It eliminates the need for Node.js, Docker, or external cloud accounts during local feature development. It is **not** intended for production environments.
