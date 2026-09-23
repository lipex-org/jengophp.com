# Relational Mutations & Bulk Writes

All mutation operations are processed atomically inside database transaction savepoints. If any single validation rule or hook fails, the entire transaction is rolled back.

## Standard Resource Creation

```http
POST /api/v1/users
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

## Bulk Array Insertions (Batch POST)

Send an array of records to create multiple rows in a single atomic transaction:

```http
POST /api/v1/users
Content-Type: application/json

[
  { "name": "John Doe", "email": "john@example.com" },
  { "name": "Jane Doe", "email": "jane@example.com" },
  { "name": "Bob Smith", "email": "bob@example.com" }
]
```

## Nested Relational Writes

Create root resources and their child relations simultaneously:

```http
POST /api/v1/users
Content-Type: application/json

{
  "name": "Alice Smith",
  "email": "alice@example.com",
  "posts": [
    { "title": "First Blog Post", "content": "Hello World..." },
    { "title": "Second Blog Post", "content": "More content..." }
  ]
}
```
