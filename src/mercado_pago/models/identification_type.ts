// Tipo de documento de identidad aceptado por Mercado Pago (GET /identification_types)
export interface IdentificationType {
    id:         string; // Identificador del tipo de documento (ej. "CC", "DNI")
    name:       string; // Nombre para mostrar al usuario (ej. "C.C.")
    type:       string; // Tipo de dato del documento: "number" (solo números) o "string" (alfanumérico)
    min_length: number; // Cantidad mínima de caracteres permitida
    max_length: number; // Cantidad máxima de caracteres permitida
}