import { Cardholder, Identification } from "./card_holder"; // Modelos del titular y su documento

// Respuesta de Mercado Pago al crear un pago (POST /payments)
// Los campos con tipo "null" son los que Mercado Pago devolvió vacíos en la respuesta de ejemplo
export interface PaymentResponse {
    id:                          number;             // ID único del pago en Mercado Pago
    date_created:                Date;               // Fecha en que se creó el pago
    date_approved:               Date;               // Fecha en que se aprobó el pago
    date_last_updated:           Date;               // Fecha de la última actualización del pago
    date_of_expiration:          null;               // Fecha de vencimiento (solo aplica a pagos en efectivo)
    money_release_date:          Date;               // Fecha en que el dinero queda disponible para el vendedor
    money_release_status:        null;               // Estado de la liberación del dinero
    operation_type:              string;             // Tipo de operación (ej. "regular_payment")
    issuer_id:                   string;             // ID del banco emisor de la tarjeta
    payment_method_id:           string;             // Marca de la tarjeta usada (ej. "visa")
    payment_type_id:             string;             // Tipo de pago (ej. "credit_card", "debit_card")
    payment_method:              PaymentMethod;      // Medio de pago usado (ID y tipo)
    status:                      string;             // Estado del pago: "approved", "rejected", "in_process", etc.
    status_detail:               string;             // Motivo del estado (ej. "accredited", "cc_rejected_insufficient_amount")
    currency_id:                 string;             // Moneda del pago (ej. "COP", "MXN", "ARS")
    description:                 null;               // Descripción del pago enviada al crearlo
    live_mode:                   boolean;            // true = producción, false = modo de prueba (sandbox)
    sponsor_id:                  null;               // ID del patrocinador o plataforma asociada
    authorization_code:          null;               // Código de autorización del banco
    money_release_schema:        null;               // Esquema de liberación del dinero
    taxes_amount:                number;             // Total de impuestos cobrados
    counter_currency:            null;               // Moneda de conversión, si hubo cambio de moneda
    brand_id:                    null;               // ID de la marca asociada al pago
    shipping_amount:             number;             // Costo de envío incluido en el pago
    build_version:               string;             // Versión interna de la API de Mercado Pago que procesó el pago
    pos_id:                      null;               // ID del punto de venta físico
    store_id:                    null;               // ID de la sucursal
    integrator_id:               null;               // ID del integrador certificado
    platform_id:                 null;               // ID de la plataforma (ej. e-commerce externo)
    corporation_id:              null;               // ID de la corporación
    payer:                       Payer;              // Datos del pagador
    collector_id:                number;             // ID de la cuenta de Mercado Pago que recibe el dinero (tu cuenta)
    marketplace_owner:           null;               // Dueño del marketplace, si aplica
    metadata:                    Metadata;           // Datos extra enviados por el comercio al crear el pago
    additional_info:             AdditionalInfo;     // Información adicional del procesamiento
    order:                       Metadata;           // Orden de Mercado Pago asociada (vacía si no se usó)
    external_reference:          null;               // Referencia propia del comercio (ej. ID de la orden en tu BD)
    transaction_amount:          number;             // Monto cobrado
    net_amount:                  number;             // Monto neto sin impuestos
    taxes:                       Tax[];              // Detalle de los impuestos aplicados
    transaction_amount_refunded: number;             // Monto devuelto al cliente
    coupon_amount:               number;             // Descuento aplicado por cupón
    differential_pricing_id:     null;               // ID de precio diferencial (promociones de cuotas)
    financing_group:             null;               // Grupo de financiamiento
    deduction_schema:            null;               // Esquema de deducción de comisiones
    installments:                number;             // Número de cuotas del pago
    transaction_details:         TransactionDetails; // Detalle de montos de la transacción
    fee_details:                 FeeDetail[];        // Comisiones cobradas por Mercado Pago
    charges_details:             any[];              // Detalle de cargos adicionales
    captured:                    boolean;            // Indica si el dinero ya fue capturado (cobrado)
    binary_mode:                 boolean;            // true = el pago solo puede quedar aprobado o rechazado, sin pendientes
    call_for_authorize_id:       null;               // ID para autorizar el pago llamando al banco
    statement_descriptor:        string;             // Texto que aparece en el extracto de la tarjeta del cliente
    card:                        Card;               // Datos de la tarjeta usada
    notification_url:            null;               // URL a la que Mercado Pago envía notificaciones (webhook)
    refunds:                     any[];              // Lista de devoluciones realizadas
    processing_mode:             string;             // Modo de procesamiento (ej. "aggregator")
    merchant_account_id:         null;               // Cuenta del comercio
    merchant_number:             null;               // Número de comercio
    acquirer_reconciliation:     any[];              // Datos de conciliación con el adquirente
    point_of_interaction:        PointOfInteraction; // Desde dónde se originó el pago
    tags:                        null;               // Etiquetas del pago
}

// Información adicional del procesamiento del pago
export interface AdditionalInfo {
    available_balance:   null; // Saldo disponible
    nsu_processadora:    null; // Número secuencial de la procesadora (usado en Brasil)
    authentication_code: null; // Código de autenticación del pago
}

// Datos de la tarjeta con la que se pagó
export interface Card {
    id:                null;       // ID de la tarjeta guardada (null si no se guardó)
    first_six_digits:  string;     // Primeros 6 dígitos de la tarjeta
    last_four_digits:  string;     // Últimos 4 dígitos de la tarjeta
    expiration_month:  number;     // Mes de vencimiento
    expiration_year:   number;     // Año de vencimiento
    date_created:      Date;       // Fecha de creación del registro de la tarjeta
    date_last_updated: Date;       // Fecha de la última actualización
    cardholder:        Cardholder; // Nombre y documento del titular
}


// Comisión cobrada sobre el pago
export interface FeeDetail {
    type:      string; // Tipo de comisión (ej. "mercadopago_fee")
    amount:    number; // Valor de la comisión
    fee_payer: string; // Quién paga la comisión: "collector" (vendedor) o "payer" (comprador)
}

// Objeto libre sin campos definidos
export interface Metadata {
}

// Persona que realizó el pago
export interface Payer {
    first_name:     null;           // Nombre del pagador
    last_name:      null;           // Apellido del pagador
    email:          string;         // Correo del pagador
    identification: Identification; // Documento de identidad del pagador
    phone:          Phone;          // Teléfono del pagador
    type:           null;           // Tipo de pagador (ej. "customer", "guest")
    entity_type:    null;           // Tipo de entidad: "individual" (persona) o "association" (empresa)
    id:             string;         // ID del pagador en Mercado Pago
}

// Teléfono del pagador
export interface Phone {
    area_code: null; // Código de área
    number:    null; // Número de teléfono
    extension: null; // Extensión
}

// Medio de pago usado
export interface PaymentMethod {
    id:   string; // Marca del medio de pago (ej. "visa")
    type: string; // Tipo de medio de pago (ej. "credit_card")
}

// Origen del pago
export interface PointOfInteraction {
    type:          string;       // Tipo de origen (ej. "UNSPECIFIED")
    business_info: BusinessInfo; // Unidad de negocio que procesó el pago
}

// Unidad de negocio de Mercado Pago que procesó el pago
export interface BusinessInfo {
    unit:     string; // Unidad principal (ej. "online_payments")
    sub_unit: string; // Subunidad (ej. "default")
}

// Impuesto aplicado al pago
export interface Tax {
    value: number; // Valor del impuesto
    type:  string; // Tipo de impuesto (ej. "IVA")
}

// Detalle de los montos de la transacción
export interface TransactionDetails {
    payment_method_reference_id: null;   // Referencia del medio de pago (ej. código de boleto)
    acquirer_reference:          null;   // Referencia del adquirente
    net_received_amount:         number; // Monto que recibe el vendedor después de comisiones
    total_paid_amount:           number; // Monto total pagado por el cliente (con intereses)
    overpaid_amount:             number; // Monto pagado de más
    external_resource_url:       null;   // URL externa (ej. comprobante para pagar en efectivo)
    installment_amount:          number; // Valor de cada cuota
    financial_institution:       null;   // Institución financiera (para transferencias)
    payable_deferral_period:     null;   // Periodo de diferimiento del pago
}