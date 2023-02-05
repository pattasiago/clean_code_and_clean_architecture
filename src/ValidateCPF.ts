const DIGIT_1_MAX_FACTOR = 10;
const DIGIT_2_MAX_FACTOR = 11;
const CPF_LENGTH = 11;

function calculateVerifyingDigit(cpf: string, factor: number) {
  let digits_sum = 0;
  for (let digit_position = 0; digit_position <= factor - 2; digit_position++) {
    digits_sum += (factor - digit_position) * parseInt(cpf[digit_position]);
  }
  const rest = digits_sum % CPF_LENGTH;
  return rest < 2 ? 0 : CPF_LENGTH - rest;
}

function checkValidStringLength(cpf: string) {
  return cpf.length === CPF_LENGTH;
}

function removeNonDigits(cpf: string) {
  return cpf
    .replace('.', '')
    .replace('.', '')
    .replace('-', '')
    .replace(' ', '');
}

function checkAllTheSameDigit(cpf: string) {
  return cpf.split('').every(current_digit => current_digit === cpf[0]);
}

function getCheckDigits(cpf: string) {
  return cpf.slice(-2);
}

export function validate(cpf: string) {
  cpf = removeNonDigits(cpf);
  if (!checkValidStringLength(cpf)) return false;
  if (checkAllTheSameDigit(cpf)) return false;
  const digit1 = calculateVerifyingDigit(cpf, DIGIT_1_MAX_FACTOR);
  const digit2 = calculateVerifyingDigit(cpf, DIGIT_2_MAX_FACTOR);
  return `${digit1}${digit2}` == getCheckDigits(cpf);
}
