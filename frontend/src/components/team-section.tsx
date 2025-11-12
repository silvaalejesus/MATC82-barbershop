import { Card, CardContent } from "@/components/ui/card"
import { Facebook, Instagram, Twitter } from "lucide-react"

const teamMembers = [
  {
    name: "Carlos Silva",
    role: "Barbeiro Master",
    image: "/professional-barber-portrait-male.jpg",
    social: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
    },
  },
  {
    name: "João Santos",
    role: "Especialista em Barba",
    image: "/barber-specialist-portrait-male.jpg",
    social: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
    },
  },
  {
    name: "Pedro Costa",
    role: "Barbeiro Sênior",
    image: "/senior-barber-portrait-male.jpg",
    social: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
    },
  },
]

export function TeamSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Nossa Equipe</h2>
          <p className="text-muted-foreground">Profissionais experientes e dedicados</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.name} className="bg-card border-border overflow-hidden">
              <div className="relative h-80">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                <p className="text-muted-foreground mb-4">{member.role}</p>
                <div className="flex justify-center gap-4">
                  <a href={member.social.facebook} className="text-foreground hover:text-primary transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href={member.social.instagram} className="text-foreground hover:text-primary transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href={member.social.twitter} className="text-foreground hover:text-primary transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
