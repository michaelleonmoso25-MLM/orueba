// Módulo de Mercado Pago: agrupa el controlador, el servicio y las dependencias para procesar pagos

import { Module } from '@nestjs/common';                                     // Decorador para definir un módulo de NestJS
import { MercadoPagoService } from './mercado_pago.service';                 // Servicio con la lógica de pagos y llamadas a Mercado Pago
import { MercadoPagoController } from './mercado_pago.controller';           // Controlador con las rutas /mercadopago
import { HttpModule } from '@nestjs/axios';                                  // Módulo que provee HttpService para hacer peticiones HTTP a la API de Mercado Pago
import { TypeOrmModule } from '@nestjs/typeorm';                             // Módulo de TypeORM para acceder a la base de datos
import { Order } from '../orders/entities/order.entity';                     // Entidad de la tabla 'orders'
import { OrderHasProducts } from '../orders/dto/order_has_products.entity';  // Entidad de la tabla intermedia 'order_has_products'

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([ Order, OrderHasProducts])], // HttpModule para llamar a Mercado Pago; forFeature registra los repositorios de Order y OrderHasProducts para guardar la orden al pagar
  providers: [MercadoPagoService],                                             // Servicios que este módulo crea e inyecta
  controllers: [MercadoPagoController]                                         // Controladores que exponen las rutas HTTP de este módulo
})
export class MercadoPagoModule {} // Clase del módulo; se importa en app.module.ts para activarlo
