import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderHasProducts } from './dto/order_has_products.entity';
import { User } from '../users/entities/user.entity';
import { Address } from '../address/entities/address.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ Order, OrderHasProducts, User, Address ]) ],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}