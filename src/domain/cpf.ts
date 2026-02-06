/**
 * Valida CPF com dígitos verificadores Aceita formatos: 123.456.789-01 ou 12345678901
 */
export function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, ''); // remove tudo que não é número

  if (cpf.length !== 11) return false;

  // CPFs repetidos são inválidos
  if (/^(\d)\1+$/.test(cpf)) return false;

  // Validação do primeiro dígito
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += Number(cpf[i]) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== Number(cpf[9])) return false;

  // Validação do segundo dígito
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += Number(cpf[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== Number(cpf[10])) return false;

  return true;
}
