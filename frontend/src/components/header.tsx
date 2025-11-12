"use client"

import { Button } from "@/components/ui/button"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { bookingModalOpenAtom, userAtom, isAuthenticatedAtom } from "@/lib/store"
import Link from "next/link"
import { User, LogOut, Calendar } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function Header() {
  const router = useRouter()
  const setBookingModalOpen = useSetAtom(bookingModalOpenAtom)
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const [user, setUser] = useAtom(userAtom)

  const handleLogout = () => {
    setUser(null)
    router.push("/")
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">B</span>
          </div>
          <span className="text-xl font-bold text-foreground">Barbearia</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="/#inicio" className="text-foreground hover:text-primary transition-colors">
            Início
          </a>
          <Link href="/services" className="text-foreground hover:text-primary transition-colors">
            Serviços
          </Link>
          <Link href="/barbers" className="text-foreground hover:text-primary transition-colors">
            Barbeiros
          </Link>
          <Link href="/plans" className="text-foreground hover:text-primary transition-colors">
            Planos
          </Link>
          <a href="/#contato" className="text-foreground hover:text-primary transition-colors">
            Contato
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/appointments" className="cursor-pointer">
                    <Calendar className="mr-2 h-4 w-4" />
                    Meus Agendamentos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
          )}

          <Button
            onClick={() => setBookingModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Agendar Horário
          </Button>
        </div>
      </div>
    </header>
  )
}
