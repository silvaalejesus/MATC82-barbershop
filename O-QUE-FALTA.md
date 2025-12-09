### 2\. Rotas do Backend em Falta (Necessárias para Integração Completa)

Analisando os controladores fornecidos (`barber.controller.ts`, `services.controller.ts`, etc.), identificam-se várias lacunas críticas para o funcionamento do frontend:

#### 1\. Autenticação (Login/Registo) [CRÍTICO]

O frontend tem páginas `/login` e `/register`, mas **não existe controlador de Autenticação** nos ficheiros fornecidos.

* **Falta criar:** `AuthController`
  * `POST /api/auth/login`: Para autenticar clientes e admins.
  * `POST /api/auth/register`: Para criar novos utilizadores (`User` model).
  * Middleware/Guards (JWT) para proteger rotas.

#### 2\. Gestão de Serviços (Admin)

O `ServicesController` apenas tem o método `GET`. O admin não consegue gerir serviços.

* **Falta criar:**
  * `POST /api/services`: Criar novo serviço.
  * `PUT /api/services/:id`: Editar serviço.
  * `DELETE /api/services/:id`: Remover serviço.

#### 3\. Dashboard de Admin

As páginas de admin (`admin/clients`, `admin/dashboard`, `admin/schedule`) precisam de dados que as rotas atuais não fornecem.

* **Falta criar:**
  * `GET /api/users`: Listar todos os clientes (atualmente `UsersController` só tem `getProfile` do próprio utilizador).
  * `GET /api/appointments`: Listar **todos** os agendamentos (com filtros de data) para o calendário do barbeiro. O `AppointmentController` atual só tem `getMyAppointments`.
  * `GET /api/dashboard/stats`: Métricas (total de clientes, faturação).

#### 4\. Disponibilidade Dinâmica (Slots)

O `BookingModal` usa um array fixo `timeSlots`. Isto vai gerar conflitos de horário.

* **Falta verificar/criar:** Rota de Disponibilidade (provavelmente em `AvailabilityController` que aparece na lista de ficheiros mas não no conteúdo).
  * `GET /api/availability?barberId=...&date=...`: Deve retornar apenas os horários livres, cruzando a tabela `BarberSchedule` com os `Appointments` existentes.

### Resumo das Alterações Necessárias no Backend

| Recurso | Método | Rota | Status Atual | Ação Necessária |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | POST | `/api/auth/login` | **Inexistente** | **Criar** |
| **Auth** | POST | `/api/auth/register` | **Inexistente** | **Criar** |
| **Services** | POST/PUT | `/api/services` | **Inexistente** | **Criar** (Apenas Admin) |
| **Users** | GET | `/api/users` | **Inexistente** | **Criar** (Listagem p/ Admin) |
| **Appts** | GET | `/api/appointments` | **Parcial** | **Expandir** para permitir admin ver tudo |
| **Slots** | GET | `/api/availability` | **Incerto** | Verificar se retorna slots calculados |

### Próximos Passos Recomendados

1. Implementar o módulo de **Auth** (NestJS + Passport/JWT) para permitir o login no frontend.
2. Atualizar o `BookingModal` para consultar a API de disponibilidade antes de mostrar os horários.
3. Substituir os arrays estáticos em `store.ts` por dados vazios e criar a lógica de *fetch* nos componentes principais.
