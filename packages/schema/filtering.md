# Filtering & Conditions

`jengo/schema` provides an extensive set of condition builders:

```php
query(UserSchema::class)
    // Basic equality & negation
    ->where('status', 'active')
    ->orWhere('role', 'admin')
    ->whereNot('email', 'banned@example.com')

    // Set membership
    ->whereIn('role_id', [1, 2, 5])
    ->whereNotIn('id', [10, 11])
    ->orWhereNotIn('tier', ['bronze'])

    // Pattern matching
    ->whereLike('first_name', '%Alex%')
    ->orWhereLike('last_name', '%Smith%')

    // Range conditions
    ->whereBetween('age', [21, 65])
    ->whereNotBetween('score', [0, 49])
    ->whereGt('reputation', 100)
    ->whereGte('level', 5)
    ->whereLt('strikes', 3)
    ->whereLte('penalty_points', 0)

    // Null checks
    ->whereNull('deleted_at')
    ->whereNotNull('email_verified_at')

    // Temporal helpers
    ->whereToday()           // Records created today
    ->whereSince('-7 days')  // Records created within the last 7 days

    // Conditional execution
    ->when($filterByCountry, fn($q) => $q->where('country', $countryCode))

    ->get();
```
