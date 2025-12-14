"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { userAtom } from "@/lib/store";
import { useSetAtom } from "jotai";
import {
  BarChart3,
  Calendar,
  LayoutDashboard,
  LogOut,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const isAdmin = useAtomValue(isAdminAtom);
  const router = useRouter();
  const setUser = useSetAtom(userAtom);
  // console.log("isAdmin:", isAdmin);
  const isAdmin = true;
  useEffect(() => {
    if (!isAdmin) {
      router.push("/admin/login");
    }
  }, [isAdmin, router]);

  const handleLogout = () => {
    localStorage.removeItem("barber-user-id"); // Limpa a persistência
    setUser(null); // Limpa o estado
    router.push("/login");
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-card border-r border-border">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
          </div>
          <nav className="space-y-1 px-3">
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/barbers">
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Barbeiros
              </Button>
            </Link>
            <Link href="/admin/schedule">
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Horários
              </Button>
            </Link>
            <Link href="/admin/clients">
              <Button variant="ghost" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Clientes
              </Button>
            </Link>
            <Link href="/admin/profile">
              <Button variant="ghost" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Meu Perfil
              </Button>
            </Link>
          </nav>
          <div className="absolute bottom-4 left-3 right-3">
            <Button
              variant="ghost"
              className="justify-start text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
