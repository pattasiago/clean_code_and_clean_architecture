import Checkout from './Checkout';

const input: any = { cpf: '', products: [] };

process.stdin.on('data', async function (chunk) {
  const command = chunk.toString().replace(/\n/g, '');
  if (command.startsWith('set-cpf')) {
    input.cpf = command.replace('set-cpf ', '');
    console.log(input);
  }
  if (command.startsWith('add-product')) {
    const [idProduct, quantity] = command
      .replace('add-product ', '')
      .split(' ');
    input.products.push({
      id: parseInt(idProduct),
      qty: parseInt(quantity),
    });
    console.log(input);
  }
  if (command.startsWith('checkout')) {
    try {
      const checkout = new Checkout();
      const output = await checkout.execute(input);
      console.log(output);
    } catch (e: any) {
      console.log(e);
    }
  }
});
