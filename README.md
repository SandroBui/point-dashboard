# Points Dashboard

Next.js dashboard for managing point campaigns. Campaign data is fetched from an external API; authentication uses Google OAuth2 via Auth.js.

## Features

- List campaigns
- Add campaign (name, pool address)
- Deactivate (inactive) campaign
- Google OAuth2 sign-in

## Getting started

1. Copy environment variables:

```bash
cp .env.example .env.local
```

2. Fill in:

- `AUTH_SECRET` — generate with `openssl rand -base64 32`
- `AUTH_URL` — e.g. `http://localhost:3000`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from [Google Cloud Console](https://console.cloud.google.com/) OAuth credentials (authorized redirect URI: `http://localhost:3000/api/auth/callback/google`)
- `API_BASE_URL` — base URL of your campaigns API

3. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Agent skills

| Tool | Project path |
|------|----------------|
| Cursor | `.cursor/skills/ui-design/SKILL.md` |
| Claude Code | `.claude/skills/ui-design/SKILL.md` |

Invoke in Claude Code with `/ui-design`, or let Claude load it automatically when working on UI.

## API contract

The app expects these endpoints on `API_BASE_URL`:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/campaigns` | List campaigns |
| POST | `/campaigns` | Create campaign `{ name, pool_address }` |
| PATCH | `/campaigns/:id/inactive` | Mark campaign inactive |

Campaign shape:

```json
{
  "id": "string",
  "name": "string",
  "status": "active" | "inactive",
  "pool_address": "string"
}
```
