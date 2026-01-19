# Coding Standards

## Environment & Secrets
- **No Hardcoding:** All API keys (OpenRouter) and DB URLs must be loaded via `.env` files.
- **Backend:** Use `pydantic-settings` for config management.

## Docker Standards
- **Multi-stage Builds:** Use multi-stage Dockerfiles to keep image sizes small.
- **Non-root Users:** Run processes as non-root users inside containers for security.
- **Volumes:** Database files must always be mapped to a volume.