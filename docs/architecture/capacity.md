# Capacity plan: 2,500 users

The goal is to build for 2,500 registered users now, and keep the path to the system design's long-term target (1 million learners) open without a rewrite.

## Assumptions

| | Number | Notes |
|---|---|---|
| Learners | 2,000 | No auth accounts: they use a device an adult opened for them |
| Guardians | 400 | Auth accounts |
| Teachers and specialists | 100 | Auth accounts |
| Adults who sign in each month | about 500 | Well under every plan's limit (Supabase Free: 50,000) |
| Busiest hour (school mornings) | 30% of learners, about 600 sessions | |
| Sync calls per session | 3 to 5 (open, end of lesson, signal back) | 2 to 10 KB each (section 9) |

**Peak load: about 3,000 sync calls an hour, or 1 a second.** One small Postgres instance handles hundreds a second. Capacity isn't the risk at this size. Correct access rules and reliable sync are.

## Data growth

| Table | Rows a year | Size a year (with indexes) |
|---|---|---|
| attempts | about 4.8 million | about 1.5 GB |
| messages, reads | about 50,000 | under 50 MB |
| health: medicines, doses, log | about 150,000 | under 50 MB |
| audit_log | about 200,000 | under 100 MB |

The attempts figure assumes 2,000 learners, 3 sessions a week, 20 answers a session and 40 school weeks. `attempts` is partitioned by month. `ensure_attempt_partitions()` creates them 12 months ahead and should run monthly (pg_cron on Supabase).

## Plan and triggers

| When | Do | Cost |
|---|---|---|
| Development and the test-data pilot | Supabase Free, EU (Frankfurt) | $0 |
| **Before any real learner data** (the legal gate in section 19) | Supabase Pro: 8 GB database, daily backups, no pausing | about US$25 a month |
| Database over 6 GB, or sync slower than 300 ms at p95 | A bigger compute add-on | from about US$10 a month |
| Backups needed to the minute | Point-in-time recovery add-on | extra |
| Email codes | Custom SMTP: Supabase's built-in sender only sends a few emails an hour | about $0 to $20 a month |

## Already built in for scale

- **Indexes.** Every foreign key, every "changed since" column used by sync, and every per-learner time column used on screens is indexed.
- **Monthly partitions** for attempts, the only large table.
- **Batched sync** of up to 200 changes per call, applied once each. Retries are safe.
- **No direct database connections from devices.** Everything goes through the HTTP API, which pools connections on the server.
- **A small download for low-end phones.** The main bundle is about 87 KB gzipped. CI fails a build that goes over 150 KB.

## Before going much past 2,500

- **Row-level security cost.** The access checks are `security definer` functions that look up primary keys, which is fine at this size. Past roughly 50,000 learners:
  - cache them per statement, with the `(select auth.uid())` pattern
  - or denormalise a `visible_to` array
- **Sync pull.** It returns every changed row someone can see. At large scale, page it by cursor and limit each response.
- **Load test.** Run a load test of `sync_push` and `sync_pull` against a Pro project with test data. That's 2,500 users' worth of data, at 10 times the peak above. Do it before the first pilot school.
