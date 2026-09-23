# React Integration

Import hooks directly from `@jengo/broadcasting/react`:

```tsx
import { BroadcastingProvider, useChannel, usePresence } from '@jengo/broadcasting/react';

export function ChatRoom({ roomId }: { roomId: string }) {
    useChannel(`chat.${roomId}`, 'NewMessage', (message) => {
        console.log('Incoming:', message);
    });

    const { members } = usePresence(`room.${roomId}`);

    return <div>Online Users: {members.length}</div>;
}
```
