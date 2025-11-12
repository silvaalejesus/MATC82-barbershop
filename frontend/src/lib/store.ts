import { atom } from "jotai"

export const bookingModalOpenAtom = atom(false)
export const selectedServiceAtom = atom<string | null>(null)

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "client" | "admin" | "barber"
}

export const userAtom = atom<User | null>(null)
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null)
export const isAdminAtom = atom((get) => {
  const user = get(userAtom)
  return user?.role === "admin" || user?.role === "barber"
})

export interface Barber {
  id: string
  name: string
  role: string
  image: string
  specialties: string[]
  email: string
  phone: string
  status: "active" | "inactive"
  hireDate: string
}

export const barbersData: Barber[] = [
  {
    id: "carlos",
    name: "Carlos Silva",
    role: "Barbeiro Master",
    image: "/professional-barber-portrait-male.jpg",
    specialties: ["Corte de Cabelo", "Barba", "Combo Premium"],
    email: "carlos@barber.com",
    phone: "(11) 98765-4321",
    status: "active",
    hireDate: "2020-01-15",
  },
  {
    id: "joao",
    name: "João Santos",
    role: "Especialista em Barba",
    image: "/barber-specialist-portrait-male.jpg",
    specialties: ["Barba", "Bigode", "Sobrancelha"],
    email: "joao@barber.com",
    phone: "(11) 98765-4322",
    status: "active",
    hireDate: "2021-03-20",
  },
  {
    id: "pedro",
    name: "Pedro Costa",
    role: "Barbeiro Sênior",
    image: "/senior-barber-portrait-male.jpg",
    specialties: ["Corte de Cabelo", "Combo Completo", "Combo Premium"],
    email: "pedro@barber.com",
    phone: "(11) 98765-4323",
    status: "active",
    hireDate: "2019-06-10",
  },
]

export const barbersAtom = atom<Barber[]>(barbersData)

export interface Service {
  id: string
  name: string
  price: string
  duration: string
}

export const servicesData: Service[] = [
  { id: "corte-cabelo", name: "Corte de Cabelo", price: "R$ 45,00", duration: "45 min" },
  { id: "barba", name: "Barba Completa", price: "R$ 35,00", duration: "30 min" },
  { id: "bigode", name: "Bigode", price: "R$ 20,00", duration: "15 min" },
  { id: "sobrancelha", name: "Sobrancelha", price: "R$ 25,00", duration: "20 min" },
  { id: "combo-completo", name: "Corte + Barba", price: "R$ 70,00", duration: "75 min" },
  { id: "combo-premium", name: "Combo Premium", price: "R$ 95,00", duration: "90 min" },
]

export interface Appointment {
  id: string
  service: string
  barber: string
  date: string
  time: string
  status: "confirmed" | "completed" | "cancelled"
  price: string
}

export const appointmentsAtom = atom<Appointment[]>([
  {
    id: "1",
    service: "Corte de Cabelo",
    barber: "Carlos Silva",
    date: "2025-10-25",
    time: "14:00",
    status: "confirmed",
    price: "R$ 45,00",
  },
  {
    id: "2",
    service: "Barba Completa",
    barber: "João Santos",
    date: "2025-10-20",
    time: "10:00",
    status: "completed",
    price: "R$ 35,00",
  },
  {
    id: "3",
    service: "Corte + Barba",
    barber: "Pedro Costa",
    date: "2025-10-15",
    time: "16:00",
    status: "completed",
    price: "R$ 70,00",
  },
])

export interface BarberSchedule {
  barberId: string
  barberName: string
  schedule: {
    dayOfWeek: number
    dayName: string
    isAvailable: boolean
    startTime: string
    endTime: string
    breakStart?: string
    breakEnd?: string
  }[]
}

export const barberSchedulesAtom = atom<BarberSchedule[]>([
  {
    barberId: "carlos",
    barberName: "Carlos Silva",
    schedule: [
      {
        dayOfWeek: 1,
        dayName: "Segunda",
        isAvailable: true,
        startTime: "09:00",
        endTime: "18:00",
        breakStart: "12:00",
        breakEnd: "13:00",
      },
      {
        dayOfWeek: 2,
        dayName: "Terça",
        isAvailable: true,
        startTime: "09:00",
        endTime: "18:00",
        breakStart: "12:00",
        breakEnd: "13:00",
      },
      {
        dayOfWeek: 3,
        dayName: "Quarta",
        isAvailable: true,
        startTime: "09:00",
        endTime: "18:00",
        breakStart: "12:00",
        breakEnd: "13:00",
      },
      {
        dayOfWeek: 4,
        dayName: "Quinta",
        isAvailable: true,
        startTime: "09:00",
        endTime: "18:00",
        breakStart: "12:00",
        breakEnd: "13:00",
      },
      {
        dayOfWeek: 5,
        dayName: "Sexta",
        isAvailable: true,
        startTime: "09:00",
        endTime: "18:00",
        breakStart: "12:00",
        breakEnd: "13:00",
      },
      { dayOfWeek: 6, dayName: "Sábado", isAvailable: true, startTime: "09:00", endTime: "15:00" },
      { dayOfWeek: 0, dayName: "Domingo", isAvailable: false, startTime: "", endTime: "" },
    ],
  },
  {
    barberId: "joao",
    barberName: "João Santos",
    schedule: [
      {
        dayOfWeek: 1,
        dayName: "Segunda",
        isAvailable: true,
        startTime: "10:00",
        endTime: "19:00",
        breakStart: "13:00",
        breakEnd: "14:00",
      },
      {
        dayOfWeek: 2,
        dayName: "Terça",
        isAvailable: true,
        startTime: "10:00",
        endTime: "19:00",
        breakStart: "13:00",
        breakEnd: "14:00",
      },
      {
        dayOfWeek: 3,
        dayName: "Quarta",
        isAvailable: true,
        startTime: "10:00",
        endTime: "19:00",
        breakStart: "13:00",
        breakEnd: "14:00",
      },
      {
        dayOfWeek: 4,
        dayName: "Quinta",
        isAvailable: true,
        startTime: "10:00",
        endTime: "19:00",
        breakStart: "13:00",
        breakEnd: "14:00",
      },
      {
        dayOfWeek: 5,
        dayName: "Sexta",
        isAvailable: true,
        startTime: "10:00",
        endTime: "19:00",
        breakStart: "13:00",
        breakEnd: "14:00",
      },
      { dayOfWeek: 6, dayName: "Sábado", isAvailable: true, startTime: "10:00", endTime: "16:00" },
      { dayOfWeek: 0, dayName: "Domingo", isAvailable: false, startTime: "", endTime: "" },
    ],
  },
  {
    barberId: "pedro",
    barberName: "Pedro Costa",
    schedule: [
      {
        dayOfWeek: 1,
        dayName: "Segunda",
        isAvailable: true,
        startTime: "08:00",
        endTime: "17:00",
        breakStart: "12:00",
        breakEnd: "13:00",
      },
      {
        dayOfWeek: 2,
        dayName: "Terça",
        isAvailable: true,
        startTime: "08:00",
        endTime: "17:00",
        breakStart: "12:00",
        breakEnd: "13:00",
      },
      {
        dayOfWeek: 3,
        dayName: "Quarta",
        isAvailable: true,
        startTime: "08:00",
        endTime: "17:00",
        breakStart: "12:00",
        breakEnd: "13:00",
      },
      {
        dayOfWeek: 4,
        dayName: "Quinta",
        isAvailable: true,
        startTime: "08:00",
        endTime: "17:00",
        breakStart: "12:00",
        breakEnd: "13:00",
      },
      {
        dayOfWeek: 5,
        dayName: "Sexta",
        isAvailable: true,
        startTime: "08:00",
        endTime: "17:00",
        breakStart: "12:00",
        breakEnd: "13:00",
      },
      { dayOfWeek: 6, dayName: "Sábado", isAvailable: true, startTime: "08:00", endTime: "14:00" },
      { dayOfWeek: 0, dayName: "Domingo", isAvailable: false, startTime: "", endTime: "" },
    ],
  },
])

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  totalAppointments: number
  completedAppointments: number
  cancelledAppointments: number
  lastVisit: string
  registeredDate: string
}

export const clientsAtom = atom<Client[]>([
  {
    id: "client-1",
    name: "João Silva",
    email: "joao@email.com",
    phone: "(11) 98765-1234",
    totalAppointments: 12,
    completedAppointments: 10,
    cancelledAppointments: 2,
    lastVisit: "2025-10-15",
    registeredDate: "2024-01-10",
  },
  {
    id: "client-2",
    name: "Maria Santos",
    email: "maria@email.com",
    phone: "(11) 98765-5678",
    totalAppointments: 8,
    completedAppointments: 8,
    cancelledAppointments: 0,
    lastVisit: "2025-10-18",
    registeredDate: "2024-03-15",
  },
  {
    id: "client-3",
    name: "Pedro Costa",
    email: "pedro@email.com",
    phone: "(11) 98765-9012",
    totalAppointments: 15,
    completedAppointments: 12,
    cancelledAppointments: 3,
    lastVisit: "2025-10-20",
    registeredDate: "2023-11-20",
  },
  {
    id: "client-4",
    name: "Ana Oliveira",
    email: "ana@email.com",
    phone: "(11) 98765-3456",
    totalAppointments: 6,
    completedAppointments: 5,
    cancelledAppointments: 1,
    lastVisit: "2025-10-12",
    registeredDate: "2024-06-05",
  },
  {
    id: "client-5",
    name: "Carlos Ferreira",
    email: "carlos@email.com",
    phone: "(11) 98765-7890",
    totalAppointments: 20,
    completedAppointments: 18,
    cancelledAppointments: 2,
    lastVisit: "2025-10-22",
    registeredDate: "2023-08-12",
  },
])
