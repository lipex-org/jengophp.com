# Database Automation

Jengo provides an incredibly smooth out-of-the-box database experience, enabling you to start writing code instantly without setting up local MySQL servers.

## Zero-Config SQLite

By default, the Jengo Installer configures your new application to use an **SQLite** database. 

During the installation process, the `DbInstaller` automatically:
1. Parses your `app/Config/Database.php`.
2. Comments out the default MySQL block.
3. Uncomments the SQLite block and points it to `WRITEPATH . 'database.db'`.

## Automatic Migrations

After configuring the connection, the installer automatically executes:

```bash
php spark migrate --all
```

If you included the Auth suite (`--auth`), this means that the `users`, `auth_identities`, and `auth_logins` tables are created for you immediately. You can boot the application and register a user right away!

## Switching to Production Databases

When you are ready to deploy or switch to a robust local database (like MySQL or PostgreSQL), simply open your `app/Config/Database.php`, comment the SQLite block back out, and uncomment your preferred database driver.
