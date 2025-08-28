# G.M.B Travels Kashmir — Deployment Guide (Backend + Frontend)

This guide explains exactly **where** and **how** to deploy your stack with zero guesswork. It covers two production-grade paths:

- **Option A (Managed, fast):** Render/Railway (backend) + MongoDB Atlas (DB) + Vercel/GitHub Pages (frontend)
- **Option B (Self-hosted):** Docker on an Ubuntu VM (AWS EC2/Hetzner) with Nginx + Let's Encrypt

> You can use either path. The steps are explicit and copy‑pasteable.

---

## 1) Prerequisites

- GitHub repository containing **backend (FastAPI)** and **frontend (React/Vite)** projects
- Custom domain (optional but recommended); if using GitHub Pages, a `CNAME` file should contain your domain
- Production secrets (create these **before** deployment):
  - `SECRET_KEY` (strong random string)
  - `JWT_ALGORITHM` = `HS256`
  - `JWT_EXPIRES_IN` (e.g., `86400` seconds)
  - `ADMIN_USERNAME` / `ADMIN_PASSWORD` (rotate from defaults)
  - `MONGODB_URI` (MongoDB Atlas connection string)
  - `ALLOWED_ORIGINS` (frontend origins, comma‑separated, e.g., `https://yourdomain.com,https://yourpreview.vercel.app`)

Create `.env` files using the included `.env.example` as a template.

---

## 2) Backend (FastAPI) — Option A (Render/Railway + MongoDB Atlas)

### A.1 Create MongoDB Atlas
1. Create a **free Shared Cluster** in MongoDB Atlas.
2. Add a **database user** and note the connection URI.
3. Network Access → allow your host’s IP (or 0.0.0.0/0 if using trusted platform egress).

### A.2 Prepare the backend for deploy
1. Ensure you have a `Dockerfile` (we’ve included an example) or a `requirements.txt` with `uvicorn[standard]`, `fastapi`, `pydantic`, `python-jose`, `passlib[bcrypt]`, and your DB driver (e.g., `motor` for MongoDB).
2. Confirm your app entry: `server:app` (update if your file/module is different).
3. Add CORS to allow your frontend domains.

### A.3 Deploy on Render (similar on Railway)
1. Create a new **Web Service** → connect your repo.
2. **Environment**: Docker (or `Python` runtime with `start command: uvicorn server:app --host 0.0.0.0 --port 8000`).
3. **Env Vars** (Render Dashboard → Environment):
   - `SECRET_KEY`, `JWT_ALGORITHM`, `JWT_EXPIRES_IN`
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD`
   - `MONGODB_URI`
   - `ALLOWED_ORIGINS`
4. After the build, Render gives you a URL like `https://gmb-backend.onrender.com`.
5. Test: `curl https://gmb-backend.onrender.com/api/health` (if you implemented a health endpoint).

> **Smoke test:** run the included hardened script:
>
> ```bash
> pip install requests
> python backend_test_hardened.py --base-url https://gmb-backend.onrender.com/api --username $ADMIN_USERNAME --password $ADMIN_PASSWORD --json-out render_results.json
> ```

### A.4 Custom domain (optional)
- Add your domain in Render service settings; follow DNS instructions to point a CNAME or A record.
- TLS is auto-provisioned.
  
---

## 3) Frontend (React/Vite) — Option A

Pick one of the three hosts. Vercel is the easiest for React.

### A.1 Vercel
1. Import your frontend repo.
2. Build command: `npm run build` (or `yarn build`).
3. Output directory: `dist` (Vite) or `build` (CRA).
4. Add environment variable `VITE_API_BASE_URL=https://your-backend-domain/api`.
5. Deploy. Vercel gives you preview + production URLs.
6. Add your custom domain in Vercel → it sets up DNS & SSL.

### A.2 Netlify (alternative)
- Similar: configure **Build** = `npm run build`, **Publish** = `dist`.
- Add environment variables, deploy, and set domain.

### A.3 GitHub Pages (static)
1. Ensure your build outputs to `dist`.
2. Push build artifacts or configure Pages to deploy from a GitHub Action.
3. `CNAME` file should contain your custom domain (already in your repo).
4. Set DNS: create a CNAME from `www` to `<username>.github.io`. Use A records for apex if needed.
5. In the backend, add your GitHub Pages domain to `ALLOWED_ORIGINS`.

---

## 4) Option B — Self‑host (Docker + Nginx on Ubuntu)

### B.1 Provision a VM
- Ubuntu 22.04 LTS (2 vCPU, 2–4GB RAM).
- SSH in and install Docker + Docker Compose.

### B.2 Compose file (example)
Create `docker-compose.yml` with two services: `backend` (your FastAPI app container) and `nginx` (reverse proxy). Point Nginx to backend’s internal port 8000.

### B.3 TLS
- Use `certbot` with Nginx or a companion container (e.g., `nginx-proxy` + `letsencrypt-nginx-proxy-companion`).

### B.4 Env
- Copy `.env` to the VM and `docker compose up -d`.

---

## 5) Post‑deploy checklist (do all of these)

- [ ] Rotate **admin** password (never `admin123` in prod)
- [ ] Set `SECRET_KEY` to a long random string
- [ ] Confirm CORS `ALLOWED_ORIGINS` contains **only** your prod domains
- [ ] Ensure HTTPS works end‑to‑end
- [ ] Create **read‑only** DB users where possible; least privilege
- [ ] Enable rate limiting and request size limits (esp. file uploads)
- [ ] Turn on logging/monitoring (e.g., platform logs + error tracker)
- [ ] Add robots.txt and sitemap.xml
- [ ] Backups enabled for MongoDB Atlas
- [ ] Run `backend_test_hardened.py` against production
- [ ] Set up CI/CD (see below)

---

## 6) CI/CD Snippets

### GitHub Action — run tests on push
```yaml
name: CI
on: [push, pull_request]
jobs:
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install requests
      - run: |
          python backend_test_hardened.py \
            --base-url "${{ secrets.GMB_BASE_URL }}" \
            --username "${{ secrets.GMB_ADMIN_USERNAME }}" \
            --password "${{ secrets.GMB_ADMIN_PASSWORD }}" \
            --json-out ci_results.json
      - name: Upload test artifact
        uses: actions/upload-artifact@v4
        with:
          name: api-test-results
          path: ci_results.json
```

### GitHub Action — Deploy frontend to Vercel (preview)
Use Vercel’s official GitHub App or CLI. With the app installed, deployments trigger automatically.

---

## 7) Security Hardening

- **Secrets:** Only via platform secret managers. Never commit them.
- **Headers:** Add `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, and a CSP on the frontend.
- **JWT:** Short expiry; refresh tokens if needed; `HS256` with strong key.
- **Uploads:** Enforce file type/size, scan if possible.
- **AuthZ:** Keep role‑based access checks on every admin route.
- **Monitoring:** Alert on 5xx spikes and auth failures.

---

## 8) Running the test suite

```bash
# Non-destructive
python backend_test_hardened.py \
  --base-url https://your-backend-domain/api \
  --username "$ADMIN_USERNAME" \
  --password "$ADMIN_PASSWORD"

# Destructive (creates/updates/deletes a vehicle)
python backend_test_hardened.py \
  --base-url https://your-backend-domain/api \
  --username "$ADMIN_USERNAME" \
  --password "$ADMIN_PASSWORD" \
  --destructive \
  --json-out prod_results.json
```
