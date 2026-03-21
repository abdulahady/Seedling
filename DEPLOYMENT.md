## SeedlingEducation Full App Deployment (Free Stack)

This project is configured for:

- Frontend static site on Render (`seedling-frontend`)
- Django backend web service on Render (`seedling-backend`)
- Supabase as the content/data layer
- Domain: `seedlingeducation.org`

### 1) Deploy on Render

1. In Render, create a new Blueprint from this GitHub repo:
   - `https://github.com/abdulahady/Seedling`
2. Render will read `render.yaml` and provision:
   - `seedling-backend`
   - `seedling-frontend`
3. In backend service env vars, set:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Redeploy backend after env vars are set.

### 2) Get Render Hostnames

After deploy:

- Frontend URL (example): `https://seedling-frontend.onrender.com`
- Backend URL (example): `https://seedling-backend.onrender.com`

### 3) Add custom domains in Render

- Attach `seedlingeducation.org` and `www.seedlingeducation.org` to frontend static site.
- Attach `api.seedlingeducation.org` to backend web service.

### 4) Configure Porkbun DNS

Create/Update DNS records:

- `A` record:
  - Host: `@`
  - Answer: Render apex IP shown by Render for your frontend custom domain setup
- `CNAME` record:
  - Host: `www`
  - Answer: frontend Render hostname (e.g. `seedling-frontend.onrender.com`)
- `CNAME` record:
  - Host: `api`
  - Answer: backend Render hostname (e.g. `seedling-backend.onrender.com`)

Note: Render may provide exact values for apex flattening; follow their domain panel instructions exactly.

### 5) Verify

- Frontend: `https://seedlingeducation.org`
- Backend health check example: `https://api.seedlingeducation.org/api/v3/pages?tag=transfer`

Expected: JSON response with `items`.
