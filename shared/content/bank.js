/** Contrato de los datos bancarios de Donar. Un dato inválido nunca se muestra al donante. */
import { requireDocument } from "./core.js";

const CLABE_WEIGHTS = [3, 7, 1];

/** CLABE de 18 dígitos con dígito de control válido (pesos 3, 7, 1 módulo 10). */
export function isValidClabe(value) {
  if (typeof value !== "string" || !/^\d{18}$/.test(value)) return false;
  const sum = [...value.slice(0, 17)].reduce((total, digit, index) =>
    total + (Number(digit) * CLABE_WEIGHTS[index % 3]) % 10, 0);
  return (10 - (sum % 10)) % 10 === Number(value[17]);
}

export function mapStrapiBank(payload) {
  const data = requireDocument(payload, "Datos bancarios");
  const bankName = typeof data.bankName === "string" ? data.bankName.trim() : "";
  if (!bankName) throw new Error("Falta el nombre del banco");
  if (!isValidClabe(data.clabe)) throw new Error("CLABE inválida");
  if (typeof data.accountNumber !== "string" || !/^\d{6,20}$/.test(data.accountNumber)) {
    throw new Error("Número de cuenta inválido");
  }
  return { bankName, clabe: data.clabe, accountNumber: data.accountNumber };
}
