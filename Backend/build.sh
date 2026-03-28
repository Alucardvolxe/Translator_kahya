#!/usr/bin/env bash
# Build step for PaaS (e.g. Render). Ensure line endings are LF when committing.
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate --no-input
