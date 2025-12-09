import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
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

  // Porta 3001 para não conflitar com o Frontend (3000)
  await app.listen(process.env.PORT ?? 3001);
  console.log(`Backend rodando em: ${await app.getUrl()}`);
}
bootstrap();

