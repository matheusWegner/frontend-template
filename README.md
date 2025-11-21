# Keycloak Social Starter — Frontend

SPA Angular moderna (v17) integrada ao Keycloak e à API REST protegida por JWT do diretório `backend/`.

## Stack & Arquitetura

- **Standalone components + lazy routes** (sem módulos).
- **Estrutura em camadas**:
	- `core/`: autenticação, interceptors e serviços globais.
	- `features/`: páginas isoladas (`auth/login-page`, `dashboard`).
	- `layouts/`: containers reutilizáveis (`main-layout`).
	- `shared/`: espaço reservado para componentes utilitários.
- **Keycloak** via `keycloak-js`, inicializado SSR-safe com `APP_INITIALIZER`.
- **Interceptor HTTP** adiciona o token Bearer em toda requisição `HttpClient`.

## Pré-requisitos

- Node.js 18+ (utilizamos 22.x durante o desenvolvimento).
- Docker + `docker compose` para subir Keycloak/Postgres/Backend (já definidos em `docker-compose.yml`).

## Como rodar tudo

```powershell
# 1) Suba infraestrutura (Postgres + Keycloak + API)
docker compose up -d --build

# 2) Instale dependências e rode o front
cd frontend
npm install
npm run start  # http://localhost:4200
```

> Para builds SSR/produção: `npm run build` gera artefatos em `dist/frontend` (browser + server bundles).

## Fluxo de autenticação

1. `APP_INITIALIZER` roda `KeycloakAuthService.init()` com `check-sso` (não bloqueia).
2. Rota `/auth/login` mostra CTA. Ao clicar, chamamos `kc.login()`.
3. Keycloak autentica (realm `app`, client `frontend-spa`) e redireciona de volta.
4. Guard `authGuard` protege as rotas internas; se não houver sessão, retorna `UrlTree` para `/auth/login` preservando `redirectUrl`.
5. `auth-token.interceptor` renova o token (PKCE + silent-check) e injeta `Authorization: Bearer ...` antes de chamar a API.

## Estrutura de pastas relevante

```
src/
├─ app/
│  ├─ core/
│  │  ├─ auth/
│  │  │  ├─ keycloak-auth.service.ts
│  │  │  └─ auth.guard.ts
│  │  ├─ interceptors/auth-token.interceptor.ts
│  │  └─ services/api-client.service.ts
│  ├─ features/
│  │  ├─ auth/login-page
│  │  └─ dashboard
│  └─ layouts/main-layout
├─ environments/
│  ├─ environment.ts
│  └─ environment.development.ts
└─ silent-check-sso.html
```

## Configuração do Keycloak

- Realm: `app`
- Client: `frontend-spa` (public, PKCE `S256`)
- Redirect URIs: `http://localhost:4200/*`
- Web Origins: `http://localhost:4200`

Os valores podem ser ajustados em `src/environments/*.ts`.

## Próximos passos sugeridos

- Adicionar testes unitários focando no `KeycloakAuthService` (mockando `keycloak-js`).
- Expandir `shared/` com componentes visuais reutilizáveis.
- Configurar GitHub Actions para rodar `npm run build` + testes a cada push.
