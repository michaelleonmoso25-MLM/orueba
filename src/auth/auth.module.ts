import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt/jwt.constants.js';
import { JwtStrategy } from './jwt/jwt.strategy.js';
import { RolesService } from '../roles/roles.service.js';
import { Rol } from '../roles/entities/rol.entity.js';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([User, Rol]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2d' },//tiempo de expiración del token
    }),
  ],
  providers: [AuthService, RolesService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
