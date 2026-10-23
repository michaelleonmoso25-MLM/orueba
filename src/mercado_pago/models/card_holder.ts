// Modelos del titular de la tarjeta, compartidos por varios modelos de Mercado Pago

// Datos de la persona dueña de la tarjeta
export interface Cardholder {
    identification: Identification; // Documento de identidad del titular
    name: string;                   // Nombre del titular tal como aparece impreso en la tarjeta
}

// Documento de identidad de una persona
export interface Identification {
    number: string; // Número del documento (ej. "12345678")
    type:   string; // Tipo de documento según Mercado Pago (ej. "CC", "DNI", "RFC")
}

