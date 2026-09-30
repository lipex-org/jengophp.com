# Supported Drivers & Deployment

`jengo/search` ships with zero-dependency drivers for the world's most popular open-source search engines.

---

## 1. Meilisearch

[Meilisearch](https://www.meilisearch.com/) is a lightning-fast, typo-tolerant search engine designed for instant search-as-you-type experiences.

### Quick Docker Deployment

```bash
docker run -d \
  -p 7700:7700 \
  -e MEILI_MASTER_KEY=masterKey123 \
  -v meili_data:/meili_data \
  getmeili/meilisearch:v1.12
```

---

## 2. Typesense

[Typesense](https://typesense.org/) is an open-source, in-memory search engine optimized for developer ergonomics and high concurrency.

### Quick Docker Deployment

```bash
docker run -d \
  -p 8108:8108 \
  -v typesense_data:/data \
  typesense/typesense:27.1 \
  --data-dir /data \
  --api-key=xyz123 \
  --enable-cors
```

---

## 3. Database Full-Text (MySQL / MariaDB)

For small-to-medium applications or shared hosting environments where running a dedicated search daemon isn't possible, the Database driver executes native full-text searches directly against your SQL tables with zero extra infrastructure.

Ensure your searchable columns have a `FULLTEXT` index:

```sql
ALTER TABLE articles ADD FULLTEXT(title, content);
```
