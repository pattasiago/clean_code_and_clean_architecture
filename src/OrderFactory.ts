import { validate } from './ValidateCPF';
import AppError from './Error';
import Order from './Order';

export default class OrderFactory {
  static create(cpf: string) {
    if (!validate(cpf)) throw new AppError('Invalid CPF');
    return new Order(cpf);
  }
}
