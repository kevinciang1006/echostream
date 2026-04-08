# EchoStream

A production-grade media streaming platform demo built with Next.js 15, Node.js, HLS.js, and AWS.

## Live Demo

- **Frontend:** https://[amplify-url]
- **API:** https://[apprunner-url]/api/health

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Client Browser                    │
└──────────────┬──────────────────┬───────────────────┘
               │                  │
               ▼                  ▼
┌──────────────────┐   ┌──────────────────────────┐
│  AWS Amplify     │   │  AWS App Runner          │
│  (Next.js SSR)   │   │  (Node.js/Express API)   │
└──────────────────┘   └──────────────────────────┘
                                  │
               ┌──────────────────┘
               ▼
┌──────────────────────────────────────────┐
│         AWS CloudFront (CDN)             │
│  .m3u8 TTL: 30s / .ts TTL: 86400s       │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│         AWS S3 (echostream-media)        │
│  /media/episodes/{id}/index.m3u8        │
│  /media/episodes/{id}/segment*.ts       │
│  /thumbnails/{id}.jpg                   │
└──────────────────────────────────────────┘
```

---

## What is HLS Streaming?

HTTP Live Streaming (HLS) breaks video and audio into small `.ts` segments (~6 seconds each) described by a `.m3u8` manifest file. The player downloads the manifest, then fetches segments sequentially. **Adaptive Bitrate (ABR)** streaming means the `.m3u8` contains multiple quality variants — the player automatically switches between them based on available bandwidth. CloudFront as a CDN ensures segments are served from edge locations close to the viewer, minimising latency.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| HLS Streaming | HLS.js (custom player, adaptive bitrate) |
| Backend | Node.js, Express, TypeScript |
| Media Storage | AWS S3 |
| CDN | AWS CloudFront |
| API Hosting | AWS App Runner |
| Frontend Hosting | AWS Amplify |
| CI/CD | GitHub Actions |
| Containers | Docker |
| Testing | Jest + React Testing Library (frontend), Jest + Supertest (API) |

---

## Features

- **Custom HLS player** — built from scratch with hls.js, no third-party player UI
  - Play/Pause, seek, volume, mute
  - Playback speed (0.75×–2×)
  - Quality selector (Auto + manual ABR levels)
  - Fullscreen support (video episodes)
  - Keyboard shortcuts (Space, Arrow keys, M, F)
  - Loading skeleton + error state with retry
  - Safari native HLS fallback
- **Home page** — ISR (60s revalidation), episode grid with filter tabs and client-side search
- **Episode detail** — SSR, JSON-LD structured data for SEO
- **About page** — Architecture diagram, tech stack badges

---

## Local Development

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/echostream.git
cd echostream

# 2. Start the API
cd api
npm install
npm run dev          # http://localhost:4000

# 3. Start the frontend (new terminal)
cd frontend
npm install
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000
npm run dev          # http://localhost:3000
```

---

## Environment Variables

### Frontend (`frontend/.env.local`)

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | API base URL | `http://localhost:4000` |

### API

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `4000` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:3000` |
| `NODE_ENV` | Environment | `development` |

---

## Running Tests

```bash
# API tests
cd api && npm test

# Frontend tests
cd frontend && npm test
```

---

## AWS Setup

See [infra/AWS_SETUP.md](./infra/AWS_SETUP.md) for the complete infrastructure provisioning guide.

---

## GitHub Secrets Required

| Secret | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM deploy user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM deploy user secret key |
| `AWS_REGION` | AWS region (e.g. `ap-southeast-1`) |
| `ECR_REPOSITORY` | ECR repository name (`echostream-api`) |
| `APP_RUNNER_ROLE_ARN` | App Runner ECR access role ARN |
| `AMPLIFY_APP_ID` | Amplify app ID |
| `API_URL` | App Runner public service URL |

---

## CI/CD

- **API:** Push to `main` with changes in `api/` → Docker build → ECR push → App Runner deploy
- **Frontend:** Push to `main` with changes in `frontend/` → lint + test + build → Amplify deploy

---

## API Reference

```
GET /api/health              → { status: 'ok', timestamp: '...' }
GET /api/episodes            → paginated episode list (?page=1&limit=12)
GET /api/episodes/:slug      → single episode detail
```
