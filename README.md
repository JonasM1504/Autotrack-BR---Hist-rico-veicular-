# 🚗 AutoTrack BR

Sistema web de histórico veicular brasileiro, inspirado no CarVertical europeu.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 (Node.js) |
| Backend | Spring Boot 3.3.5 · Java 21 |
| Banco de dados | MySQL 8 + Flyway |
| Segurança | Spring Security · JWT Stateless |
| Integração | Tabela FIPE (proxy) |
| Documentação | Swagger UI · OpenAPI 3 |

## Funcionalidades

- Busca de veículo por placa com histórico completo
- Cadastro de eventos: acidente, roubo, manutenção, leilão, multa, transferência
- Consulta de preço de mercado via Tabela FIPE
- Upload e galeria de fotos do veículo
- Gráfico de evolução do KM por revisão
- Paginação, filtros e ordenação na listagem
- Autenticação com JWT

## Como rodar localmente

### Pré-requisitos
- Java 21
- Node.js 18+
- MySQL 8

### Backend

```bash
cd backend

# Crie o banco de dados
mysql -u root -p -e "CREATE DATABASE autotrack_db;"

# Configure as variáveis de ambiente
export DB_USER=root
export DB_PASS=sua_senha
export JWT_SECRET=uma_chave_secreta_longa

# Rode a aplicação (as migrations do Flyway são aplicadas automaticamente)
./mvnw spring-boot:run
```

A API estará disponível em `http://localhost:8080`  
Swagger UI: `http://localhost:8080/swagger-ui.html`

### Frontend

```bash
cd frontend
npm install
npm start
```

O app estará disponível em `http://localhost:3000`

## Variáveis de ambiente (backend)

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `DB_USER` | Usuário do MySQL | `root` |
| `DB_PASS` | Senha do MySQL | — |
| `JWT_SECRET` | Chave de assinatura JWT (mín. 32 chars) | — |

## Estrutura do projeto

```
autotrack-br/
├── backend/          # Spring Boot API
│   └── src/main/
│       ├── java/     # Controllers, Services, Repositories, Models
│       └── resources/
│           ├── application.yml
│           └── db/migration/   # Flyway V1–V5
└── frontend/         # React SPA
    └── src/
        ├── App.js
        ├── api.js
        └── components/
```

## Endpoints principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/auth/register` | Cadastrar usuário |
| POST | `/api/v1/auth/login` | Autenticar |
| GET | `/api/v1/vehicles` | Listar veículos |
| GET | `/api/v1/vehicles/plate/{plate}` | Buscar por placa |
| POST | `/api/v1/vehicles` | Cadastrar veículo |
| PUT | `/api/v1/vehicles/{id}` | Atualizar veículo |
| DELETE | `/api/v1/vehicles/{id}` | Excluir veículo |
| GET | `/api/v1/fipe/marcas?tipo=1` | Marcas FIPE |
| GET | `/api/v1/fipe/preco?...` | Preço FIPE |
