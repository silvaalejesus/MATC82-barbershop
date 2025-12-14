import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS para o frontend poder chamar
  app.enableCors({
    origin: 'http://localhost:3000', // URL do frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Validação global de DTOs
  app.useGlobalPipes(new ValidationPipe());

  // --- Configuração do Swagger e Scalar ---

  // 1. Configuração do DocumentBuilder
  const config = new DocumentBuilder()
    .setTitle('Barbershop API')
    .setDescription('Documentação da API do sistema de barbearia')
    .setVersion('1.0')
    .addBearerAuth() // Adiciona suporte a autenticação Bearer (JWT) se precisar
    .build();

  // 2. Criação do Documento OpenAPI
  const document = SwaggerModule.createDocument(app, config);

  // 3. Expor o JSON da API em /api-json
  app.getHttpAdapter().get('/api-json', (req, res) => {
    res.json(document);
  });

  // 4. Configurar a interface Scalar em /docs
  app.use(
    '/docs',
    apiReference({
      spec: {
        content: document,
      },
    }),
  );

  // ----------------------------------------

  // Porta 3001 para não conflitar com o Frontend (3000)
  await app.listen(process.env.PORT ?? 3001);
  console.log(`Backend rodando em: ${await app.getUrl()}`);
  console.log(`Documentação Scalar disponível em: ${await app.getUrl()}/docs`);
  console.log(`JSON OpenAPI disponível em: ${await app.getUrl()}/api-json`);
}
bootstrap();
