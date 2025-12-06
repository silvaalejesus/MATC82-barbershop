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