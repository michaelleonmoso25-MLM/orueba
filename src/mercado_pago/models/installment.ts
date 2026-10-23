// Opciones de cuotas para una tarjeta (GET /payment_methods/installments)
export interface Installment {
    payment_method_id:   string;      // Marca de la tarjeta (ej. "visa", "master")
    payment_type_id:     string;      // Tipo de tarjeta: "credit_card" o "debit_card"
    issuer:              Issuer;      // Banco o entidad que emitió la tarjeta
    processing_mode:     string;      // Modo de procesamiento del pago (ej. "aggregator")
    merchant_account_id: null;        // Cuenta del comercio; Mercado Pago lo devuelve como null
    payer_costs:         PayerCost[]; // Lista de planes de cuotas disponibles
    agreements:          null;        // Convenios especiales con el banco; normalmente null
}

// Banco o entidad emisora de la tarjeta
export interface Issuer {
    id:               string; // Identificador del emisor; se envía como "issuer_id" al crear el pago
    name:             string; // Nombre del banco o emisor
    secure_thumbnail: string; // URL HTTPS del logo del emisor
    thumbnail:        string; // URL HTTP del logo del emisor
}

// Un plan de cuotas (ej. 3 cuotas de $100)
export interface PayerCost {
    installments:               number;                     // Número de cuotas del plan
    installment_rate:           number;                     // Porcentaje de interés del plan (0 = sin interés)
    discount_rate:              number;                     // Porcentaje de descuento aplicado
    reimbursement_rate:         null;                       // Porcentaje de reembolso; normalmente null
    labels:                     string[];                   // Etiquetas extra del plan (ej. "CFT_0,00%")
    installment_rate_collector: InstallmentRateCollector[]; // Quién cobra el interés de las cuotas
    min_allowed_amount:         number;                     // Monto mínimo permitido para este plan
    max_allowed_amount:         number;                     // Monto máximo permitido para este plan
    recommended_message:        string;                     // Texto listo para mostrar (ej. "3 cuotas de $ 100,00")
    installment_amount:         number;                     // Valor de cada cuota
    total_amount:               number;                     // Monto total a pagar incluyendo intereses
    payment_method_option_id:   PaymentMethodOptionID;      // Identificador interno de la opción de pago
}

// Quién recibe el interés de las cuotas
export enum InstallmentRateCollector {
    Mercadopago = "MERCADOPAGO", // El interés lo cobra Mercado Pago
    ThirdParty = "THIRD_PARTY",  // El interés lo cobra un tercero (ej. el banco)
}

// Identificadores de opción de pago (valor generado automáticamente a partir de una respuesta de ejemplo)
export enum PaymentMethodOptionID {
    The1AQokODLLZjQyNjktYjAzMy00OWU1LWJhMWQtNDE0NjQyNTM3MzY4EJaFuevHLg = "1.AQokODllZjQyNjktYjAzMy00OWU1LWJhMWQtNDE0NjQyNTM3MzY4EJaFuevHLg", // Único valor visto en la respuesta de ejemplo
}