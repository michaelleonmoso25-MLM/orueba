import { IsNotEmpty, IsOptional, IsString } from "class-validator";

// Todos los campos son opcionales: si se envían, no pueden ir vacíos
export class UpdateUserDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    lastname?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    phone?: string;

    image?: string;
    notification_token?: string;
}
