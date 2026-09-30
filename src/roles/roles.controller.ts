import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service.js';
import { CreateRolDto } from './dto/create-rol.dto.js';
import { HasRoles } from '../auth/jwt/has-roles.js';
import { JwtRole } from '../auth/jwt/jwt-role.js';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard.js';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard.js';

@Controller('roles')
export class RolesController {

    constructor(private rolesService: RolesService) {}

    @HasRoles(JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post()
    create(@Body() rol: CreateRolDto) {
        return this.rolesService.create(rol);
    }

}
