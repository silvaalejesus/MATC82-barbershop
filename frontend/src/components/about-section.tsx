export function AboutSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <img
                src="/professional-haircut.png"
                alt="Barbeiro cortando cabelo"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <img
              src="/barbershop-tools-scissors-razor.jpg"
              alt="Ferramentas de barbearia"
              className="w-full h-48 object-cover rounded-lg"
            />
            <img
              src="/barber-styling-beard-trim.jpg"
              alt="Barbeiro fazendo barba"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>

          <div>
            <h2 className="text-4xl font-bold text-foreground mb-6">Sobre</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Somos uma barbearia moderna que combina técnicas tradicionais com as últimas tendências em cortes
              masculinos. Nossa equipe de profissionais altamente qualificados está pronta para oferecer a melhor
              experiência em cuidados pessoais.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Com mais de 10 anos de experiência, nos dedicamos a proporcionar não apenas um corte de cabelo, mas uma
              experiência completa de bem-estar e estilo.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Venha nos visitar e descubra por que somos a escolha número um dos homens que valorizam qualidade e
              profissionalismo.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
