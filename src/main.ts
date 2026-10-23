import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  process.loadEnvFile(); // carga las variables del archivo .env
  const app = await NestFactory.create(AppModule);
  // Activa los decoradores de class-validator (@IsNotEmpty, @IsEmail...) en los DTOs:
  // si faltan datos responde 400 con el detalle, en lugar de un error 500
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
