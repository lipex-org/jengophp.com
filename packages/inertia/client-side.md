# The Client Side

When using the Jengo Installer (`jengo new my-app --kit=react`), your client-side architecture is automatically set up in `resources/js/`.

## Directory Structure

- `resources/js/Pages/`: Contains your Inertia page components.
- `resources/js/Layouts/`: Contains reusable layouts (e.g., `AppLayout`, `GuestLayout`).
- `resources/js/app.entrypoint.(tsx|js)`: The main Vite entrypoint that boots the Inertia application.

## Accessing Shared Data in React (Example)

```tsx
import { usePage } from '@inertiajs/react';

export default function Dashboard() {
    // Access the shared data defined in the BaseController
    const { auth, flash, totalUsers } = usePage().props;

    return (
        <div>
            <h1>Welcome back, {auth.user.username}!</h1>
            {flash.success && <div className="alert">{flash.success}</div>}

            <p>Total Users: {totalUsers}</p>
        </div>
    );
}
```
