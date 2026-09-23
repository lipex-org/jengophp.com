# Query Parameters

Endpoints support standardized URL query parameters.

## 1. Pagination

```http
GET /api/v1/users?page=2&limit=15
```

Returns standard pagination envelopes:

```json
{
  "status": "success",
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 15,
    "total": 120,
    "totalPages": 8,
    "hasMore": true,
    "nextPage": 3,
    "prevPage": 1
  }
}
```

## 2. Sorting

Prefix with `-` for descending order:

```http
GET /api/v1/users?sort=-created_at
```

## 3. Full-Text Search

```http
GET /api/v1/users?search=Alice
```

## 4. Relational Tree Derivations

Derive relationships defined in `$allowedRelations`:

```http
GET /api/v1/users?derive=profile,posts
```
