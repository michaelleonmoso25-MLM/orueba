import { Module } from '@nestjs/common';
import { RolesService } from './roles.service.js';
import { RolesController } from './roles.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity.js';
import { User } from '../users/entities/user.entity.js';
import { JwtStrategy } from '../auth/jwt/jwt.strategy.js';


@Module({
  imports: [ TypeOrmModule.forFeature([ Rol, User ]) ],
  providers: [RolesService, JwtStrategy],
  controllers: [RolesController]
})
export class RolesModule {}
