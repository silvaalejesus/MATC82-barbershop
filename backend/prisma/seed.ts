import { PrismaClient } from './generated/client';

const prisma = new PrismaClient();

// Função para criar datas fictícias apenas para o horário (Prisma Time)
const createTime = (timeString: string) =>
  new Date(`1970-01-01T${timeString}:00Z`);

async function main() {
  console.log('🌱 Iniciando seed...');

  // 1. Criar Serviços com UUIDs válidos
  // UUIDs gerados online para serem fixos
  const corte = await prisma.service.upsert({
    where: { id: '11111111-1111-1111-1111-111111111111' },
    update: {},
    create: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Corte de Cabelo',
      price: 45.0,
      durationMinutes: 45,
      description: 'Corte tradicional ou moderno com tesoura e máquina',
      imageUrl: '/professional-haircut.png',
    },
  });

  const barba = await prisma.service.upsert({
    where: { id: '22222222-2222-2222-2222-222222222222' },
    update: {},
    create: {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Barba Completa',
      price: 35.0,
      durationMinutes: 30,
      description: 'Barba desenhada com toalha quente e navalha',
      imageUrl: '/beard-trim-grooming-barbershop.jpg',
    },
  });

  const combo = await prisma.service.upsert({
    where: { id: '33333333-3333-3333-3333-333333333333' },
    update: {},
    create: {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Combo Corte + Barba',
      price: 70.0,
      durationMinutes: 70,
      description: 'Serviço completo de cabelo e barba',
      imageUrl: '/mens-grooming-haircut-beard-combo.jpg',
    },
  });

  console.log('✅ Serviços criados');

  // 2. Criar Barbeiros
  const barber1 = await prisma.barber.upsert({
    where: { email: 'carlos@barber.com' },
    update: {},
    create: {
      id: '44444444-4444-4444-4444-444444444444',
      name: 'Carlos Silva',
      email: 'carlos@barber.com',
      role: 'Barbeiro Master',
      phone: '11999990001',
      specialties: ['Corte Clássico', 'Degradê'],
      imageUrl: '/professional-barber-portrait-male.jpg',
    },
  });

  const barber2 = await prisma.barber.upsert({
    where: { email: 'joao@barber.com' },
    update: {},
    create: {
      id: '55555555-5555-5555-5555-555555555555',
      name: 'João Santos',
      email: 'joao@barber.com',
      role: 'Especialista em Barba',
      phone: '11999990002',
      specialties: ['Barba', 'Pigmentação'],
      imageUrl: '/barber-specialist-portrait-male.jpg',
    },
  });

  const barber3 = await prisma.barber.upsert({
    where: { email: 'pedro@barber.com' },
    update: {},
    create: {
      id: '66666666-6666-6666-6666-666666666666',
      name: 'Pedro Costa',
      email: 'pedro@barber.com',
      role: 'Barbeiro Sênior',
      phone: '11999990003',
      specialties: ['Corte Moderno', 'Platinado'],
      imageUrl: '/senior-barber-portrait-male.jpg',
    },
  });

  console.log('✅ Barbeiros criados');

  // 3. Criar Horários (Schedules)
  const allBarbers = [barber1, barber2, barber3];

  for (const barber of allBarbers) {
    console.log(`📅 Criando agenda para ${barber.name}...`);

    // Segunda (1) a Sexta (5)
    for (let day = 1; day <= 5; day++) {
      await prisma.barberSchedule.upsert({
        where: {
          barberId_dayOfWeek: {
            barberId: barber.id,
            dayOfWeek: day,
          },
        },
        update: {},
        create: {
          barberId: barber.id,
          dayOfWeek: day,
          startTime: createTime('09:00'),
          endTime: createTime('18:00'),
          breakStart: createTime('12:00'),
          breakEnd: createTime('13:00'),
          isAvailable: true,
        },
      });
    }

    // Sábado (6)
    await prisma.barberSchedule.upsert({
      where: {
        barberId_dayOfWeek: {
          barberId: barber.id,
          dayOfWeek: 6,
        },
      },
      update: {},
      create: {
        barberId: barber.id,
        dayOfWeek: 6,
        startTime: createTime('09:00'),
        endTime: createTime('14:00'),
        breakStart: null,
        breakEnd: null,
        isAvailable: true,
      },
    });
  }

  console.log('✅ Horários criados');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
