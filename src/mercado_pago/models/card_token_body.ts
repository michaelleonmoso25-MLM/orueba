import { Cardholder } from "./card_holder"; // Modelo del titular de la tarjeta

// Cuerpo que se envía a POST /card_tokens para generar el token seguro de la tarjeta
export interface CardTokenBody {
    card_number:      string;     // Número completo de la tarjeta, sin espacios
    expiration_year:  string;     // Año de vencimiento con 4 dígitos (ej. "2030")
    expiration_month: number;     // Mes de vencimiento (1 a 12)
    security_code:    string;     // Código de seguridad CVV (3 o 4 dígitos)
    cardholder:       Cardholder; // Nombre y documento del titular de la tarjeta
}
