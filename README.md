# Translator (Khaya / GhanaNLP)

Full-stack style project: a **Django REST Framework** backend that forwards translation requests to the [GhanaNLP / Khaya translation API](https://translation.ghananlp.org/), plus a **React (Vite)** frontend in `Frontend/`. The backend normalizes successful translations into a simple JSON shape: `{ "translated": "…" }`.

## Repository layout

| Path | Role |
|------|------|
| `Backend/` | Django 6 app: translate proxy, supported languages, OpenAPI/Swagger |
| `Frontend/` | React + Vite UI (see `Frontend/README.md`) |

## Backend overview

- **Stack:** Python 3.12+ (see `Backend/Pipfile` / host runtime), Django, Django REST Framework, `python-decouple`, `requests`, **drf-spectacular**, **WhiteNoise**, **django-cors-headers**, **Gunicorn** (production serve).
- **Configuration:** `python-decouple` reads the process environment plus `Backend/.env` when present (`AutoConfig` anchored to the Backend project folder).
- **Upstream:** Translation and language-list calls use your GhanaNLP API keys (`PRIMARY_API_KEY` / `SECONDARY_API_KEY`) in the `Ocp-Apim-Subscription-Key` header.

## Backend setup

### Prerequisites

- Python **3.12+**
- [Pipenv](https://pipenv.pypa.io/)

### Install and run

```bash
cd Backend
pipenv install
pipenv run python manage.py migrate
pipenv run python manage.py runserver
```

The API is served at `http://127.0.0.1:8000/` by default.

### Environment variables (`Backend/.env`)

Create `Backend/.env` with at least:

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Django secret key |
| `DEBUG` | `True` or `False` |
| `ALLOWED_HOSTS` | Comma-separated hosts, e.g. `localhost,127.0.0.1,*` |
| `API_URL` | Upstream translate endpoint URL |
| `API_SUPPORTED_LANGUAGES_URL` | Upstream languages endpoint URL |
| `PRIMARY_API_KEY` | First `Ocp-Apim-Subscription-Key` |
| `SECONDARY_API_KEY` | Fallback key if the primary returns 401/403/429 |

Never commit real keys; keep `.env` out of version control.

## HTTP API (summary)

Base path: **`/api/`**

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/translate/` | Body: `{ "in": "<text>", "lang": "<code>" }` → `{ "translated": "<text>" }` |
| `GET` | `/api/supported-languages/` | Returns `{ "languages": … }` from the upstream languages response |

Example `rest.http` snippets live in `Backend/rest.http`.

## Swagger & OpenAPI

Interactive docs are generated from the same DRF views and serializers used in code.

| URL | Purpose |
|-----|---------|
| [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/) | **Swagger UI** (try requests in the browser) |
| [http://127.0.0.1:8000/api/redoc/](http://127.0.0.1:8000/api/redoc/) | **ReDoc** (read-only reference) |
| [http://127.0.0.1:8000/api/schema/](http://127.0.0.1:8000/api/schema/) | Raw **OpenAPI 3** schema (`yaml`) |

Use **Swagger UI** for `POST /api/translate/`: set the request body to JSON with `in` and `lang`, then execute.

## Frontend

From `Frontend/`, follow `Frontend/README.md` (typically `npm install` and `npm run dev`). Copy `Frontend/.env.example` to `Frontend/.env` and set `VITE_API_BASE_URL` to your API origin (no trailing slash). For local dev you can leave it empty if you rely on the Vite `/api` proxy in `vite.config.js`.

## Deployment (separate backend + frontend)

Both apps can stay in this repo: create **two** deploys and set each provider’s **root directory** to `Backend/` or `Frontend/`.

### Backend (Django)

- **Dependencies:** `Backend/requirements.txt` (used by Pip, Render, etc.). Pipenv users can run `pipenv install` from `Backend/`; keep `Pipfile` in sync when you add packages.
- **Process:** [Gunicorn](https://gunicorn.org/) serves `translator_Project.wsgi` (see `Backend/Procfile`). The platform must set **`PORT`** (Render/Heroku do this automatically).
- **Build:** install deps, then `collectstatic` and `migrate`. Example (Linux):  
  `pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate --no-input`  
  `Backend/build.sh` does the same (use **`bash build.sh`** if you point a custom build command at it).
- **Python version:** `Backend/runtime.txt` is set for **3.12.x** (widely supported on free tiers). Adjust if your host only offers another minor version.
- **Environment variables:** Copy `Backend/.env.example` and set real values on the host (never commit `.env`). Important:
  - **`SECRET_KEY`**, **`DEBUG=False`**, **`ALLOWED_HOSTS`** (your API hostname).
  - **`USE_PROXY_SSL_HEADER=True`** on Render/Railway-style proxies.
  - **`CSRF_TRUSTED_ORIGINS`**: `https://your-api-host` (and admin URL if different).
  - **`CORS_ALLOWED_ORIGINS`**: your **frontend** URLs (comma-separated, with scheme), e.g. `https://yoursite.netlify.app`. With `DEBUG=True` and this unset, all origins are allowed (dev only).
  - **`DATABASE_URL`**: optional; if unset, the app uses SQLite (ok locally; on ephemeral servers prefer **Postgres** and paste the provider URL). Set **`DATABASE_SSL_REQUIRE=True`** if your DB requires TLS.
  - **`API_URL`**, **`API_SUPPORTED_LANGUAGES_URL`**, **`PRIMARY_API_KEY`**, **`SECONDARY_API_KEY`**.

Optional **Render** blueprint: `render.yaml` at the repo root (web service rooted at `Backend/`). Add a Postgres instance in the dashboard and wire `DATABASE_URL` if the template does not link it for you.

### Frontend (Vite / React)

- **Netlify:** `netlify.toml` at the repo root sets `base = "Frontend"` and SPA fallback to `index.html`.
- **Vercel:** In the project settings, set the root directory to **`Frontend/`** (the included `Frontend/vercel.json` matches Vite). Set **`VITE_API_BASE_URL`** in the Vercel environment to your **deployed API** origin.
- After deploy, ensure the backend **`CORS_ALLOWED_ORIGINS`** includes your frontend URL.

## License

Personal / educational project unless you add a formal license.
