# Proxigo API — Desktop Integration Reference

The desktop drone app (Tauri/React) calls `proxigo.us` REST endpoints to record map download usage and fetch account state. All endpoints use **Supabase JWTs** passed as Bearer tokens.

---

## Authentication

Every protected endpoint expects:

```
Authorization: Bearer <supabase_access_token>
```

The server calls `auth.getUser(token)` (passing the token explicitly — not relying on the cookie). This is implemented in `lib/supabase/bearer.ts → getUserFromRequest()`.

JWTs expire after **1 hour**. The desktop app handles this with two layers:
1. **Proactive refresh** — `App.tsx` schedules a `setTimeout` 5 minutes before `expires_at` that silently refreshes and saves the new token.
2. **Call-site refresh** — `proxigo.withSession()` checks expiry before each call and retries on 401.

---

## Endpoints

### `POST /api/usage` — Record a map download

Called immediately after a successful local tile download.

**Request**
```json
{
  "km2": 12.5,
  "module_serial": "MAC-AAAA-AAAA-AAAA",
  "session_id": "<region-uuid>",
  "location_label": "San Francisco, CA",
  "lat_min": 37.77, "lat_max": 37.79,
  "lon_min": -122.42, "lon_max": -122.40
}
```

| Field | Required | Notes |
|---|---|---|
| `km2` | yes | Must be `> 0` and `<= 50000` |
| `module_serial` | yes | Must be registered to the authenticated user and `status = "active"` |
| `session_id` | no | Used for deduplication / linking to a region |
| `location_label`, `lat_*`, `lon_*` | no | For display purposes |

**Response `200`**
```json
{ "ok": true, "total_km2_this_month": 14.35 }
```
`total_km2_this_month` is the user's personal monthly total AFTER this event — the desktop app uses this to immediately correct the displayed quota.

**Rate limit**: 60 requests / minute / IP.

---

### `GET /api/account` — Full account snapshot

**Response `200`**
```json
{
  "user_id": "...",
  "email": "user@example.com",
  "plan": "starter",
  "km2_used": 14.35,
  "km2_limit": 500,
  "km2_remaining": 485.65,
  "modules": [{ "serial": "MAC-AAAA-AAAA-AAAA", "nickname": null, "status": "active" }],
  "org": {
    "org_id": "...", "org_name": "Acme Corp",
    "org_km2_used": 14.35, "org_km2_limit": 2000, "org_km2_remaining": 1985.65,
    "my_km2_used": 14.35, "my_km2_allowance": null,
    "role": "admin", "member_count": 1
  }
}
```

The `org` field is `null` when the user is not a member of any org. When present, the desktop app shows **org pool** numbers (not personal) for quota display.

**Rate limit**: 30 requests / minute / IP.

---

### `GET /api/usage` — Personal usage summary (lightweight)

Used for quick usage checks without the full account payload.

**Response `200`**
```json
{ "plan": "starter", "km2_used": 14.35, "km2_limit": 500, "km2_remaining": 485.65 }
```

---

### `GET /api/org/maps` — List org map regions

Returns all `org_map_regions` rows for the caller's org, ordered newest first.

### `POST /api/org/maps` — Publish a local map to org

Body: `{ name, lat_min, lat_max, lon_min, lon_max, zoom, source?, location_label? }`

### `DELETE /api/org/maps` — Remove an org map

Body: `{ id }`. Restricted to the region's creator or an org admin.

### `PATCH /api/org` — Set member km² allowance (admin only)

Body: `{ user_id, km2_allowance: number | null }`

---

## Desktop app flow (`Dashboard.tsx → saveBorderCut`)

> **Note:** `src/pages/Maps.tsx` is dead code — it exports a `Maps` component that is never rendered. All download logic lives in `Dashboard.tsx`.

```
1. User draws bbox, clicks Download (saveBorderCut in Dashboard.tsx)
2. cmd.downloadMapRegion() → Tauri Rust → tiles saved to disk
3. proxigo.withSession(session, onRefresh, fn) called:
   a. if token within 60 s of expiry → refresh first
   b. call POST /api/usage
   c. if 401 → refresh + retry once
4. On success: setCloudAccount(confirmed) + background getAccount
5. On failure: roll back optimistic update + show error in Account tab
```

The `onRefresh` callback persists the new token to `profile.json` and updates the Zustand store so all subsequent calls use the fresh session.

---

## Usage state in the desktop store (Zustand)

| Field | Type | Description |
|---|---|---|
| `proxigoSession` | `ProxigoSession \| null` | Current JWT + metadata |
| `cloudAccount` | `CloudAccount \| null` | Latest account snapshot |
| `lastUsageEvent` | `UsageEvent \| null` | Result of last download POST — shown in Account tab |

`lastUsageEvent` is the key to immediate feedback: it is written by `saveBorderCut` in `Dashboard.tsx` right after the POST resolves (success or failure) and read by the Account panel which may be open on a different tab.

---

## Token storage

Tokens are stored in `%APPDATA%\DroneVisionNav\profile.json`:

```json
{
  "proxigo_access_token": "eyJ...",
  "proxigo_refresh_token": "ntrg7xs6rkec",
  "proxigo_token_expires_at": 1751234567890,
  "proxigo_user_id": "6a847bbd-...",
  "proxigo_email": "user@example.com",
  "proxigo_module_serial": "MAC-AAAA-AAAA-AAAA"
}
```

On startup, if the access token is expired, the app refreshes it automatically before restoring the session.
