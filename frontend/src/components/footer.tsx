import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer id="contato" className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">B</span>
            </div>
            <span className="text-2xl font-bold text-foreground">Barbearia</span>
          </div>

          <div className="flex gap-6">
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              <Twitter className="w-6 h-6" />
            </a>
          </div>

          <p className="text-muted-foreground text-center">© 2025 Barbearia. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
