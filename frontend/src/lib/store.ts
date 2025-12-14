import { atom } from "jotai";

export const bookingModalOpenAtom = atom(false);
export const selectedServiceAtom = atom<string | null>(null);
export const selectedBarberAtom = atom<string | null>(null);

export const supportModalOpenAtom = atom(false);
export const paymentModalOpenAtom = atom(false);
export const selectedPlanAtom = atom<string | null>(null);

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "client" | "admin" | "barber";
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  lastVisit: string;
  registeredDate: string;
}

export interface Barber {
  id: string;
  name: string;
  role: string;
  image: string;
  specialties: string[];
  email: string;
  phone: string;
  status: "active" | "inactive";
  hireDate: string;
}

export interface Appointment {
  id: string;
  service: string;
  barber: string;
  date: string;
  time: string;
  status: "confirmed" | "completed" | "cancelled";
  price: string;
}

export interface Service {
  id: string;
  name: string;
  price: string;
  duration: string;
}

export interface BarberSchedule {
  barberId: string;
  barberName: string;
  schedule: {
    dayOfWeek: number;
    dayName: string;
    isAvailable: boolean;
    startTime: string;
    endTime: string;
    breakStart?: string;
    breakEnd?: string;
  }[];
}

export const userAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);
export const isAdminAtom = atom((get) => {
  const user = get(userAtom);
  return user?.role === "admin" || user?.role === "barber";
});

export const servicesAtom = atom<Service[]>([]);
export const barbersAtom = atom<Barber[]>([])

export const appointmentsAtom = atom<Appointment[]>([]);

export const barberSchedulesAtom = atom<BarberSchedule[]>([]);

export const clientsAtom = atom<Client[]>([]);
