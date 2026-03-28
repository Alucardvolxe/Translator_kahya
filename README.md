# Translator (Khaya / GhanaNLP)

Full-stack style project: a **Django REST Framework** backend that forwards translation requests to the [GhanaNLP / Khaya translation API](https://translation.ghananlp.org/), plus a **React (Vite)** frontend in `Frontend/`. The backend normalizes successful translations into a simple JSON shape: `{ "translated": "…" }`.

## Repository layout

| Path | Role |
|------|------|
| `Backend/` | Django 6 app: translate proxy, supported languages, OpenAPI/Swagger |
| `Frontend/` | React + Vite UI (see `Frontend/README.md`) |

## Backend overview

- **Stack:** Python 3.13, Django, Django REST Framework, `python-decouple` for configuration, `requests` for upstream HTTP, **drf-spectacular** for OpenAPI 3 and Swagger UI.
- **Configuration:** Environment variables are read from `Backend/.env` (path is fixed relative to `manage.py`, so it works regardless of your shell’s current directory).
- **Upstream:** Translation and language-list calls use your GhanaNLP API keys (`PRIMARY_API_KEY` / `SECONDARY_API_KEY`) in the `Ocp-Apim-Subscription-Key` header.

## Backend setup

### Prerequisites

- Python **3.13**
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

From `Frontend/`, follow `Frontend/README.md` (typically `npm install` and `npm run dev`). Point the UI at the backend base URL (e.g. `http://127.0.0.1:8000`) according to your frontend API configuration.

## License

Personal / educational project unless you add a formal license.
