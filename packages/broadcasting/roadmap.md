# Production Readiness Roadmap

The following engineering milestones are required before `jengo/broadcasting` can be considered for production workloads:

1. **Security & Input Auditing**: Strict packet framing boundaries, protection against slowloris socket exhaustion, and buffer length controls.
2. **Process Supervision**: Multi-process worker management and graceful signal recycling.
3. **Socket Leak & Memory Stability Tests**: 48-hour continuous stress tests under 1,000+ connect/disconnect cycles per minute.
4. **Horizontal Multi-Node Clustering**: Redis Pub/Sub adapter to synchronize events across multiple server instances.
5. **TLS/WSS Termination**: Direct SSL stream context handling without requiring an external reverse proxy.
