import { PartialType } from '@nestjs/mapped-types';
import { CreateRolDto } from './create-rol.dto.js';

export class UpdateRoleDto extends PartialType(CreateRolDto) {}
