Com base nos requisitos do projeto **Barbearia (MATC82)** e na necessidade de separação entre **Leitura (Read)** e **Escrita (Write)**, elaborei a estrutura do banco de dados PostgreSQL.

Para atender ao requisito de separação sem adicionar complexidade excessiva de infraestrutura manual, utilizei a abordagem de **Replicação** (Primary/Replica). Abaixo estão os scripts SQL, o arquivo para subir o ambiente (Docker) e a documentação.

### 1\. Estrutura do Banco de Dados (Schema SQL)

Este script (`init.sql`) cria as tabelas baseadas nos arquivos `store.ts` e `backend/README.md`. Ele deve ser executado no banco de escrita (Primary).

```sql
-- Habilita extensão para gerar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS para status e roles (baseado no código frontend)
CREATE TYPE user_role AS ENUM ('client', 'admin', 'barber');
CREATE TYPE appointment_status AS ENUM ('confirmed', 'completed', 'cancelled');
CREATE TYPE barber_status AS ENUM ('active', 'inactive');

-- Tabela de Usuários (Clientes e Admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL, -- Senha deve ser hashada no backend
    role user_role DEFAULT 'client',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Barbeiros (Pode ter login ou não, aqui separamos para dados específicos)
CREATE TABLE barbers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(100) DEFAULT 'Barbeiro', -- Ex: Barbeiro Master
    image_url VARCHAR(255),
    specialties TEXT[], -- Array de strings (Ex: ['Corte', 'Barba'])
    status barber_status DEFAULT 'active',
    hire_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Serviços
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL, -- Armazena valor numérico (Front formata R$)
    duration_minutes INTEGER NOT NULL, -- Ex: 45
    description TEXT,
    image_url VARCHAR(255),
    active BOOLEAN DEFAULT TRUE
);

-- Tabela de Agenda de Trabalho dos Barbeiros
CREATE TABLE barber_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL, -- 0 (Domingo) a 6 (Sábado)
    is_available BOOLEAN DEFAULT TRUE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_start TIME,
    break_end TIME,
    UNIQUE(barber_id, day_of_week) -- Garante apenas uma configuração por dia por barbeiro
);

-- Tabela de Agendamentos
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES services(id),
    barber_id UUID REFERENCES barbers(id),
    user_id UUID REFERENCES users(id), -- Pode ser NULL se agendado por admin para convidado
    customer_name VARCHAR(255), -- Preenchido se user_id for NULL
    customer_phone VARCHAR(20), -- Preenchido se user_id for NULL
    date DATE NOT NULL,
    time TIME NOT NULL,
    status appointment_status DEFAULT 'confirmed',
    price DECIMAL(10, 2) NOT NULL, -- Preço congelado no momento da reserva
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para otimizar leitura (Banco de Leitura se beneficia disso)
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_barber ON appointments(barber_id);
CREATE INDEX idx_appointments_user ON appointments(user_id);
CREATE INDEX idx_users_email ON users(email);
```

-----

### 2\. Infraestrutura (Docker Compose)

Para simular o ambiente com **Banco de Escrita (Primary)** e **Banco de Leitura (Replica)** de forma simples, utilizaremos as imagens da Bitnami que já possuem scripts de configuração de replicação facilitada.

Crie um arquivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # BANCO DE ESCRITA (PRIMARY)
  pg-primary:
    image: bitnami/postgresql:16
    container_name: barbershop-primary
    ports:
      - '5432:5432'
    volumes:
      - pg_primary_data:/bitnami/postgresql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    environment:
      - POSTGRESQL_POSTGRES_PASSWORD=admin123
      - POSTGRESQL_USERNAME=barber_user
      - POSTGRESQL_PASSWORD=barber_pass
      - POSTGRESQL_DATABASE=barbershop_db
      - POSTGRESQL_REPLICATION_MODE=master
      - POSTGRESQL_REPLICATION_USER=repl_user
      - POSTGRESQL_REPLICATION_PASSWORD=repl_pass
    networks:
      - barber-network

  # BANCO DE LEITURA (REPLICA)
  pg-replica:
    image: bitnami/postgresql:16
    container_name: barbershop-replica
    ports:
      - '5433:5432' # Exposto na porta 5433 para não conflitar
    depends_on:
      - pg-primary
    volumes:
      - pg_replica_data:/bitnami/postgresql
    environment:
      - POSTGRESQL_POSTGRES_PASSWORD=admin123
      - POSTGRESQL_REPLICATION_MODE=slave
      - POSTGRESQL_REPLICATION_USER=repl_user
      - POSTGRESQL_REPLICATION_PASSWORD=repl_pass
      - POSTGRESQL_MASTER_HOST=pg-primary
      - POSTGRESQL_MASTER_PORT_NUMBER=5432
    networks:
      - barber-network

networks:
  barber-network:
    driver: bridge

volumes:
  pg_primary_data:
  pg_replica_data:
```

### 3\. Documentação do Banco de Dados

#### Visão Geral da Arquitetura

O sistema utiliza uma arquitetura **Master-Slave (Primary-Replica)**.

  * **Write DB (Porta 5432):** Recebe todas as operações `INSERT`, `UPDATE`, `DELETE`. As alterações são replicadas automaticamente para o banco de leitura.
  * **Read DB (Porta 5433):** Recebe apenas operações `SELECT`. Isso alivia a carga do banco principal, ideal para dashboards, relatórios e listagem de serviços.

#### Configuração de Conexão (Backend)

No seu backend (Node.js/Next.js), você deve configurar duas strings de conexão:

1.  **DATABASE\_WRITE\_URL:** `postgres://barber_user:barber_pass@localhost:5432/barbershop_db`
2.  **DATABASE\_READ\_URL:** `postgres://barber_user:barber_pass@localhost:5433/barbershop_db`

#### Dicionário de Dados

| Tabela | Descrição | Principais Colunas |
| :--- | :--- | :--- |
| **users** | Armazena dados de autenticação e perfil de clientes e administradores. | `id`, `email`, `role`, `password_hash` |
| **barbers** | Cadastro detalhado dos profissionais, incluindo especialidades e fotos. | `id`, `specialties` (array), `status` |
| **services** | Catálogo de serviços oferecidos pela barbearia. | `id`, `price` (decimal), `duration_minutes` |
| **barber\_schedules** | Configuração semanal de horários. Define quando cada barbeiro trabalha. | `day_of_week`, `start_time`, `end_time` |
| **appointments** | Tabela transacional principal. Liga Cliente, Barbeiro e Serviço. | `date`, `time`, `status`, `price` (histórico) |

#### Como rodar o projeto

1.  Salve o código SQL acima em um arquivo chamado `init.sql`.
2.  Salve o código YAML em um arquivo chamado `docker-compose.yml`.
3.  Execute o comando no terminal:
    ```bash
    docker-compose up -d
    ```
4.  O banco de dados estará pronto com replicação ativa.

#### Exemplo de uso no Backend (Conceitual)

Quando for implementar no backend (usando Prisma ou Drizzle ORM, por exemplo), você direcionará as queries:

  * **Criar Agendamento (`POST /appointments`):** Usa o cliente conectado ao **Write DB**.
  * **Listar Barbeiros (`GET /barbers`):** Usa o cliente conectado ao **Read DB**.
  * **Dashboard Admin (`GET /admin/dashboard`):** Usa o cliente conectado ao **Read DB** (pois são queries pesadas de agregação).****