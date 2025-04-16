# 🏷️ Multitenant Product Catalog System

A microservices-based, multitenant product catalog system built with **NestJS**, **Next.js**, **PostgreSQL**, and **Docker**. It supports schema-based multi-tenancy, authentication, and product management, with a responsive frontend interface.

---

## 📦 Tech Stack

- **Frontend:** Next.js 15 (App Router, TypeScript, Tailwind CSS)
- **Backend:**
  - Auth Service: NestJS + JWT Auth
  - Product Service: NestJS + PostgreSQL (Multi-schema per tenant)
- **Database:** PostgreSQL (Multi-schema)
- **Message Broker:** RabbitMQ
- **Containerization:** Docker & Docker Compose
- **API Docs:** Swagger / Postman
- **Extras:** AsyncLocalStorage, SSR, secure cookie-based JWT auth

---

## 🧱 Architecture

- **Auth Service:** Handles user authentication and JWT issuance.
- **Product Service:** Manages product data per tenant, with dynamic schema resolution.
- **Frontend:** Provides a UI for product listing/creation with tenant-aware access.

---

## 🚀 Features

- ✅ JWT-based Authentication
- ✅ Multitenancy via PostgreSQL schemas
- ✅ Add / List Products per tenant
- ✅ Dockerized Setup
- ✅ Environment-based configuration
- ✅ Tenant Middleware using AsyncLocalStorage
- ✅ Tailwind-based UI
- ✅ SSR with Next.js App Router
- ✅ API documentation via Swagger or Postman

---

## 🛠️ Getting Started

### 📁 Clone the Repo

```bash
git clone https://github.com/your-username/multitenant-product-catalog.git
cd multitenant-product-catalog
```

🐳 Run via Docker
```bash
docker-compose up --build
Ensure ports 3000, 3001, 3002, 5432, and 15672 are free.
```

### 🛠️ Create a .env in each service folder:
auth-service/.env

```bash
    DATABASE_URL=your_url
    JWT_SECRET=your_secret
    FRONTEND_URL=http://localhost:3000
    PORT=3001
```
product-service/.env
```bash
    DATABASE_URL=your_url
    JWT_SECRET=your_secret
    FRONTEND_URL=http://localhost:3000
    PORT=3002
```

frontend/.env
```bash
    NEXT_PUBLIC_AUTH_API_URL=http://localhost:3001
    NEXT_PUBLIC_PRODUCT_API_URL=http://localhost:3002
    NEXT_PUBLIC_PRODUCT_DOCKER_API_URL=http://product-service:3002
```
### 🔐 Authentication Flow

Login using email/password via Auth Service.
Receive JWT stored in HTTP-only cookie.
Frontend includes token in all requests.
Backend uses TenantMiddleware to extract tenant from JWT and set schema context.

🌐 Frontend Features
Login & Logout
Product listing page
Product creation form
Sidebar, Header with dark/light mode
SSR for performance
Tenant-based access control

...--------------------------------------------------------...

💻 Run Locally (Without Docker)
Make sure PostgreSQL and RabbitMQ are installed and running locally before you proceed.

NOTE : if you are running without docker make sure to use the "NEXT_PUBLIC_PRODUCT_API_URL" instead of "NEXT_PUBLIC_PRODUCT_DOCKER_API_URL" on the page frontend\src\app\(protected)\products\page.tsx

1. 📦 Start PostgreSQL
    Ensure a local PostgreSQL instance is running on port 5432

    Use credentials:
    user: <YOUR_USER>
    password: <YOUR_PASS>
    database: <YOUR_DATBASE>

2. 🐰 Start RabbitMQ
    Run RabbitMQ locally or use Docker:

3. 🔑 Start Auth Service
```bash
    cd auth-service
    npm install
    npm run start:dev
```

4. 📦 Start Product Service
```bash
    cd product-service
    npm install
    npm run start:dev
```
5. 🌐 Start Frontend (Next.js)
```bash
    cd frontend
    npm install
    npm run dev
```    
    By default, frontend will run at: http://localhost:3000

