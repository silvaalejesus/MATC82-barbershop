# Projeto Barbearia - MATC82

Este é um sistema de gerenciamento de barbearia full-stack, permitindo que clientes agendem horários e que administradores gerenciem os serviços, barbeiros e agendamentos.

## ✨ Funcionalidades

-   **Frontend (Cliente):**
    -   Visualização de serviços e barbeiros.
    -   Agendamento de horários.
    -   Autenticação de usuários (cadastro e login).
    -   Página de perfil do usuário.
-   **Backend (Admin/Gerenciamento):**
    -   API RESTful para gerenciar usuários, barbeiros, serviços e agendamentos.
    -   Dashboard administrativo.
    -   Sistema de autenticação.

## 🚀 Tecnologias Utilizadas

-   **Frontend:**
    -   [Next.js](https://nextjs.org/)
    -   [React](https://reactjs.org/)
    -   [TypeScript](https://www.typescriptlang.org/)
    -   [Tailwind CSS](https://tailwindcss.com/)
    -   [Shadcn/UI](https://ui.shadcn.com/)
-   **Backend:**
    -   [NestJS](https://nestjs.com/)
    -   [TypeScript](https://www.typescriptlang.org/)
    -   [Prisma ORM](https://www.prisma.io/)
-   **Banco de Dados:**
    -   [PostgreSQL](https://www.postgresql.org/) (com replicação primário/réplica)
-   **Containerização:**
    -   [Docker](https://www.docker.com/)

## ⚙️ Pré-requisitos

-   [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
-   [Docker](https://www.docker.com/get-started) e [Docker Compose](https://docs.docker.com/compose/install/)

## 🏁 Guia de Instalação e Execução

Siga os passos abaixo para configurar e executar o ambiente de desenvolvimento.

### 1. Clonar o Repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd MATC82-barbershop
```

### 2. Configurar Variáveis de Ambiente

Crie os arquivos `.env` para o backend e frontend.

**a) Backend (`backend/.env`)**

```env
# URL do banco de dados principal (escrita)
DATABASE_URL="postgresql://barber_user:barber_pass@localhost:5434/barbershop_db?schema=public"

# Porta do servidor Backend
PORT=3001
```

**b) Frontend (`frontend/.env.local`)**

```env
# URL da API do backend
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Iniciar o Banco de Dados

O Docker irá inicializar dois contêineres PostgreSQL: um para escrita (`porta 5434`) e outro para leitura (`porta 5433`).

```bash
docker-compose up -d
```
*Observação: Você só precisa executar este comando uma vez. Para futuras sessões, você pode simplesmente iniciar os contêineres pelo seu aplicativo Docker Desktop.*

### 4. Configurar e Iniciar o Backend

Abra um novo terminal e navegue até a pasta do backend.

```bash
cd backend

# Instalar dependências
npm install

# Gerar o cliente Prisma
npx prisma generate

# Aplicar o schema no banco de dados
npx prisma db push

# Popular o banco de dados com dados iniciais (seed)
npx prisma db seed

# Iniciar o servidor de desenvolvimento
npm run start:dev
```
O servidor backend estará rodando em `http://localhost:3001`.

### 5. Configurar e Iniciar o Frontend

Abra um terceiro terminal e navegue até a pasta do frontend.

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```
A aplicação frontend estará acessível em `http://localhost:3000`.

### 6. Acesso de Administrador (Mock)

Para acessar a área de administração no frontend, utilize as seguintes credenciais:
-   **Email:** `admin@barber.com`
-   **Senha:** `admin123`

## 🗄️ Arquitetura do Banco de Dados

O projeto utiliza uma arquitetura de banco de dados com replicação **Primário-Réplica (Master-Slave)** para separar as cargas de trabalho de escrita e leitura:

-   **Banco de Escrita (Primário):** Acessível na porta `5434`. Responsável por todas as operações de `INSERT`, `UPDATE` e `DELETE`.
-   **Banco de Leitura (Réplica):** Acessível na porta `5433`. Utilizado para operações de `SELECT`, otimizando consultas para listagens, dashboards e relatórios.

Esta abordagem melhora a performance e a escalabilidade da aplicação.
