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

# Substitui as URLs hardcoded de produção (para permitir mudanças sem rebuild)
sed -i "s|https://k4q2xqmsnc.us-east-1.awsapprunner.com|${KEYCLOAK_URL}|g" $MAIN_JS
sed -i "s|https://fbf2vdjpf3.us-east-1.awsapprunner.com|${API_URL}|g" $MAIN_JS
sed -i "s|https://vsddwpmyga.us-west-2.awsapprunner.com|${APP_URL}|g" $MAIN_JS

echo "Variáveis substituídas com sucesso!"
echo "APP_URL: ${APP_URL}"
echo "KEYCLOAK_URL: ${KEYCLOAK_URL}"
echo "API_URL: ${API_URL}"

# Inicia o Nginx
exec nginx -g 'daemon off;'
