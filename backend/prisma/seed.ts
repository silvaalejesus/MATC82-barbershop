import { PrismaClient } from './generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando o seed do banco de dados...');

  // 1. Limpar dados antigos (Opcional - cuidado em produção)
  // A ordem importa por causa das chaves estrangeiras
  await prisma.appointment.deleteMany();
  await prisma.barberSchedule.deleteMany();
  await prisma.service.deleteMany();
  await prisma.barber.deleteMany();
  await prisma.user.deleteMany();

  // 2. Criar Serviços
  const corteCabelo = await prisma.service.create({
    data: {
      name: 'Corte de Cabelo Moderno',
      price: 45.0,
      durationMinutes: 45,
      description: 'Corte completo com lavagem e finalização.',
      imageUrl: 'https://images.unsplash.com/photo-1599351431202-6e0000.jpg', // URL de exemplo
      active: true,
    },
  });

  const barba = await prisma.service.create({
    data: {
      name: 'Barba e Bigode',
      price: 35.0,
      durationMinutes: 30,
      description: 'Modelagem de barba com toalha quente.',
      imageUrl:
        'https://images.unsplash.com/photo-1621605815971-fbc98d665033.jpg',
      active: true,
    },
  });

  console.log('✅ Serviços criados!');

  // 3. Criar Barbeiros
  const barbeiroJoao = await prisma.barber.create({
    data: {
      name: 'João Silva',
      email: 'joao.barber@email.com',
      phone: '71999998888',
      specialties: ['Corte Clássico', 'Barba'],
      status: 'active',
      hireDate: new Date(),
    },
  });

  console.log('✅ Barbeiros criados!');

  // 4. Criar Usuários (Clientes e Admins)
  await prisma.user.create({
    data: {
      name: 'Cliente Teste',
      email: 'cliente@teste.com',
      phone: '71988887777',
      passwordHash: 'senha123', // Em produção, use hash real (bcrypt)
      role: 'client',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Admin Master',
      email: 'admin@barbershop.com',
      passwordHash: 'admin123',
      role: 'admin',
    },
  });

  console.log('✅ Usuários criados!');
  console.log('🏁 Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
