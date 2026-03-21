# findmystation

> Crowdsourced platform helping Kenyan voters locate IEBC constituency registration offices. Citizens contribute and validate GPS coordinates for all 290 constituencies, turning text-based landmark descriptions into navigable map points — verified by community consensus.

**Live URL:** [findmystation.or.ke](https://findmystation.or.ke)
**Repository:** [github.com/your-username/findmystation](https://github.com/your-username/findmystation)

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Solution Overview](#solution-overview)
3. [Tech Stack](#tech-stack)
4. [System Architecture](#system-architecture)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [SEO Architecture](#seo-architecture)
8. [Crowdsourcing & Validation Logic](#crowdsourcing--validation-logic)
9. [Identity System](#identity-system)
10. [Navigation Handoff](#navigation-handoff)
11. [Rate Limiting & Abuse Prevention](#rate-limiting--abuse-prevention)
12. [Geo-Validation Rules](#geo-validation-rules)
13. [Data Minimization Strategy](#data-minimization-strategy)
14. [Mobile-First Design Principles](#mobile-first-design-principles)
15. [Project Structure](#project-structure)
16. [Environment Variables](#environment-variables)
17. [Local Development Setup](#local-development-setup)
18. [Deployment](#deployment)
19. [Seed Data](#seed-data)
20. [Phase 1 Scope](#phase-1-scope)
21. [Phase 2 Roadmap](#phase-2-roadmap)
22. [Cost Breakdown](#cost-breakdown)
23. [Contributing](#contributing)
24. [License](#license)

---

## Problem Statement

Kenya's Independent Electoral and Boundaries Commission (IEBC) operates 290 constituency registration offices across all 47 counties. The only publicly available directory describes these offices using text-based landmark descriptions — for example, "Behind Equity Bank, 200 metres" or "DCC Compound, next to Chief's Office."

There are no GPS coordinates. No interactive map. No way for a young, digitally-native voter to simply tap a button and get directions. The government is not actively mobilizing for voter registration, and the existing PDF directory is inaccessible to the majority of potential voters who rely on smartphones as their primary internet device.

The result: a significant barrier to voter registration, disproportionately affecting young voters who expect digital-first solutions.

---

## Solution Overview

**findmystation** is a mobile-first web application that:

1. **Presents** all 290 IEBC constituency office records in a clean, searchable, SEO-optimized format — each constituency has its own indexable page.
2. **Crowdsources** the missing GPS coordinates from citizens who physically know where these offices are — a user drops a pin on a map to suggest a location.
3. **Validates** suggested locations through community consensus — a location becomes "verified" once 7 independent contributors confirm it (place pins within a 100-metre radius).
4. **Enables navigation** by generating deep links to Google Maps, Waze, Uber, and Apple Maps — the user taps "Navigate" and their preferred app opens with directions.

The platform transforms a static PDF into a living, crowd-verified, navigable directory of voter registration stations.

---

## Tech Stack

| Layer | Technology | Cost | Rationale |
|---|---|---|---|
| **Domain** | `findmystation.or.ke` | ~KES 999/year | `.or.ke` signals civic/non-profit purpose; local SEO advantage for Kenyan searches |
| **Framework** | Next.js (React) | Free | Server-side rendering for SEO; API routes eliminate need for a separate backend |
| **Hosting** | Vercel (free tier) | Free | Auto-scaling, global CDN, custom domain support with free SSL, edge middleware for rate limiting |
| **Database** | Supabase (free tier) | Free | PostgreSQL with PostGIS for geospatial queries, built-in auth, Row Level Security, realtime subscriptions |
| **Maps (display)** | Leaflet + OpenStreetMap | Free | No API key, no usage limits, no signup, mobile-friendly, lightweight |
| **Maps (navigation)** | Deep links | Free | Hands off to Google Maps, Waze, Uber, Apple Maps — no routing API needed |
| **Geocoding** | Nominatim (OpenStreetMap) | Free | Address/place search for the map interface |

**Total monthly infrastructure cost: KES 0**
**Total annual cost: ~KES 999** (domain registration only)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Browser)                     │
│                                                               │
│  ┌─────────────┐ ┌─────────────┐ ┌──────────────┐ ┌────────┐│
│  │  Next.js SSR │ │ Leaflet Map │ │Contribution  │ │Nav     ││
│  │  SEO pages   │ │ OSM tiles   │ │UI (pin drop) │ │Handoff ││
│  └─────────────┘ └─────────────┘ └──────────────┘ └────────┘│
└──────────────────────────┬──────────────────────────────────┘
                           │ JSON (minimal payloads)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              API LAYER (Next.js API Routes on Vercel)         │
│                                                               │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────┐ │
│  │GET /constituencies│ │GET /station/:slug│ │POST /contribute│
│  │Paginated, filtered│ │Single + pins     │ │Submit GPS pin │ │
│  └──────────────────┘ └──────────────────┘ └──────────────┘ │
│                                                               │
│  ┌────────────┐ ┌──────────────┐ ┌──────────┐ ┌───────────┐ │
│  │Rate Limiter│ │Geo-Validation│ │Clustering│ │Cache Layer│ │
│  │Per device  │ │Bounds check  │ │100m radius│ │Vercel Edge│ │
│  └────────────┘ └──────────────┘ └──────────┘ └───────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │ Supabase JS Client
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              DATA LAYER (Supabase Free Tier)                  │
│                                                               │
│  ┌───────────┐ ┌────────────┐ ┌──────────┐ ┌─────────────┐ │
│  │PostgreSQL │ │Row Level   │ │Realtime  │ │Anonymous    │ │
│  │+ PostGIS  │ │Security    │ │Subscript.│ │Auth (IDs)   │ │
│  └───────────┘ └────────────┘ └──────────┘ └─────────────┘ │
│                                                               │
│  Tables: counties → constituencies → contributions            │
│          → contributor_identities → flags                     │
└──────────────────────────┬──────────────────────────────────┘
                           │ Deep link URLs
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES (All Free)                      │
│                                                               │
│  OSM Tiles │ Google Maps │ Waze │ Uber │ Apple Maps          │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **User searches** for their constituency → Next.js SSR page loads with pre-rendered data (fast, SEO-indexed).
2. **Map renders** using Leaflet + OpenStreetMap tiles — zero API cost.
3. **If coordinates are verified** → user sees a pin on the map with a "Navigate" button → deep link opens their preferred app.
4. **If coordinates are unverified** → user sees the text description + a prompt: "Know where this office is? Help others find it."
5. **Contributor drops a pin** → API validates (rate limit → geo-bounds → clustering) → stored in Supabase.
6. **When 7 contributors agree** (pins within 100m) → location becomes verified → centroid is the official point.

---

## Database Schema

### Tables

#### `counties`

Stores Kenya's 47 counties as the top-level grouping.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique identifier |
| `name` | `text` | NOT NULL, UNIQUE | County name (e.g., "Nairobi") |
| `slug` | `text` | NOT NULL, UNIQUE | URL-safe name (e.g., "nairobi") |
| `constituency_count` | `int` | NOT NULL, default 0 | Number of constituencies in this county |
| `created_at` | `timestamptz` | default `now()` | Record creation timestamp |

#### `constituencies`

Stores all 290 IEBC constituency registration offices.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique identifier |
| `county_id` | `uuid` | FK → counties.id, NOT NULL | Parent county |
| `name` | `text` | NOT NULL | Constituency name (e.g., "Starehe") |
| `slug` | `text` | NOT NULL, UNIQUE | URL-safe name (e.g., "starehe") |
| `office_location` | `text` | | Description from IEBC directory |
| `landmark` | `text` | | Nearest conspicuous landmark |
| `distance_to_office` | `text` | | Estimated distance from landmark |
| `verified_lat` | `decimal(10,7)` | | Verified latitude (set after 7 confirmations) |
| `verified_lng` | `decimal(10,7)` | | Verified longitude (set after 7 confirmations) |
| `verification_status` | `text` | default 'unverified' | One of: `unverified`, `pending`, `verified`, `flagged` |
| `confirmation_count` | `int` | default 0 | Number of unique confirmations on the leading cluster |
| `verified_at` | `timestamptz` | | Timestamp when verification threshold was reached |
| `created_at` | `timestamptz` | default `now()` | Record creation timestamp |
| `updated_at` | `timestamptz` | default `now()` | Last update timestamp |

**Indexes:**
- `idx_constituencies_county_id` on `county_id`
- `idx_constituencies_slug` on `slug` (UNIQUE)
- `idx_constituencies_status` on `verification_status`
- `idx_constituencies_search` GIN index on `name, office_location` for full-text search

#### `contributions`

Stores every GPS pin submission from contributors.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique identifier |
| `constituency_id` | `uuid` | FK → constituencies.id, NOT NULL | Target constituency |
| `contributor_id` | `uuid` | FK → contributor_identities.id, NOT NULL | Who submitted this |
| `lat` | `decimal(10,7)` | NOT NULL | Submitted latitude |
| `lng` | `decimal(10,7)` | NOT NULL | Submitted longitude |
| `cluster_id` | `uuid` | | Group ID for pins within 100m radius |
| `device_fingerprint` | `text` | NOT NULL | Hashed browser fingerprint |
| `ip_hash` | `text` | NOT NULL | Hashed IP address (not raw IP) |
| `is_confirmation` | `boolean` | default false | True if this confirms an existing cluster |
| `created_at` | `timestamptz` | default `now()` | Submission timestamp |

**Indexes:**
- `idx_contributions_constituency` on `constituency_id`
- `idx_contributions_cluster` on `cluster_id`
- `idx_contributions_device_constituency` UNIQUE on `(device_fingerprint, constituency_id)` — one contribution per device per constituency
- `idx_contributions_geo` GIST index on `ST_SetSRID(ST_MakePoint(lng, lat), 4326)` for spatial queries

#### `contributor_identities`

Stores display information for contributors.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique identifier |
| `device_fingerprint` | `text` | NOT NULL, UNIQUE | Links to device |
| `display_name` | `text` | NOT NULL | Shown publicly (real name, nickname, or generated) |
| `identity_type` | `text` | NOT NULL | One of: `named`, `nicknamed`, `anonymous` |
| `contribution_count` | `int` | default 0 | Total contributions made |
| `created_at` | `timestamptz` | default `now()` | First contribution timestamp |

#### `flags`

Stores reports of incorrect verified locations.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique identifier |
| `constituency_id` | `uuid` | FK → constituencies.id, NOT NULL | Flagged constituency |
| `device_fingerprint` | `text` | NOT NULL | Who flagged |
| `reason` | `text` | | Optional description of the issue |
| `created_at` | `timestamptz` | default `now()` | Flag timestamp |

**Indexes:**
- `idx_flags_constituency` on `constituency_id`
- `idx_flags_device_constituency` UNIQUE on `(device_fingerprint, constituency_id)` — one flag per device per constituency

### Relationships

```
counties (1) ──→ (many) constituencies
constituencies (1) ──→ (many) contributions
constituencies (1) ──→ (many) flags
contributor_identities (1) ──→ (many) contributions
```

### Row Level Security (RLS) Policies

| Table | Operation | Policy |
|---|---|---|
| `counties` | SELECT | Public (anyone can read) |
| `constituencies` | SELECT | Public (anyone can read) |
| `contributions` | SELECT | Public (anyone can read) |
| `contributions` | INSERT | Public (anyone can write, validated server-side) |
| `contributor_identities` | SELECT | Public (display names are public) |
| `contributor_identities` | INSERT | Public (created on first contribution) |
| `flags` | INSERT | Public (anyone can flag) |
| All tables | UPDATE/DELETE | Service role only (server-side admin) |

---

## API Reference

All API routes are implemented as Next.js API Routes, deployed as Vercel Serverless Functions.

Base URL: `https://findmystation.or.ke/api`

### `GET /api/constituencies`

Returns a paginated, filterable list of all constituencies. Designed for the browse/search view with minimal payload.

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `county` | string | — | Filter by county slug (e.g., `nairobi`) |
| `status` | string | — | Filter by verification status: `unverified`, `pending`, `verified`, `flagged` |
| `search` | string | — | Full-text search across constituency name and office location |
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Results per page (max 50) |

**Response (200 OK):**

```json
{
  "data": [
    {
      "slug": "starehe",
      "name": "Starehe",
      "county": "Nairobi",
      "county_slug": "nairobi",
      "status": "verified",
      "confirmations": 9,
      "has_coordinates": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 290,
    "pages": 15
  }
}
```

**Cache:** 60-second `stale-while-revalidate` at the Vercel edge.

---

### `GET /api/station/[slug]`

Returns the full detail for a single constituency, including all contributions and verification data.

**Response (200 OK):**

```json
{
  "id": "uuid",
  "name": "Starehe",
  "slug": "starehe",
  "county": {
    "name": "Nairobi",
    "slug": "nairobi"
  },
  "office_location": "Kenya Railways Block D",
  "landmark": "Opposite Technical University of Kenya",
  "distance_to_office": "200 Metres",
  "verification": {
    "status": "verified",
    "confirmed_lat": -1.2864,
    "confirmed_lng": 36.8232,
    "confirmation_count": 9,
    "verified_at": "2026-04-15T10:23:00Z"
  },
  "contributions": [
    {
      "id": "uuid",
      "lat": -1.2865,
      "lng": 36.8230,
      "contributor_name": "Radiant Cheetah",
      "identity_type": "anonymous",
      "created_at": "2026-04-10T08:15:00Z"
    }
  ],
  "navigation": {
    "google_maps": "https://www.google.com/maps/dir/?api=1&destination=-1.2864,36.8232",
    "waze": "https://waze.com/ul?ll=-1.2864,36.8232&navigate=yes",
    "apple_maps": "maps://maps.apple.com/?daddr=-1.2864,36.8232",
    "uber": "uber://?action=setPickup&dropoff[latitude]=-1.2864&dropoff[longitude]=36.8232",
    "geo": "geo:-1.2864,36.8232"
  }
}
```

**Response (404):** `{ "error": "Constituency not found" }`

**Cache:** 30-second `stale-while-revalidate`.

---

### `POST /api/contribute`

Submit a GPS pin for a constituency.

**Request Body:**

```json
{
  "constituency_id": "uuid",
  "lat": -1.2865,
  "lng": 36.8230,
  "display_name": "Courageous Flamingo",
  "identity_type": "anonymous",
  "device_fingerprint": "hashed_string"
}
```

**Validation Pipeline:**

1. **Rate limit check** — max 3 contributions per device per day.
2. **Duplicate check** — device has not already contributed to this constituency.
3. **Geo-bounds check** — coordinates fall within Kenya's bounding box.
4. **County proximity check** — coordinates are within reasonable distance of the constituency's county.
5. **Cluster assignment** — find existing cluster within 100m or create new one.
6. **Threshold check** — if cluster reaches 7 unique contributors, verify the constituency.

**Response (201 Created):**

```json
{
  "id": "uuid",
  "cluster_id": "uuid",
  "cluster_count": 4,
  "message": "Contribution recorded. 3 more confirmations needed for verification."
}
```

**Error Responses:**

| Code | Reason |
|---|---|
| 400 | Invalid coordinates or missing fields |
| 409 | Device has already contributed to this constituency |
| 429 | Rate limit exceeded |

---

### `POST /api/confirm/[contribution_id]`

Confirm an existing contribution (place agreement pin near an existing cluster).

**Request Body:**

```json
{
  "device_fingerprint": "hashed_string"
}
```

**Response (200 OK):**

```json
{
  "cluster_count": 6,
  "message": "Confirmation recorded. 1 more needed for verification."
}
```

---

### `POST /api/flag/[constituency_id]`

Flag a verified location as incorrect.

**Request Body:**

```json
{
  "device_fingerprint": "hashed_string",
  "reason": "Office moved to a new location"
}
```

**Response (200 OK):**

```json
{
  "flag_count": 3,
  "message": "Flag recorded. Location will be re-evaluated at 5 flags."
}
```

---

### `GET /api/stats`

Returns platform-wide progress statistics.

**Response (200 OK):**

```json
{
  "total_constituencies": 290,
  "verified": 142,
  "pending": 67,
  "unverified": 78,
  "flagged": 3,
  "total_contributions": 1847,
  "total_contributors": 623,
  "verification_percentage": 48.97
}
```

**Cache:** 5-minute `stale-while-revalidate`.

---

## SEO Architecture

Every constituency and county gets a server-rendered, indexable page.

### URL Structure

```
findmystation.or.ke/                          → Homepage (search + progress dashboard)
findmystation.or.ke/county/[slug]             → County page (list of constituencies)
findmystation.or.ke/station/[slug]            → Constituency detail page
findmystation.or.ke/about                     → About the project
findmystation.or.ke/contribute                → How to contribute guide
```

### Page-Level SEO

Each `/station/[slug]` page includes:

**Meta tags:**
```html
<title>IEBC Office Location - Starehe Constituency | findmystation</title>
<meta name="description" content="Find the IEBC voter registration office in Starehe constituency, Nairobi County. Located at Kenya Railways Block D, opposite Technical University of Kenya." />
<meta property="og:title" content="Find Starehe IEBC Office | findmystation" />
<meta property="og:description" content="Navigate to the voter registration office in Starehe constituency." />
<meta property="og:image" content="/og/station/starehe.png" />
```

**JSON-LD Structured Data:**
```json
{
  "@context": "https://schema.org",
  "@type": "GovernmentOffice",
  "name": "IEBC Constituency Office - Starehe",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Nairobi",
    "addressCountry": "KE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -1.2864,
    "longitude": 36.8232
  },
  "description": "Kenya Railways Block D, Opposite Technical University of Kenya"
}
```

### Sitemap

Auto-generated at `/sitemap.xml` with all 290 constituency pages, 47 county pages, and static pages. Updated on each build.

### Robots.txt

```
User-agent: *
Allow: /
Sitemap: https://findmystation.or.ke/sitemap.xml
```

---

## Crowdsourcing & Validation Logic

### Contribution Flow

```
User drops pin on map
         │
         ▼
   Rate limit OK?  ──── No ──→ 429: "Try again tomorrow"
         │ Yes
         ▼
   Already contributed
   to this constituency? ──── Yes ──→ 409: "Already submitted"
         │ No
         ▼
   Coordinates within
   Kenya bounds? ──── No ──→ 400: "Invalid location"
         │ Yes
         ▼
   Within reasonable
   distance of county? ──── No ──→ 400: "Location too far from constituency"
         │ Yes
         ▼
   Find existing clusters
   within 100m radius
         │
    ┌────┴────┐
    │         │
  Found    Not found
    │         │
    ▼         ▼
  Add to    Create new
  cluster   cluster (count=1)
    │
    ▼
  Cluster count ≥ 7?
    │
  ┌─┴──┐
  Yes   No
  │     │
  ▼     ▼
 VERIFY  Store as
 Location "pending"
```

### Cluster Algorithm

Using PostGIS `ST_DWithin` for spatial proximity:

```sql
SELECT cluster_id, ST_Centroid(ST_Collect(point)) as centroid, COUNT(*) as count
FROM contributions
WHERE constituency_id = :constituency_id
  AND ST_DWithin(
    ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
    100  -- 100 metres
  )
GROUP BY cluster_id
ORDER BY count DESC
LIMIT 1;
```

When a cluster reaches 7 unique contributors:
1. Calculate the centroid of all pins in the cluster.
2. Set `constituencies.verified_lat` and `verified_lng` to the centroid.
3. Update `verification_status` to `verified`.
4. Set `verified_at` to current timestamp.

### Re-Validation

If a verified location receives 5 flags:
1. Set `verification_status` to `flagged`.
2. Clear `verified_lat` and `verified_lng`.
3. Reset `confirmation_count` to 0.
4. Delete all existing contributions and clusters for that constituency.
5. Location is now open for fresh contributions.

---

## Identity System

Contributors choose one of three identity modes when submitting a pin:

### 1. Named
The contributor provides their real name (e.g., "James Mwangi"). Displayed as-is.

### 2. Nicknamed
The contributor provides a custom alias (e.g., "MapKing254"). Displayed as-is.

### 3. Anonymous (Auto-Generated)
The system generates a display name using the pattern: **[Positive Adjective] [East African Animal]**

**Adjective pool (50 words):**
```
Brave, Bright, Calm, Cheerful, Clever, Courageous, Daring, Devoted,
Eager, Earnest, Faithful, Fearless, Fierce, Gentle, Graceful,
Grateful, Happy, Hopeful, Humble, Inspired, Joyful, Keen, Kind,
Lively, Loyal, Mighty, Noble, Patient, Peaceful, Playful, Proud,
Radiant, Resilient, Serene, Sincere, Spirited, Steady, Strong,
Swift, Tender, Thankful, Thoughtful, Tireless, Trusting, Valiant,
Vibrant, Warm, Watchful, Wise, Zealous
```

**Animal pool (50 East African animals):**
```
Cheetah, Elephant, Flamingo, Gazelle, Giraffe, Gorilla, Hawk,
Hippo, Hornbill, Hyena, Impala, Jackal, Kingfisher, Kudu,
Leopard, Lion, Meerkat, Mongoose, Nyala, Oribi, Oryx, Ostrich,
Otter, Owl, Pangolin, Parrot, Pelican, Porcupine, Python,
Rhino, Sable, Serval, Sitatunga, Stork, Sunbird, Topi,
Tortoise, Turaco, Vervet, Vulture, Warthog, Weaver, Wildebeest,
Zebra, Bongo, Bushbuck, Crane, Dikdik, Eagle, Gerenuk
```

**Generation logic:** Random adjective + random animal, checked for uniqueness against existing `contributor_identities.display_name`. If collision, regenerate. This produces 2,500 possible combinations — more than sufficient for Phase 1 scale.

**Examples:** Courageous Flamingo, Radiant Cheetah, Joyful Hornbill, Wise Pangolin, Swift Gazelle.

---

## Navigation Handoff

Once a constituency has verified coordinates, the detail page shows a "Navigate" button that opens a bottom sheet with navigation options.

### Deep Link Templates

| App | URL Template | Platform |
|---|---|---|
| **Google Maps** | `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}` | Universal |
| **Waze** | `https://waze.com/ul?ll={lat},{lng}&navigate=yes` | Universal |
| **Apple Maps** | `maps://maps.apple.com/?daddr={lat},{lng}` | iOS only |
| **Uber** | `uber://?action=setPickup&dropoff[latitude]={lat}&dropoff[longitude]={lng}` | Requires Uber app |
| **Generic geo** | `geo:{lat},{lng}` | Android (opens default map app) |

### Fallback Behavior

If a deep link fails (app not installed), the Google Maps web URL serves as the universal fallback — it works in any browser on any device.

### Implementation

The navigation links are generated server-side and included in the `/api/station/[slug]` response. The frontend renders them as a list of tappable options with app icons. No routing API is called — the user's chosen app handles all directions.

---

## Rate Limiting & Abuse Prevention

### Rate Limits

| Action | Limit | Window | Enforcement |
|---|---|---|---|
| Browse/search (GET) | 60 requests | Per minute | Vercel Edge Middleware, IP-based |
| Submit GPS pin (POST) | 3 submissions | Per day | API route, device fingerprint |
| Confirm a pin | 1 per constituency | Per 24 hours | API route, fingerprint + constituency |
| Flag a location | 2 flags | Per day | API route, device fingerprint |

### Device Fingerprinting

A lightweight browser fingerprint hash is generated client-side using:
- Screen resolution
- Timezone
- Browser language
- User agent string
- Canvas fingerprint (optional)

These values are hashed (SHA-256) client-side before transmission. The hash is used to identify repeat devices without tracking personal data. This is not bulletproof — a determined attacker can rotate fingerprints — but it raises the bar significantly above IP-only detection.

### IP Hashing

Raw IP addresses are never stored. IPs are hashed server-side (SHA-256 with a salt) and stored as `ip_hash` in the contributions table. This allows duplicate detection without retaining personally identifiable information.

### Anti-Gaming Measures

1. **One contribution per device per constituency** — enforced via unique constraint on `(device_fingerprint, constituency_id)`.
2. **Geo-fencing** — pins are validated against the constituency's known county location.
3. **Time throttling** — a device can't submit more than 3 pins per day across all constituencies.
4. **Cluster integrity** — 7 unique device fingerprints required, not 7 submissions. Same device confirming from different browsers counts once.
5. **Flag-based re-validation** — community can self-correct bad data through the flagging mechanism.

---

## Geo-Validation Rules

Every submitted GPS coordinate passes through a validation pipeline before being stored:

### 1. Kenya Bounding Box

```
Latitude:  -5.0 to 5.5
Longitude: 33.5 to 42.0
```

Any coordinate outside this box is rejected immediately.

### 2. County Proximity Check

Each county has an approximate centre point and radius. A contribution for a constituency in Mombasa County must fall within a reasonable distance of Mombasa (not in Nairobi or Kisumu).

This uses a generous radius (50–100km depending on county size) to account for large rural constituencies while still catching obvious errors.

### 3. Duplicate Location Check

If a device has already contributed to a specific constituency, the submission is rejected with a 409 Conflict response.

---

## Data Minimization Strategy

Every API response returns only the fields needed for the requesting view. This reduces payload size, speeds up responses over 3G connections, and minimizes data exposure.

### List View (`GET /api/constituencies`)

Returns only 7 fields per record (~50 bytes each):

```json
{ "slug", "name", "county", "county_slug", "status", "confirmations", "has_coordinates" }
```

Does NOT return: `id`, `office_location`, `landmark`, `distance_to_office`, `verified_lat`, `verified_lng`, `contributions`, `created_at`, `updated_at`.

### Detail View (`GET /api/station/[slug]`)

Returns full record (~500 bytes) including office description, landmark, coordinates, contributions, and navigation links. Loaded only when the user taps into a specific constituency.

### Stats View (`GET /api/stats`)

Returns a single aggregate object (~100 bytes). No individual records.

### Response Compression

All API responses are served with `gzip` compression via Vercel's edge network. Typical list page payload: ~2KB compressed for 20 records.

---

## Mobile-First Design Principles

The primary audience accesses the internet through budget Android smartphones on 3G/4G connections. Every design decision prioritizes this reality.

### Performance Targets

| Metric | Target | Rationale |
|---|---|---|
| First Contentful Paint | < 1.5s on 3G | User sees content quickly |
| Time to Interactive | < 3s on 3G | User can search/tap within 3 seconds |
| Total Page Weight | < 200KB (initial) | Minimal data usage |
| Map Tiles | Loaded on demand | Only fetches visible area |
| JavaScript Bundle | < 100KB gzipped | Lean framework usage |

### Design Constraints

1. **Large tap targets** — minimum 48x48px for all interactive elements. Fingers, not cursors.
2. **High contrast** — WCAG AA minimum. Readable in direct sunlight.
3. **No heavy assets** — no hero images, no video, no web fonts beyond system stack. Every kilobyte counts.
4. **Offline-capable text** — constituency list and office descriptions are server-rendered and cached by the browser. Even if the network drops, the user retains the text data they've already loaded.
5. **Bottom-sheet navigation** — primary actions are within thumb reach. Navigation options appear as a bottom sheet, not a modal.
6. **Progressive map loading** — the map loads only when the user scrolls to it or taps "Show Map." The text description is always visible first.
7. **System font stack** — `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`. Zero font download cost.

---

## Project Structure

```
findmystation/
├── public/
│   ├── favicon.ico
│   ├── og/                        # Open Graph images
│   └── icons/                     # App icons, nav app logos
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout (metadata, fonts)
│   │   ├── page.tsx               # Homepage (search + stats)
│   │   ├── about/
│   │   │   └── page.tsx           # About page
│   │   ├── contribute/
│   │   │   └── page.tsx           # How to contribute guide
│   │   ├── county/
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # County detail (list of constituencies)
│   │   ├── station/
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # Constituency detail (map + contribute)
│   │   └── api/
│   │       ├── constituencies/
│   │       │   └── route.ts       # GET /api/constituencies
│   │       ├── station/
│   │       │   └── [slug]/
│   │       │       └── route.ts   # GET /api/station/:slug
│   │       ├── contribute/
│   │       │   └── route.ts       # POST /api/contribute
│   │       ├── confirm/
│   │       │   └── [id]/
│   │       │       └── route.ts   # POST /api/confirm/:id
│   │       ├── flag/
│   │       │   └── [id]/
│   │       │       └── route.ts   # POST /api/flag/:id
│   │       └── stats/
│   │           └── route.ts       # GET /api/stats
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   │   ├── SearchBar.tsx
│   │   │   ├── StationCard.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── NavigationSheet.tsx
│   │   │   └── ContributionModal.tsx
│   │   ├── map/
│   │   │   ├── MapView.tsx        # Leaflet map wrapper
│   │   │   ├── PinDrop.tsx        # Contribution pin placement
│   │   │   └── ClusterMarker.tsx  # Cluster visualization
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── MobileNav.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts          # Supabase browser client
│   │   │   ├── server.ts          # Supabase server client
│   │   │   └── types.ts           # Generated TypeScript types
│   │   ├── validation/
│   │   │   ├── geo.ts             # Geo-bounds validation
│   │   │   ├── rate-limit.ts      # Rate limiting logic
│   │   │   └── fingerprint.ts     # Device fingerprint handling
│   │   ├── clustering/
│   │   │   └── spatial.ts         # PostGIS clustering queries
│   │   ├── identity/
│   │   │   ├── generator.ts       # Anonymous name generator
│   │   │   ├── adjectives.ts      # Adjective word list
│   │   │   └── animals.ts         # East African animal list
│   │   ├── navigation/
│   │   │   └── deep-links.ts      # Navigation URL generators
│   │   └── utils/
│   │       ├── slugify.ts         # URL-safe string conversion
│   │       └── format.ts          # Display formatters
│   ├── hooks/
│   │   ├── useGeolocation.ts      # Browser geolocation API
│   │   ├── useFingerprint.ts      # Device fingerprint hook
│   │   └── useRealtime.ts         # Supabase realtime subscription
│   └── styles/
│       └── globals.css            # Global styles, CSS variables
├── supabase/
│   ├── migrations/
│   │   ├── 001_create_counties.sql
│   │   ├── 002_create_constituencies.sql
│   │   ├── 003_create_contributions.sql
│   │   ├── 004_create_contributor_identities.sql
│   │   ├── 005_create_flags.sql
│   │   ├── 006_enable_postgis.sql
│   │   ├── 007_create_indexes.sql
│   │   └── 008_setup_rls.sql
│   └── seed/
│       └── constituencies.sql     # All 290 records from IEBC PDF
├── scripts/
│   └── parse-pdf-data.ts          # Script to extract PDF → SQL seed
├── .env.local.example
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── README.md
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Rate Limiting
RATE_LIMIT_SALT=random-secret-for-ip-hashing

# App
NEXT_PUBLIC_APP_URL=https://findmystation.or.ke
NEXT_PUBLIC_APP_NAME=findmystation
```

**Security note:** `SUPABASE_SERVICE_ROLE_KEY` and `RATE_LIMIT_SALT` are server-only. Never prefix with `NEXT_PUBLIC_`. The `NEXT_PUBLIC_` variables are safe to expose in the browser — the anon key is designed for client-side use with RLS enforcement.

---

## Local Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase project (free tier)
- Git

### Steps

```bash
# Clone the repository
git clone https://github.com/your-username/findmystation.git
cd findmystation

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run database migrations
npx supabase db push

# Seed the database with 290 constituencies
npx supabase db seed

# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Useful Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server locally
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

---

## Deployment

### Vercel (Production)

1. Push your code to GitHub.
2. Import the repository in [Vercel Dashboard](https://vercel.com/new).
3. Add environment variables in the Vercel project settings.
4. Deploy — Vercel automatically detects Next.js and configures the build.
5. Add custom domain `findmystation.or.ke` in Vercel's domain settings.
6. Point your `.or.ke` domain's DNS to Vercel's nameservers.

### Automatic Deployments

Every push to `main` triggers a production deployment. Pull requests get preview deployments with unique URLs for testing.

### Vercel Free Tier Limits

| Resource | Limit |
|---|---|
| Bandwidth | 100 GB/month |
| Serverless Function Executions | 100,000/month |
| Build Minutes | 6,000/month |
| Edge Middleware Invocations | 1,000,000/month |

These limits are generous for a civic tool. If traffic exceeds free tier (a good problem to have), Vercel Pro is $20/month.

---

## Seed Data

The initial dataset of 290 constituencies is extracted from the IEBC's official PDF document: *"Physical Locations of IEBC Constituency Offices in Kenya."*

### Data Source

The PDF contains 21 pages of tabular data, organized by county, with the following fields per constituency:
- Constituency Name
- Office Location (text description)
- Most Conspicuous Landmark
- Estimated Distance to the Office

### Data Quality Notes

- **Complete data**: Most constituencies have all four fields populated.
- **Incomplete data**: Some counties (Garissa, Machakos, Kisumu, Homa Bay) are missing landmark and distance fields in the source PDF. These records are seeded with `NULL` values for the missing fields.
- **Inconsistent formatting**: Distance values vary between "metres," "meters," "m," "km," and "KMs." These are stored as-is (text field) since they are human-readable descriptions, not computed values.

### Extraction Process

The `scripts/parse-pdf-data.ts` script processes the PDF content into SQL INSERT statements. The resulting `supabase/seed/constituencies.sql` file contains all 290 records grouped by county.

---

## Phase 1 Scope

**In scope — what we build first:**

- [x] All 290 constituencies seeded from IEBC PDF
- [x] Mobile-first responsive UI with search and county filtering
- [x] Leaflet map view with OpenStreetMap tiles
- [x] Pin drop contribution flow
- [x] Anonymous identity generator (Adjective + East African Animal)
- [x] 7-person consensus validation with 100m clustering
- [x] Navigation deep links (Google Maps, Waze, Uber, Apple Maps)
- [x] Progress tracker ("142 of 290 stations verified")
- [x] SEO-optimized pages for each constituency and county
- [x] Rate limiting and geo-validation
- [x] Structured data (JSON-LD) for search engine rich results
- [x] Auto-generated sitemap

---

## Phase 2 Roadmap

**Planned enhancements for future releases:**

| Feature | Priority | Description |
|---|---|---|
| SMS verification | High | Lightweight identity verification for contributors via Safaricom M-PESA/SMS |
| Leaderboard | Medium | Top contributors per county — gamification to drive participation |
| Swahili toggle | Medium | Bilingual UI (English/Swahili) for broader accessibility |
| Share cards | Medium | "Help verify [Constituency X]" — shareable cards for WhatsApp/Twitter |
| Push notifications | Low | Notify users when a constituency near them needs verification |
| Admin dashboard | Low | For IEBC or civil society partners to monitor coverage and export data |
| Offline mode (PWA) | Low | Service worker caching for offline text data access |
| Photo verification | Low | Allow contributors to upload a photo of the office as additional proof |
| Accessibility audit | Medium | Full WCAG 2.1 AA compliance review |
| Analytics | Low | Privacy-respecting usage analytics (Plausible or Umami, self-hosted) |

---

## Cost Breakdown

### Phase 1 (Launch)

| Item | Monthly Cost | Annual Cost |
|---|---|---|
| Domain (`findmystation.or.ke`) | — | KES 999 |
| Hosting (Vercel free tier) | KES 0 | KES 0 |
| Database (Supabase free tier) | KES 0 | KES 0 |
| Maps (Leaflet + OSM) | KES 0 | KES 0 |
| Navigation (deep links) | KES 0 | KES 0 |
| SSL Certificate (via Vercel) | KES 0 | KES 0 |
| **Total** | **KES 0/month** | **KES 999/year** |

### Scale Trigger Points

| Metric | Free Tier Limit | Upgrade Cost |
|---|---|---|
| Monthly bandwidth | 100 GB (Vercel) | $20/mo for Vercel Pro |
| Database size | 500 MB (Supabase) | $25/mo for Supabase Pro |
| Monthly active users (auth) | 50,000 (Supabase) | $25/mo for Supabase Pro |

For context: 290 constituency records with full contributions data will use well under 100 MB of database storage. The platform would need hundreds of thousands of monthly users before hitting any paid tier.

---

## Contributing

This is a civic project. Contributions are welcome.

### How to Contribute (Code)

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add: description of change"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request against `main`.

### How to Contribute (Data)

Visit [findmystation.or.ke](https://findmystation.or.ke), find a constituency you know, and drop a pin on the map. That's it — you're helping fellow Kenyans find their voter registration station.

### Code Style

- TypeScript strict mode
- ESLint with Next.js recommended rules
- Prettier for formatting
- Conventional Commits for commit messages

---

## License

MIT License. This is a civic tool — use it, fork it, adapt it for your country.

---

*Built with purpose. Every verified pin is one less barrier between a Kenyan citizen and their right to vote.*
