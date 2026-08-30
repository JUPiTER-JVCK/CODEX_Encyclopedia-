---
title: SQL — language profile
layer: 08_User_Applications
section: languages
tags: [sql, postgres, mysql, sqlite, dialect]
updated: 2026-05-20
---

# SQL — language profile

> Declarative query language. ANSI SQL is a baseline; every engine adds its own
> dialect. Big four to know: **PostgreSQL**, **MySQL/MariaDB**, **SQLite**,
> **Microsoft SQL Server**.

## Engines / CLIs

| Engine | CLI | Notes |
|--------|-----|-------|
| PostgreSQL | `psql` | The serious choice. JSONB, window functions, CTEs, generated cols |
| MySQL / MariaDB | `mysql` / `mariadb` | Ubiquitous in PHP era; MariaDB is the open fork |
| SQLite | `sqlite3` | Single-file DB; embedded everywhere |
| MS SQL Server | `sqlcmd` / `mssql-cli` | Strong Windows shop default |
| Oracle | `sqlplus` / `sqlcl` | Enterprise legacy |
| DuckDB | `duckdb` | Embedded OLAP — Parquet/Arrow first-class |
| ClickHouse | `clickhouse-client` | Columnar analytics |
| Snowflake | `snowsql` | Cloud DW |
| BigQuery | `bq` | GCP DW |
| Redshift | `psql` (compatible) | AWS DW |

## DDL (Data Definition Language)

```sql
CREATE TABLE users (
    id           bigserial PRIMARY KEY,
    email        text NOT NULL UNIQUE,
    name         text,
    created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX users_name_idx ON users (name);
CREATE UNIQUE INDEX users_email_lower_idx ON users (LOWER(email));

ALTER TABLE users ADD COLUMN is_admin boolean NOT NULL DEFAULT false;
ALTER TABLE users DROP COLUMN name;
ALTER TABLE users RENAME COLUMN email TO email_address;
```

## DML (Data Manipulation Language)

```sql
INSERT INTO users (email, name) VALUES ('a@b.com', 'A');

INSERT INTO users (email, name) VALUES ('a@b.com', 'A')
    ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;  -- Postgres upsert

UPDATE users SET name = 'B' WHERE id = 1;

DELETE FROM users WHERE created_at < now() - interval '1 year';
```

## SELECT essentials

```sql
SELECT u.id, u.email, COUNT(o.id) AS orders
  FROM users u
  LEFT JOIN orders o ON o.user_id = u.id
 WHERE u.created_at >= now() - interval '7 days'
 GROUP BY u.id, u.email
 HAVING COUNT(o.id) > 0
 ORDER BY orders DESC
 LIMIT 100;
```

| Clause | Purpose |
|--------|---------|
| `SELECT … FROM … WHERE …` | Projection + source + filter |
| `JOIN` (INNER / LEFT / RIGHT / FULL / CROSS) | Combine tables |
| `GROUP BY` + aggregates (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `STRING_AGG`/`GROUP_CONCAT`) | Aggregation |
| `HAVING` | Filter after grouping |
| `ORDER BY` | Sort |
| `LIMIT n OFFSET m` (MySQL/Postgres) / `FETCH FIRST n ROWS ONLY` (ANSI) | Pagination |
| `DISTINCT` / `DISTINCT ON (col)` (Postgres) | De-dupe |
| `UNION` / `UNION ALL` / `INTERSECT` / `EXCEPT` | Set ops |
| `EXISTS (SELECT 1 FROM ...)` / `NOT EXISTS` | Existence check |
| `IN (…)` / `NOT IN` | Membership |
| `LIKE 'foo%'` / `ILIKE` (Postgres) / `~` regex (Postgres) | String match |

## Joins reference

```
LEFT JOIN  — all rows from left + matching right (NULL if none)
INNER JOIN — only rows with match on both sides
RIGHT JOIN — all rows from right + matching left
FULL JOIN  — union of LEFT and RIGHT
CROSS JOIN — cartesian product (rarely intended)
```

## CTEs + window functions (modern SQL)

```sql
WITH recent AS (
    SELECT * FROM orders WHERE created_at > now() - interval '30 days'
), ranked AS (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY total DESC) AS rn,
           SUM(total)  OVER (PARTITION BY user_id)                      AS user_total,
           LAG(total)  OVER (PARTITION BY user_id ORDER BY created_at)  AS prev_total
      FROM recent
)
SELECT * FROM ranked WHERE rn = 1;
```

Window functions: `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `LAG`/`LEAD`, `FIRST_VALUE`/`LAST_VALUE`, running aggregates, frame clauses (`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`).

## Transactions

```sql
BEGIN;
  INSERT INTO ...;
  UPDATE ...;
SAVEPOINT s1;
  -- might fail
ROLLBACK TO SAVEPOINT s1;
COMMIT;
```

Isolation: `READ UNCOMMITTED` → `READ COMMITTED` → `REPEATABLE READ` → `SERIALIZABLE`. Postgres defaults to RC, sets RR/SER as needed.

## Indexes

- **B-tree** (default) — equality + range + `ORDER BY` prefix
- **Hash** — equality only (Postgres has them too)
- **GIN / GiST / BRIN** (Postgres) — JSONB / geospatial / large append-only
- **Full-text** — `tsvector` in Postgres; `MATCH AGAINST` in MySQL
- **Partial** — `CREATE INDEX … WHERE …`
- **Covering** — `INCLUDE (cols)` for index-only scans
- **Expression** — `CREATE INDEX … ON tbl (LOWER(email))`

## EXPLAIN

```sql
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'a@b.com';
```

Read from bottom up. Look for `Seq Scan` on large tables, missing indexes, bad row estimates, nested loops with large outer.

## Dialect cheatsheet

| Feature | Postgres | MySQL | SQLite | MSSQL |
|---------|----------|-------|--------|-------|
| Auto-increment | `bigserial` / `IDENTITY` | `AUTO_INCREMENT` | `INTEGER PRIMARY KEY` | `IDENTITY` |
| Upsert | `ON CONFLICT DO UPDATE` | `ON DUPLICATE KEY UPDATE` | `ON CONFLICT DO UPDATE` | `MERGE` (careful) |
| JSON | `json` / `jsonb` | `JSON` | `JSON1` ext | `nvarchar(max)` + `JSON_VALUE` |
| Concat | `\|\|` | `CONCAT()` | `\|\|` | `+` |
| String fns | rich | rich | minimal | rich |
| Limit | `LIMIT n OFFSET m` | same | same | `OFFSET n ROWS FETCH NEXT m ROWS ONLY` |
| Boolean | `boolean` | `tinyint(1)` | `INTEGER` | `bit` |

## Schema / migration tools

| Tool | Use |
|------|-----|
| Flyway / Liquibase | Java-world; SQL or YAML migrations |
| Alembic | Python (SQLAlchemy) |
| Goose / dbmate / migrate | Go |
| Rails migrations | Ruby |
| Diesel / sea-orm / sqlx migrate | Rust |
| Prisma migrate | TS/JS |
| sqitch | DB-agnostic, no ORM |
| pgroll | Postgres zero-downtime migrations |

## Common gotchas

- **`NULL` is not equal to anything** (including itself). Use `IS NULL` / `IS DISTINCT FROM`.
- **`COUNT(col)` skips NULLs**; `COUNT(*)` doesn't.
- **`GROUP BY`** all non-aggregate columns (or use `DISTINCT ON` in Postgres).
- **Index doesn't help** if you wrap the column in a function — `WHERE LOWER(email) = ...` needs a functional index.
- **`OR` in WHERE** can defeat indexes — rewrite to `UNION` if profiles show it.
- **Implicit cast** — `WHERE id = '1'` may scan if `id` is int; types matter.
- **Cartesian explosion** — missing `JOIN` predicate.
- **`SELECT *`** in production code is fragile to schema changes.

## Cross-references
- DB drivers per language — see each language file
- ML feature stores / data warehousing → [15_AI_ML/topics](../../15_AI_ML/topics/INDEX.md)
