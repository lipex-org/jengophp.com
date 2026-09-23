# Svelte Integration

## Readable Stores

Import stores and lifecycle helpers directly from `@jengo/broadcasting/svelte`:

```svelte
<!-- Using Svelte readable stores with automatic subscriptions -->
<script lang="ts">
import { Broadcaster } from '@jengo/broadcasting';
import { createChannelStore } from '@jengo/broadcasting/svelte';

const broadcaster = new Broadcaster({
    broadcaster: 'sse',
    endpoint: '/broadcasting/sse',
});

const latestOrder = createChannelStore('orders', 'OrderCreated', null, broadcaster);
</script>

{#if $latestOrder}
    <p>New Order: {$latestOrder.id}</p>
{/if}
```

## Context & Lifecycle Hooks

Or use Svelte context and lifecycle hooks (`useChannel`, `usePresence`):

```svelte
<script lang="ts">
import { useChannel, usePresence } from '@jengo/broadcasting/svelte';

let messages = [];

useChannel('chat.lobby', 'NewMessage', (msg) => {
    messages = [...messages, msg];
});

const { members } = usePresence('room.lobby');
</script>

<ul>
    {#each $members as member (member.id)}
        <li>{member.info?.name ?? member.id}</li>
    {/each}
</ul>
```
