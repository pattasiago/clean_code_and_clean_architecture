import { validate } from '../src/ValidateCPF';

test('Should be true if a valid CPF is provided', function () {
  const cpf = '714.318.330-02';
  expect(validate(cpf)).toBeTruthy();
});

test.each(['714.318.330-01', '714.318.330-0', '111.111.111-11'])(
  'Should be false if an invalid CPF is provided',
  function (cpf) {
    expect(validate(cpf)).toBeFalsy();
  },
);
