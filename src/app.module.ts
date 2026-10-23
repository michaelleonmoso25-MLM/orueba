import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { AddressModule } from './address/address.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { MercadoPagoModule } from './mercado_pago/mercado_pago.module';

@Module({
  imports: [
    // forRootAsync para que lea las variables del .env cuando ya están cargadas
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mssql',
        host: process.env.DB_HOST, // O la IP de tu servidor de SQL Server
        port: Number(process.env.DB_PORT), // Puerto por defecto de SQL Server
        username: process.env.DB_USER, // Tu usuario de SQL Server
        password: process.env.DB_PASSWORD, // Tu contraseña de SQL Server
        database: process.env.DB_NAME, // Creada con database/ecommerce_db.sql
        autoLoadEntities: true,
        synchronize: true, // Las tablas ya existen, no dejar que TypeORM las modifique
        options: {
          encrypt: false, // Cámbialo a true si estás conectándote a Azure SQL
          trustServerCertificate: true, // Necesario para conexiones locales
        },
      }),
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    OrdersModule,
    AddressModule,
    CategoriesModule,
    ProductsModule,
    MercadoPagoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}