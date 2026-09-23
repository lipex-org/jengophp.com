# Installation

Install the package via Composer:

```bash
composer require jengo/auth
```

Run the interactive setup command:

```bash
php spark jengo:auth setup
```

Execute database migrations:

```bash
php spark migrate
```

The setup command publishes `app/Config/Auth.php`, `app/Config/Vima.php`, `app/Libraries/Vima/Setup.php`, and registers standard authentication routes in `app/Config/Routes.php`.
