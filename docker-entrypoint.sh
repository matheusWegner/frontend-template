#!/bin/sh

# Replace environment variables in runtime
envsubst '${API_URL} ${KEYCLOAK_URL} ${KEYCLOAK_REALM} ${KEYCLOAK_CLIENT_ID}' < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js

exec "$@"
