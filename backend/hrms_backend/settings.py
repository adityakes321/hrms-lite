from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "dev-secret-key-change-me")

DEBUG = os.environ.get("DJANGO_DEBUG", "true").lower() == "true"

def _split_csv_env(name: str) -> list[str]:
    value = os.environ.get(name, "").strip()
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


_allowed_hosts = _split_csv_env("DJANGO_ALLOWED_HOSTS")
if not _allowed_hosts and os.environ.get("RENDER_EXTERNAL_HOSTNAME"):
    _allowed_hosts = [os.environ["RENDER_EXTERNAL_HOSTNAME"]]

ALLOWED_HOSTS: list[str] = ["*"] if DEBUG else _allowed_hosts

INSTALLED_APPS = [
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "hrms",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
]

ROOT_URLCONF = "hrms_backend.urls"

TEMPLATES: list[dict] = []

WSGI_APPLICATION = "hrms_backend.wsgi.application"

DJANGO_DATABASE = os.environ.get("DJANGO_DATABASE", "sqlite").lower().strip()
if DJANGO_DATABASE == "mongodb":
    import django_mongodb_backend

    MONGODB_URI = os.environ["MONGODB_URI"]
    DATABASES = {"default": django_mongodb_backend.parse_uri(MONGODB_URI)}
    DEFAULT_AUTO_FIELD = "django_mongodb_backend.fields.ObjectIdAutoField"
    MIGRATION_MODULES = {"hrms": None}
else:
    SQLITE_PATH = os.environ.get("DJANGO_SQLITE_PATH")
    if SQLITE_PATH:
        os.makedirs(os.path.dirname(SQLITE_PATH), exist_ok=True)
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": SQLITE_PATH or (BASE_DIR / "db.sqlite3"),
        }
    }
    DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "UNAUTHENTICATED_USER": None,
}

CORS_ALLOWED_ORIGINS: list[str] = _split_csv_env("CORS_ALLOWED_ORIGINS")
CORS_ALLOW_ALL_ORIGINS = DEBUG and not CORS_ALLOWED_ORIGINS


