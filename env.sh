#!/bin/sh

# Substitui variáveis de ambiente no arquivo JS compilado
echo "Substituindo variáveis de ambiente..."

# Caminho do arquivo principal
MAIN_JS=$(find /usr/share/nginx/html -name 'main*.js' | head -n 1)

if [ -z "$MAIN_JS" ]; then
  echo "Erro: arquivo main.js não encontrado!"
  exit 1
fi

echo "Arquivo encontrado: $MAIN_JS"

# Substitui as URLs
sed -i "s|http://localhost:8080|${KEYCLOAK_URL:-http://localhost:8080}|g" $MAIN_JS
sed -i "s|http://localhost:4200/api|${API_URL:-http://localhost:4200/api}|g" $MAIN_JS

echo "Variáveis substituídas com sucesso!"
echo "KEYCLOAK_URL: ${KEYCLOAK_URL}"
echo "API_URL: ${API_URL}"

# Inicia o Nginx
exec nginx -g 'daemon off;'
