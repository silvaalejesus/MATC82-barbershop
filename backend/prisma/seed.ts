import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função auxiliar para criar datas fictícias apenas para o horário (Prisma Time)
// O Prisma armazena @db.Time como um DateTime completo, mas ignora a data na leitura
const createTime = (timeString: string) => new Date(`1970-01-01T${timeString}:00Z`);

async function main() {
  console.log('🌱 Iniciando seed...');

  // 1. Criar Serviços
  const corte = await prisma.service.upsert({
    where: { id: 'corte-cabelo' }, // Usando ID fixo para facilitar
    update: {},
    create: {
      id: 'corte-cabelo',
      name: 'Corte de Cabelo',
      price: 45.00,
      durationMinutes: 45,
      description: 'Corte tradicional ou moderno com tesoura e máquina',
      imageUrl: '/professional-haircut.png'
    },
  });

  const barba = await prisma.service.upsert({
    where: { id: 'barba-completa' },
    update: {},
    create: {
      id: 'barba-completa',
      name: 'Barba Completa',
      price: 35.00,
      durationMinutes: 30,
      description: 'Barba desenhada com toalha quente e navalha',
      imageUrl: '/beard-trim-grooming-barbershop.jpg'
    },
  });

  const combo = await prisma.service.upsert({
    where: { id: 'combo-corte-barba' },
    update: {},
    create: {
      id: 'combo-corte-barba',
      name: 'Combo Corte + Barba',
      price: 70.00,
      durationMinutes: 70,
      description: 'Serviço completo de cabelo e barba',
      imageUrl: '/mens-grooming-haircut-beard-combo.jpg'
    },
  });

  console.log('✅ Serviços criados');

  // 2. Criar Barbeiros
  const barber1 = await prisma.barber.upsert({
    where: { email: 'carlos@barber.com' },
    update: {},
    create: {
      name: 'Carlos Silva',
      email: 'carlos@barber.com',
      role: 'Barbeiro Master',
      phone: '11999990001',
      specialties: ['Corte Clássico', 'Degradê'],
      imageUrl: '/professional-barber-portrait-male.jpg'
    },
  });

  const barber2 = await prisma.barber.upsert({
    where: { email: 'joao@barber.com' },
    update: {},
    create: {
      name: 'João Santos',
      email: 'joao@barber.com',
      role: 'Especialista em Barba',
      phone: '11999990002',
      specialties: ['Barba', 'Pigmentação'],
      imageUrl: '/barber-specialist-portrait-male.jpg'
    },
  });

  const barber3 = await prisma.barber.upsert({
    where: { email: 'pedro@barber.com' },
    update: {},
    create: {
      name: 'Pedro Costa',
      email: 'pedro@barber.com',
      role: 'Barbeiro Sênior',
      phone: '11999990003',
      specialties: ['Corte Moderno', 'Platinado'],
      imageUrl: '/senior-barber-portrait-male.jpg'
    },
  });

  console.log('✅ Barbeiros criados');

  // 3. Criar Horários (Schedules) para TODOS os barbeiros
  const allBarbers = [barber1, barber2, barber3];

  for (const barber of allBarbers) {
    console.log(`Creating schedule for ${barber.name}...`);

    // Segunda (1) a Sexta (5)
    for (let day = 1; day <= 5; day++) {
      await prisma.barberSchedule.upsert({
        where: {
          barberId_dayOfWeek: {
            barberId: barber.id,
            dayOfWeek: day,
          },
        },
        update: {}, // Não sobrescreve se já existir
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

    // Sábado (6) - Horário reduzido
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
        breakStart: null, // Sem almoço no sábado
        breakEnd: null,
        isAvailable: true,
      },
    });
  }

  console.log('✅ Horários (Slots) criados');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });