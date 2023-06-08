import HttpServer from './HttpServer';
import express, { Request, Response } from 'express';

export default class ExpressAdapter implements HttpServer {
  app: any;

  constructor() {
    this.app = express();
    this.app.use(express.json());
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  on(method: string, url: string, callback: Function): void {
    this.app[method](url, async function (req: Request, res: Response) {
      try {
        const output = await callback(req.param, req.body);
        res.json(output);
      } catch (e: any) {
        res.status(422).json({
          message: e.message,
        });
      }
    });
  }

  list(port: number): void {
    this.app.listen(port);
  }
}
