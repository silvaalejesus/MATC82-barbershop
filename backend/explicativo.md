````markdown
# Documentação da API Backend para Barbearia

Com base nos arquivos do frontend, principalmente as páginas em `app/`, o modal de agendamento (`components/booking-modal.tsx`) e as definições de dados em `lib/store.ts`, esta é a documentação para as rotas de backend necessárias.

## Modelos de Dados Principais (Baseado em `lib/store.ts`)

Antes das rotas, aqui estão as estruturas de dados principais que o backend precisará gerenciar:

#### User (Usuário)
```json
{
  "id": "string (ou uuid)",
  "name": "string",
  "email": "string (único)",
  "phone": "string",
  "password": "string (hashed)",
  "role": "string (enum: 'client', 'admin', 'barber')"
}
````

#### Barber (Barbeiro)

```json
{
  "id": "string (ou uuid)",
  "name": "string",
  "email": "string",
  "phone": "string",
  "role": "string",
  "image": "string (URL)",
  "specialties": "string[] (array de strings)",
  "status": "string (enum: 'active', 'inactive')",
  "hireDate": "string (ISO 8601 Date)"
}
```

#### Service (Serviço)

```json
{
  "id": "string (ou uuid)",
  "name": "string",
  "price": "string (ou number para melhor manipulação)",
  "duration": "string (ou number em minutos)",
  "description": "string",
  "image": "string (URL)"
}
```

#### Appointment (Agendamento)

```json
{
  "id": "string (ou uuid)",
  "serviceId": "string (foreign key para Service)",
  "barberId": "string (foreign key para Barber)",
  "userId": "string (foreign key para User, pode ser nulo)",
  "customerName": "string (obrigatório se userId for nulo)",
  "customerPhone": "string (obrigatório se userId for nulo)",
  "date": "string (ISO 8601 Date, ex: \"2025-10-25\")",
  "time": "string (ex: \"14:00\")",
  "status": "string (enum: 'confirmed', 'completed', 'cancelled')",
  "price": "string (ou number)"
}
```

#### BarberSchedule (Agenda do Barbeiro)

```json
{
  "id": "string (ou uuid)",
  "barberId": "string (foreign key para Barber)",
  "dayOfWeek": "number (0 = Domingo, 1 = Segunda, ...)",
  "isAvailable": "boolean",
  "startTime": "string (ex: \"09:00\")",
  "endTime": "string (ex: \"18:00\")",
  "breakStart": "string (opcional, ex: \"12:00\")",
  "breakEnd": "string (opcional, ex: \"13:00\")"
}
```

-----

## Documentação das Rotas da API

Abaixo estão as rotas de API necessárias para o frontend funcionar.

### 1\. Autenticação (`/api/auth`)

Rotas para registro, login e gerenciamento de sessão.

#### `POST /api/auth/register`

* **Descrição:** Registra um novo usuário (cliente).
* **Autenticação:** Pública.
* **Request Body:**
  * `name`: `string`
  * `email`: `string`
  * `phone`: `string`
  * `password`: `string`
* **Success Response (201):**
  * `user`: Objeto `User` (sem a senha).
  * `token`: `string` (JWT para autenticação).

#### `POST /api/auth/login`

* **Descrição:** Autentica um usuário e retorna um token.
* **Autenticação:** Pública.
* **Request Body:**
  * `email`: `string`
  * `password`: `string`
* **Success Response (200):**
  * `user`: Objeto `User` (sem a senha).
  * `token`: `string` (JWT).

#### `POST /api/auth/admin/login`

* **Descrição:** Autentica um administrador ou barbeiro.
* **Autenticação:** Pública.
* **Request Body:**
  * `email`: `string`
  * `password`: `string`
* **Success Response (200):**
  * Verifica se `role` é 'admin' ou 'barber'.
  * `user`: Objeto `User` (sem a senha).
  * `token`: `string` (JWT).

#### `GET /api/auth/me`

* **Descrição:** Retorna o usuário autenticado com base no token (usado para verificar a sessão).
* **Autenticação:** **Autenticada** (requer token JWT).
* **Success Response (200):**
  * `user`: Objeto `User` (sem a senha).

-----

### 2\. Usuários (`/api/users`)

Rotas para gerenciamento de dados do usuário.

#### `GET /api/users/me`

* **Descrição:** Obtém os detalhes do perfil do usuário logado (para `app/profile/page.tsx`).
* **Autenticação:** **Autenticada**.
* **Success Response (200):**
  * Objeto `User` (sem a senha).

#### `PUT /api/users/me`

* **Descrição:** Atualiza o perfil do usuário logado.
* **Autenticação:** **Autenticada**.
* **Request Body:**
  * `name`: `string` (opcional)
  * `phone`: `string` (opcional)
  * `email`: `string` (opcional)
* **Success Response (200):**
  * Objeto `User` atualizado.

-----

### 3\. Serviços (`/api/services`)

Rotas públicas para listar os serviços oferecidos.

#### `GET /api/services`

* **Descrição:** Lista todos os serviços disponíveis (usado em `app/services/page.tsx` e `components/booking-modal.tsx`).
* **Autenticação:** Pública.
* **Success Response (200):**
  * `Service[]` (Array de objetos `Service`).

-----

### 4\. Barbeiros (`/api/barbers`)

Rotas para listar barbeiros (público) e gerenciar (admin).

#### `GET /api/barbers`

* **Descrição:** Lista todos os barbeiros ativos (usado em `app/barbers/page.tsx` e `components/booking-modal.tsx`).
* **Autenticação:** Pública.
* **Query Params:**
  * `status`: `string` (opcional, ex: 'active'. O admin pode querer ver 'inactive' também).
* **Success Response (200):**
  * `Barber[]` (Array de objetos `Barber`).

#### `POST /api/barbers`

* **Descrição:** Cria um novo barbeiro (usado em `app/admin/barbers/page.tsx`).
* **Autenticação:** **Admin**.
* **Request Body:**
  * `name`: `string`
  * `email`: `string`
  * `phone`: `string`
  * `role`: `string`
  * `specialties`: `string[]`
  * `status`: `string` (enum: 'active', 'inactive')
  * `image`: `string` (URL)
* **Success Response (201):**
  * Objeto `Barber` criado.

#### `PUT /api/barbers/:id`

* **Descrição:** Atualiza um barbeiro existente.
* **Autenticação:** **Admin**.
* **Request Body:** (Campos iguais ao `POST`)
* **Success Response (200):**
  * Objeto `Barber` atualizado.

#### `DELETE /api/barbers/:id`

* **Descrição:** Remove um barbeiro.
* **Autenticação:** **Admin**.
* **Success Response (204):** Sem conteúdo.

-----

### 5\. Agendamentos (`/api/appointments`)

Rotas para criar e visualizar agendamentos.

#### `POST /api/appointments`

* **Descrição:** Cria um novo agendamento (usado em `components/booking-modal.tsx`).
* **Autenticação:** Pública (mas verifica se o usuário está logado via token).
* **Request Body:**
  * `serviceId`: `string`
  * `barberId`: `string`
  * `date`: `string` (ex: "2025-10-25")
  * `time`: `string` (ex: "14:00")
  * `name`: `string` (Obrigatório se o usuário não estiver logado)
  * `phone`: `string` (Obrigatório se o usuário não estiver logado)
* **Nota:** Se um token JWT for enviado, o backend deve associar o `userId` ao agendamento e ignorar `name` e `phone` do body, usando os dados do usuário autenticado.
* **Success Response (201):**
  * Objeto `Appointment` criado.

#### `GET /api/appointments/me`

* **Descrição:** Lista todos os agendamentos do usuário logado (para `app/appointments/page.tsx` e `app/profile/page.tsx`).
* **Autenticação:** **Autenticada**.
* **Query Params:**
  * `status`: `string` (opcional, ex: 'confirmed', 'completed', 'cancelled')
  * `limit`: `number` (opcional, para `app/profile/page.tsx`)
* **Success Response (200):**
  * `Appointment[]` (Array de objetos `Appointment`, populados com nomes de serviço e barbeiro).

#### `PATCH /api/appointments/:id/cancel`

* **Descrição:** Cancela um agendamento (usado em `app/appointments/page.tsx`).
* **Autenticação:** **Autenticada** (O backend deve verificar se o usuário logado é o dono do agendamento).
* **Success Response (200):**
  * Objeto `Appointment` atualizado com `status: "cancelled"`.

-----

### 6\. Disponibilidade (`/api/availability`)

Rota crucial para o modal de agendamento.

#### `GET /api/availability`

* **Descrição:** Retorna os horários disponíveis para um barbeiro em uma data específica.
* **Autenticação:** Pública.
* **Query Params:**
  * `barberId`: `string` (obrigatório)
  * `date`: `string` (obrigatório, ex: "2025-10-25")
* **Lógica do Backend:**
    1. Buscar a `BarberSchedule` para o `barberId` e o dia da semana (`dayOfWeek`) correspondente à `date`.
    2. Se não estiver disponível (`isAvailable: false`), retornar `[]`.
    3. Gerar slots de tempo (ex: de 30 em 30 min) entre `startTime` e `endTime`.
    4. Remover slots que caiam dentro do `breakStart` e `breakEnd`.
    5. Buscar todos os `Appointments` para esse `barberId` e `date`.
    6. Remover da lista de slots gerados todos os horários que já estão ocupados (considerar a duração do serviço, embora o front pareça usar slots fixos).
* **Success Response (200):**
  * `timeSlots`: `string[]` (Array de horários disponíveis, ex: ["09:00", "09:30", ...]).

-----

### 7\. Painel Admin (`/api/admin`)

Rotas protegidas para o painel de administração.

#### `GET /api/admin/dashboard`

* **Descrição:** Agrega todos os dados para o dashboard (`app/admin/dashboard/page.tsx`).
* **Autenticação:** **Admin**.
* **Success Response (200):**
  * `stats`: `{ totalAppointments: number, completedAppointments: number, cancelledAppointments: number, totalRevenue: number }`
  * `monthlyData`: `[{ month: string, appointments: number, revenue: number }]`
  * `statusData`: `[{ name: string, value: number, color: string }]`
  * `topServices`: `[{ service: string, count: number }]`
  * `barberPerformance`: `[{ barberName: string, completedCount: number }]`

#### `GET /api/admin/schedules`

* **Descrição:** Retorna as agendas de todos os barbeiros (`app/admin/schedule/page.tsx`).
* **Autenticação:** **Admin**.
* **Success Response (200):**
  * `BarberSchedule[]` (Array de agendas, onde cada item contém o `barberId`, `barberName` e o array `schedule`).

#### `PUT /api/admin/schedules/:barberId`

* **Descrição:** Atualiza a agenda completa de um barbeiro.
* **Autenticação:** **Admin**.
* **Request Body:**
  * `schedule`: `[ { dayOfWeek: number, isAvailable: boolean, startTime: string, endTime: string, breakStart?: string, breakEnd?: string } ]` (O array completo da agenda).
* **Success Response (200):**
  * Objeto `BarberSchedule` atualizado.

#### `GET /api/admin/clients`

* **Descrição:** Lista todos os clientes com estatísticas (`app/admin/clients/page.tsx`).
* **Autenticação:** **Admin**.
* **Query Params:**
  * `search`: `string` (opcional, para filtrar por nome, email, telefone).
* **Success Response (200):**
  * `Client[]` (Array de objetos `Client`. O backend deve computar os dados estatísticos (`totalAppointments`, etc.) a partir dos `Users` com `role: 'client'` e seus `Appointments`).

#### `GET /api/admin/appointments`

* **Descrição:** Lista todos os agendamentos (usado em `app/admin/clients/page.tsx` na aba "Clientes Agendados").
* **Autenticação:** **Admin**.
* **Query Params:**
  * `status`: `string` (opcional, ex: 'confirmed').
* **Success Response (200):**
  * `Appointment[]` (Array de objetos `Appointment`, populados com nomes).
