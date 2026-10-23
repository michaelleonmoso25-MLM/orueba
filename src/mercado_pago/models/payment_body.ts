import { Identification } from "./card_holder";                    // Modelo del documento de identidad
import { CreateOrderDto } from '../../orders/dto/create-order.dto'; // Datos de la orden que se guarda en la BD

// Cuerpo que recibe POST /mercadopago/payments desde la app
export interface PaymentBody {
    transaction_amount: number;         // Monto total a cobrar (máximo 2 decimales)
    token:              string;         // Token de la tarjeta obtenido en POST /card_token
    installments:       number;         // Número de cuotas elegido por el cliente
    issuer_id:          string;         // ID del banco emisor (viene de la consulta de cuotas)
    payment_method_id:  string;         // Marca de la tarjeta (ej. "visa", "master")
    payer:              Payer;          // Datos de la persona que paga
    order: CreateOrderDto               // Orden a registrar (cliente, dirección y productos); no se envía a Mercado Pago
}

// Persona que realiza el pago
export interface Payer {
    email:          string;         // Correo del pagador; Mercado Pago lo usa para enviar el comprobante
    identification: Identification; // Documento de identidad del pagador
}