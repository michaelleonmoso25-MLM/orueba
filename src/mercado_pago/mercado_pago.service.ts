import { HttpService } from '@nestjs/axios';                                       // Servicio de NestJS para hacer peticiones HTTP (usa Axios por dentro)
import { Injectable, HttpException } from '@nestjs/common';                         // Injectable marca la clase como servicio; HttpException para responder errores HTTP
import { AxiosResponse, AxiosError } from 'axios';                                  // Tipos de la respuesta y del error de Axios
import { Observable, catchError, map } from 'rxjs';                                 // Observable es el resultado de HttpService; catchError captura errores; map transforma la respuesta
import { MERCADO_PAGO_API, MERCADO_PAGO_HEADERS } from '../config/config';          // URL base de la API de Mercado Pago y cabeceras con el Access Token
import type { IdentificationType } from './models/identification_type';             // Tipo de documento de identidad
import type { Installment } from './models/installment';                            // Opciones de cuotas de una tarjeta
import type { CardTokenBody } from './models/card_token_body';                      // Datos para crear el token de tarjeta
import type { CardTokenResponse } from './models/card_token_response';              // Respuesta al crear el token de tarjeta
import type { PaymentResponse } from './models/payment_response';                   // Respuesta al crear un pago
import type { PaymentBody } from './models/payment_body';                           // Datos que llegan para crear un pago
import { Repository } from 'typeorm';                                               // Repositorio de TypeORM para leer y guardar en una tabla
import { Order } from '../orders/entities/order.entity';                            // Entidad de la tabla 'orders'
import { InjectRepository } from '@nestjs/typeorm';                                 // Decorador para inyectar el repositorio de una entidad
import { OrderHasProducts } from '../orders/dto/order_has_products.entity';         // Entidad de la tabla intermedia 'order_has_products'

// Convierte un error de Axios en una HttpException de Nest
function toHttpException(error: AxiosError): HttpException {
    const data = error.response?.data as string | Record<string, any> | undefined;                           // Cuerpo del error que devolvió Mercado Pago (puede no existir si no hubo respuesta)
    return new HttpException(data || 'Error en el servicio de Mercado Pago', error.response?.status || 500); // Usa el mensaje y el código de Mercado Pago; si no hay, responde 500 con un mensaje genérico
}

@Injectable() // Permite que NestJS cree este servicio y lo inyecte en el controlador
export class MercadoPagoService {

    constructor(
        private readonly httpService: HttpService,                                                              // Cliente HTTP para llamar a la API de Mercado Pago
        @InjectRepository(Order) private ordersRepository: Repository<Order>,                                   // Acceso a la tabla 'orders'
        @InjectRepository(OrderHasProducts) private ordersHasProductsRepository: Repository<OrderHasProducts>, // Acceso a la tabla 'order_has_products'
    ) {}

    // Consulta los tipos de documento de identidad válidos (GET /identification_types)
    getIdentificationTypes(): Observable<IdentificationType[]> {
        return this.httpService.get<IdentificationType[]>(MERCADO_PAGO_API + '/identification_types', { headers: MERCADO_PAGO_HEADERS }).pipe( // Hace la petición GET con el Access Token
            catchError((error: AxiosError) => {   // Si Mercado Pago responde con error...
                throw toHttpException(error);     // ...lo convierte en un error HTTP de Nest
            })
        ).pipe(map((resp) => resp.data));         // Devuelve solo el cuerpo de la respuesta (la lista de tipos)
    }

    // Consulta las cuotas disponibles para una tarjeta y un monto (GET /payment_methods/installments)
    getInstallments(firstSixDigits: number, amount: number): Observable<Installment> {
        return this.httpService.get<Installment[]>(MERCADO_PAGO_API + `/payment_methods/installments?bin=${firstSixDigits}&amount=${amount}`, { headers: MERCADO_PAGO_HEADERS }).pipe( // Envía el BIN (6 dígitos) y el monto como parámetros de la URL
            catchError((error: AxiosError) => {   // Si Mercado Pago responde con error...
                throw toHttpException(error);     // ...lo convierte en un error HTTP de Nest
            })
        ).pipe(map((resp: AxiosResponse<Installment[]>) => resp.data[0])); // Mercado Pago devuelve una lista; se toma el primer resultado (el de la tarjeta consultada)
    }

    // Genera el token seguro de la tarjeta (POST /card_tokens)
    createCardToken(cardTokenBody: CardTokenBody): Observable<CardTokenResponse> {
        return this.httpService.post(
            MERCADO_PAGO_API + `/card_tokens?public_key=TEST-8568eec6-7fc0-48dc-b15a-d6a9278057e1`, // URL del endpoint con la Public Key de prueba
            cardTokenBody,                                                                           // Datos de la tarjeta (número, vencimiento, CVV, titular)
            { headers: MERCADO_PAGO_HEADERS }                                                        // Cabeceras con el Access Token
        ).pipe(
            catchError((error: AxiosError) => {   // Si Mercado Pago responde con error...
                throw toHttpException(error);     // ...lo convierte en un error HTTP de Nest
            })
        ).pipe(map((resp: AxiosResponse<CardTokenResponse>) => resp.data)); // Devuelve solo el cuerpo de la respuesta (el token y sus datos)
    }

    // Procesa el pago en Mercado Pago y registra la orden en la base de datos
    async createPayment(paymentBody: PaymentBody): Promise<Observable<PaymentResponse>> {
        console.log('--- Petición recibida en createPayment ---'); // Marca en consola el inicio de la petición (para depuración)
        console.log(JSON.stringify(paymentBody, null, 2));         // Muestra en consola el cuerpo recibido con formato legible

        if (!paymentBody.order || !paymentBody.order.id_client || !paymentBody.order.id_address || !paymentBody.order.products) { // Verifica que venga la orden con cliente, dirección y productos
            throw new HttpException('Falta el objeto "order" o alguno de sus campos obligatorios ("id_client", "id_address", "products")', 400); // Si falta algo, responde 400 (petición incorrecta)
        }

        // Normalizamos los datos numéricos enviados a Mercado Pago.
        // `transaction_amount` debe ser numérico y con máximo 2 decimales;
        // un redondeo previo evita el error 4037 (Invalid transaction_amount)
        // causado por imprecisiones de punto flotante (ej. 100.10000000000001).
        paymentBody.transaction_amount = Math.round(Number(paymentBody.transaction_amount) * 100) / 100; // Convierte el monto a número y lo redondea a 2 decimales
        if (!Number.isFinite(paymentBody.transaction_amount) || paymentBody.transaction_amount <= 0) {  // Si el monto no es un número válido o no es positivo...
            throw new HttpException('transaction_amount debe ser un número mayor que 0', 400);           // ...responde 400
        }
        paymentBody.installments = Number(paymentBody.installments);                // Asegura que las cuotas sean un número
        if (paymentBody.issuer_id !== undefined && paymentBody.issuer_id !== null) { // Si viene el ID del banco emisor...
            paymentBody.issuer_id = String(paymentBody.issuer_id);                   // ...lo convierte a texto, como lo espera Mercado Pago
        }

        // Separamos 'order' del resto del cuerpo para enviar a Mercado Pago solo los datos que su API espera
        const { order, ...mercadoPagoBody } = paymentBody; // 'order' queda aparte; 'mercadoPagoBody' tiene el resto de los campos

        // 1. Creamos y guardamos la orden en la tabla 'orders' con los datos recibidos (id_client, id_address)
        const newOrder = this.ordersRepository.create(order);          // Crea el objeto de la orden (todavía no se guarda)
        const savedOrder = await this.ordersRepository.save(newOrder); // Guarda la orden en la BD y obtiene su ID generado

        // 2. Registramos cada producto de la orden en la tabla intermedia 'order_has_products'
        for (const product of order.products) {                 // Recorre cada producto de la orden
            const ohp = new OrderHasProducts();                 // Crea un registro nuevo de la tabla intermedia
            ohp.id_order = savedOrder.id;                       // Lo asocia a la orden recién guardada
            ohp.id_product = product.id;                        // ID del producto comprado
            ohp.quantity = product.quantity;                    // Cantidad de unidades compradas
            await this.ordersHasProductsRepository.save(ohp);   // Guarda el registro en la BD
        }

        // 3. Enviamos la petición de pago a la API de Mercado Pago
        return this.httpService.post(
            MERCADO_PAGO_API + '/payments',   // Endpoint para crear pagos
            mercadoPagoBody,                  // Datos del pago (monto, token, cuotas, emisor, pagador) sin la orden
            { headers: MERCADO_PAGO_HEADERS } // Cabeceras con el Access Token
        ).pipe(
            catchError((error: AxiosError) => {                                                       // Si Mercado Pago rechaza la petición...
                console.error('Error detallado de Mercado Pago:', error.response?.data || error.message); // ...muestra en consola el detalle del error
                throw toHttpException(error);                                                          // ...y lo devuelve como error HTTP
            })
        ).pipe(map((resp: AxiosResponse<PaymentResponse>) => resp.data)); // Devuelve solo el cuerpo de la respuesta (estado y datos del pago)
    }


}
