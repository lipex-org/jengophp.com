# Collaborative Kanban Board (`toOthers()` Pattern)

**Scenario**: User A drags a task card from "In Progress" to "Done". User B's screen sees the card move immediately, but User A does not receive their own echo, preventing UI stutter.

```php
public function moveTask()
{
    $taskId   = (string) $this->request->getPost('task_id');
    $toColumn = (string) $this->request->getPost('to_column');
    $socketId = $this->request->getHeaderLine('X-Socket-ID');

    Broadcast::on('board.engineering')
        ->as('TaskMoved')
        ->with(['task_id' => $taskId, 'to_column' => $toColumn])
        ->toOthers($socketId)
        ->send();

    return $this->response->setJSON(['status' => 'success']);
}
```

Client extracts `socket_id` on connection and passes it in headers:

```javascript
let currentSocketId = null;

ws.onmessage = (e) => {
    const frame = JSON.parse(e.data);
    if (frame.event === "pusher:connection_established") {
        currentSocketId = JSON.parse(frame.data).socket_id;
    }
    if (frame.event === "TaskMoved") {
        moveCardInDOM(frame.data.task_id, frame.data.to_column);
    }
};

fetch("/tasks/move", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-Socket-ID": currentSocketId
    },
    body: JSON.stringify({ task_id: 12, to_column: "done" })
});
```
