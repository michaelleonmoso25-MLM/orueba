import { Controller, UseGuards, Param, Body, ParseIntPipe, ParseFloatPipe, Post, Get } from '@nestjs/common'; // Decoradores de NestJS para definir rutas, guards, leer parámetros/cuerpo y convertir parámetros a número
import { HasRoles } from '../auth/jwt/has-roles';            // Decorador que indica qué roles pueden usar cada ruta
import { JwtRole } from '../auth/jwt/jwt-role';              // Enum con los roles del sistema (ADMIN, CLIENT)
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';   // Guard que exige un token JWT válido en la petición
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard'; // Guard que verifica que el rol del usuario esté permitido
import { MercadoPagoService } from './mercado_pago.service'; // Servicio con la lógica de Mercado Pago
import type { CardTokenBody } from './models/card_token_body'; // Tipo del cuerpo para crear el token de tarjeta
import type { PaymentBody } from './models/payment_body';      // Tipo del cuerpo para crear un pago


// Prefijo de ruta base: http://localhost:3000/mercadopago
@Controller('mercadopago') // Todas las rutas de esta clase empiezan con /mercadopago
export class MercadoPagoController {

    constructor(private mercadoPagoService: MercadoPagoService) {} // NestJS inyecta automáticamente el servicio de Mercado Pago

    // GET http://localhost:3000/mercadopago/identification_types
    // Consulta los tipos de identificación válidos de Mercado Pago (ej. CC, DNI, RFC)
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)  // Permitido para administradores y clientes
    @UseGuards(JwtAuthGuard, JwtRolesGuard)   // Valida primero el token JWT y luego el rol
    @Get('identification_types')              // Responde a peticiones GET en /mercadopago/identification_types
    getIdentificationTypes() {
        return this.mercadoPagoService.getIdentificationTypes(); // Devuelve la lista de tipos de documento
    }

    // GET http://localhost:3000/mercadopago/installments/:first_six_digits/:amount
    // Consulta las opciones de cuotas disponibles para una tarjeta según los primeros 6 dígitos y el monto
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)       // Permitido para administradores y clientes
    @UseGuards(JwtAuthGuard, JwtRolesGuard)        // Valida primero el token JWT y luego el rol
    @Get('installments/:first_six_digits/:amount') // Ruta GET con dos parámetros en la URL
    getInstallments(
        @Param('first_six_digits', ParseIntPipe) firstSixDigits: number, // Primeros 6 dígitos de la tarjeta (BIN), tomados de la URL y convertidos a entero (responde 400 si no es un número)
        @Param('amount', ParseFloatPipe) amount: number                  // Monto total de la compra, tomado de la URL y convertido a decimal (responde 400 si no es un número)
    ) {
        console.log('firstSixDigits', firstSixDigits); // Muestra en consola los dígitos recibidos (para depuración)
        console.log('amount', amount);                 // Muestra en consola el monto recibido (para depuración)

        return this.mercadoPagoService.getInstallments(firstSixDigits, amount); // Devuelve las cuotas disponibles para esa tarjeta y monto
    }

    // POST http://localhost:3000/mercadopago/card_token
    // Genera el token seguro de la tarjeta de crédito/débito directamente con Mercado Pago
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT) // Permitido para administradores y clientes
    @UseGuards(JwtAuthGuard, JwtRolesGuard)  // Valida primero el token JWT y luego el rol
    @Post('card_token')                      // Responde a peticiones POST en /mercadopago/card_token
    createCardToken(@Body() cardTokenBody: CardTokenBody) { // Recibe en el cuerpo los datos de la tarjeta
        return this.mercadoPagoService.createCardToken(cardTokenBody); // Devuelve el token generado por Mercado Pago
    }

    // POST http://localhost:3000/mercadopago/payments
    // Guarda la orden en la BD (orders y order_has_products) y procesa el cobro en Mercado Pago
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT) // Permitido para administradores y clientes
    @UseGuards(JwtAuthGuard, JwtRolesGuard)  // Valida primero el token JWT y luego el rol
    @Post('payments')                        // Responde a peticiones POST en /mercadopago/payments
    createPayment(@Body() paymentBody: PaymentBody) { // Recibe en el cuerpo los datos del pago y de la orden
        return this.mercadoPagoService.createPayment(paymentBody); // Guarda la orden y devuelve la respuesta del pago de Mercado Pago
    }
}
