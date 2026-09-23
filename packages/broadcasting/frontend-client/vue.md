# Vue 3 Integration

Import composables directly from `@jengo/broadcasting/vue`:

```vue
<script setup lang="ts">
import { useChannel, usePresence } from '@jengo/broadcasting/vue';

useChannel('orders', 'OrderCreated', (order) => {
    console.log('New order:', order);
});

const { members } = usePresence('room.lobby');
</script>
```
