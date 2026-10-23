import { Cardholder } from "./card_holder"; // Modelo del titular de la tarjeta

// Respuesta de Mercado Pago al crear el token de una tarjeta (POST /card_tokens)
export interface CardTokenResponse {
    id:                   string;     // Token de la tarjeta; se usa como "token" al crear el pago
    public_key:           string;     // Clave pública con la que se generó el token
    first_six_digits:     string;     // Primeros 6 dígitos de la tarjeta (BIN), identifican al banco y la marca
    expiration_month:     number;     // Mes de vencimiento de la tarjeta
    expiration_year:      number;     // Año de vencimiento de la tarjeta
    last_four_digits:     string;     // Últimos 4 dígitos de la tarjeta, para mostrarlos al usuario
    cardholder:           Cardholder; // Nombre y documento del titular
    status:               string;     // Estado del token (ej. "active")
    date_created:         Date;       // Fecha en que se creó el token
    date_last_updated:    Date;       // Fecha de la última actualización del token
    date_due:             Date;       // Fecha en que el token vence y ya no se puede usar
    luhn_validation:      boolean;    // Indica si el número pasó la validación Luhn (dígito verificador)
    live_mode:            boolean;    // true = producción, false = modo de prueba (sandbox)
    require_esc:          boolean;    // Indica si se requiere el código ESC para pagos sin CVV
    card_number_length:   number;     // Cantidad de dígitos que tiene el número de la tarjeta
    security_code_length: number;     // Cantidad de dígitos que tiene el código de seguridad
}
