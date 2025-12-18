# Projeto Barbearia - MATC82

Este é um sistema de gerenciamento de barbearia **Full-stack**, desenvolvido para facilitar o agendamento de horários por clientes e oferecer uma gestão completa de serviços, profissionais e métricas para os administradores.

## ✨ Funcionalidades

### 🖥️ Frontend (Cliente & Admin)

* **Área do Cliente:**
* Visualização de catálogo de serviços e barbeiros disponíveis.
* Agendamento de horários em tempo real.
* Autenticação (Login/Cadastro) e gestão de perfil.

* **Área Administrativa:**
* **Dashboard:** Gráficos de receita e agendamentos (via *Recharts*).
* Gestão de Barbeiros (CRUD) e disponibilidade.
* Gestão de Serviços e Preços.
* Controle de Agendamentos.

### ⚙️ Backend (API)

* API RESTful estruturada com NestJS.
* Autenticação segura via JWT.
* Integração com Banco de Dados PostgreSQL.
* Documentação automática via Swagger.

## 🚀 Tecnologias Utilizadas

**Frontend:**

* [Next.js 16](https://nextjs.org/) (App Router)
* [React 19](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
* **Gerenciamento de Estado:** [Jotai](https://jotai.org/)
* **Gráficos:** [Recharts](https://recharts.org/)

**Backend:**

* [NestJS](https://nestjs.com/)
* [Prisma ORM](https://www.prisma.io/)
* [PostgreSQL](https://www.postgresql.org/)
* [Swagger](https://swagger.io/) (Documentação da API)

**Infraestrutura:**

* [Docker](https://www.docker.com/) & Docker Compose (Banco de dados com replicação).

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

* [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
* [Docker](https://www.docker.com/get-started) e [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## 🏁 Guia de Instalação e Execução

### 1. Clonar o Repositório

```bash
git clone https://github.com/silvaalejesus/MATC82-barbershop.git
cd barbershop

```

### 2. Subir o Banco de Dados (Docker)

O projeto utiliza uma arquitetura **Master-Slave** (Primário/Réplica). Execute o comando abaixo para subir os containers do banco:

```bash
docker-compose up -d

```

> **Nota:** Isso iniciará o banco de escrita na porta `5434` e o de leitura na `5433`. Aguarde alguns segundos para que os bancos estejam prontos antes de prosseguir.

### 3. Configurar e Rodar o Backend

Abra um terminal, navegue até a pasta `backend` e siga os passos:

1. **Instalar dependências:**

```bash
cd backend
npm install

```

2. **Configurar variáveis de ambiente:**
Crie um arquivo `.env` na raiz da pasta `backend` com o seguinte conteúdo:

```env
# Conexão com o banco de dados (Container de Escrita na porta 5434)
DATABASE_URL="postgresql://barber_user:barber_pass@127.0.0.1:5434/barbershop_db?schema=public"

# Porta da API
PORT=3001

```

3. **Configurar o Banco de Dados (Prisma):**
Gere o cliente, envie o schema para o banco e popule com dados iniciais (seed):

```bash
npx prisma generate
npx prisma db seed
npx prisma db push

```

1. **Iniciar o Servidor:**

```bash
npm run start:dev

```

*O backend estará rodando em: `http://localhost:3001*`

### 4. Configurar e Rodar o Frontend

Abra um **novo terminal**, navegue até a pasta `frontend` e siga os passos:

1. **Instalar dependências:**

```bash
cd frontend
npm install

```

2. **Configurar variáveis de ambiente:**
Crie um arquivo `.env.local` na raiz da pasta `frontend`:

```env
# URL da API do Backend
NEXT_PUBLIC_API_URL=http://localhost:3001/api

```

3. **Iniciar o Servidor:**

```bash
npm run dev

```

*O frontend estará acessível em: `http://localhost:3000*`


---

## 🗄️ Arquitetura do Banco de Dados

O projeto implementa separação de responsabilidades no banco de dados para escalabilidade:

| Tipo | Porta | Função |
| --- | --- | --- |
| **Primário (Master)** | `5434` | Responsável por operações de escrita (`INSERT`, `UPDATE`, `DELETE`). |
| **Réplica (Slave)** | `5433` | Responsável por operações de leitura (`SELECT`) para otimizar consultas pesadas. |

---

## 📄 Documentação da API

Com o backend rodando, você pode acessar a documentação interativa das rotas (Swagger) em:
`http://localhost:3001/docs`
