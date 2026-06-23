# AutoTrack BR

> Sistema web de histórico veicular brasileiro, inspirado no CarVertical europeu.

![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.5-brightgreen?logo=springboot)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8-blue?logo=mysql)
![JWT](https://img.shields.io/badge/Auth-JWT-black?logo=jsonwebtokens)
![OpenAPI](https://img.shields.io/badge/Docs-OpenAPI_3-85EA2D?logo=swagger)

---

## Sobre o projeto

O AutoTrack BR permite rastrear o histórico completo de um veículo — acidentes, roubos, manutenções, multas, transferências de proprietário e leilões — tudo a partir da placa. Também consulta o valor de mercado via Tabela FIPE e exibe um gráfico de evolução da quilometragem por revisão.

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 19 + Axios |
| Backend | Spring Boot 3.3.5 · Java 21 |
| Banco de dados | MySQL 8 + Flyway (migrations V1–V5) |
| Segurança | Spring Security · JWT Stateless |
| Integração | Tabela FIPE (proxy com cache 12h) |
| Documentação | Swagger UI · OpenAPI 3 (Springdoc) |
| Maturidade REST | Richardson Level 2 (resources + HTTP verbs + status codes) |

---

## Funcionalidades

- Autenticação com JWT (registro e login)
- Busca de veículo por placa com histórico completo
- Cadastro de eventos: acidente, roubo, manutenção, leilão, multa, transferência
- Consulta de valor de mercado em tempo real via Tabela FIPE
- Upload e galeria de fotos do veículo
- Gráfico SVG de evolução do KM por revisao
- Filtro de eventos por tipo (ex: somente revisoes)
- Paginacao, filtros por status e ordenacao na listagem
- Interceptor de 401 com logout automatico

---

## Como rodar localmente

### Pre-requisitos

- Java 21
- Node.js 18+
- MySQL 8

### 1. Banco de dados

```sql
CREATE DATABASE autotrack_db;
```

### 2. Backend

```bash
cd backend

# Linux/macOS
export DB_USER=root
export DB_PASS=sua_senha
export JWT_SECRET=chave_secreta_com_minimo_32_caracteres

./mvnw spring-boot:run

# Windows (PowerShell)
$env:DB_USER="root"; $env:DB_PASS="sua_senha"; $env:JWT_SECRET="chave_secreta_com_minimo_32_caracteres"
.\mvnw.cmd spring-boot:run
```

API disponivel em: `http://localhost:8080`  
Swagger UI: `http://localhost:8080/swagger-ui.html`

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

App disponivel em: `http://localhost:3000`

---

## Variaveis de ambiente (backend)

| Variavel | Descricao | Obrigatoria |
|----------|-----------|-------------|
| `DB_USER` | Usuario do MySQL | Sim |
| `DB_PASS` | Senha do MySQL | Sim |
| `JWT_SECRET` | Chave de assinatura JWT (min. 32 chars) | Sim |

---

## Endpoints principais

| Metodo | Endpoint | Descricao | Auth |
|--------|----------|-----------|------|
| POST | `/api/v1/auth/register` | Cadastrar usuario | Nao |
| POST | `/api/v1/auth/login` | Autenticar | Nao |
| GET | `/api/v1/vehicles` | Listar veiculos | Sim |
| GET | `/api/v1/vehicles/plate/{plate}` | Buscar por placa | Sim |
| POST | `/api/v1/vehicles` | Cadastrar veiculo | Sim |
| PUT | `/api/v1/vehicles/{id}` | Atualizar veiculo | Sim |
| DELETE | `/api/v1/vehicles/{id}` | Excluir veiculo | Sim |
| GET | `/api/v1/vehicles/{id}/history` | Historico de eventos | Sim |
| POST | `/api/v1/vehicles/{id}/history` | Adicionar evento | Sim |
| POST | `/api/v1/vehicles/{id}/photos` | Upload de foto | Sim |
| GET | `/api/v1/fipe/marcas?tipo=1` | Marcas FIPE | Sim |
| GET | `/api/v1/fipe/modelos?marca=...` | Modelos FIPE | Sim |
| GET | `/api/v1/fipe/preco?...` | Preco de mercado | Sim |

Documentacao completa disponivel no Swagger UI apos rodar o backend.

---

## Estrutura do projeto

```
autotrack-br/
├── backend/
│   └── src/main/
│       ├── java/br/com/autotrack/backend/
│       │   ├── controller/        # AuthController, VehicleController, ...
│       │   ├── service/           # Regras de negocio
│       │   ├── repository/        # Spring Data JPA
│       │   ├── model/             # Entidades JPA
│       │   ├── dto/               # Request e Response DTOs
│       │   ├── config/            # SecurityConfig, JwtFilter, JwtService
│       │   └── exception/         # GlobalExceptionHandler
│       └── resources/
│           ├── application.yml
│           └── db/migration/      # V1__create_tables.sql ... V5__add_mileage.sql
└── frontend/
    └── src/
        ├── App.js                 # SPA principal
        ├── App.css
        ├── api.js                 # Axios + interceptors JWT
        ├── LandingPage.js
        └── components/
            ├── KmChart.js         # Grafico SVG de quilometragem
            ├── FipeSearch.js      # Consulta FIPE
            ├── PhotoLightbox.js   # Galeria de fotos
            └── Toast.js
```

---

## Migracoes do banco (Flyway)

| Versao | Descricao |
|--------|-----------|
| V1 | Criacao das tabelas principais (users, vehicles, vehicle_history) |
| V2 | Campo `notes` em vehicles |
| V3 | Tabela `vehicle_photos` |
| V4 | Campos FIPE (marca, modelo, ano, valor) em vehicles |
| V5 | Campo `mileage` em vehicle_history |

---

## Licenca

Projeto academico — uso educacional.
