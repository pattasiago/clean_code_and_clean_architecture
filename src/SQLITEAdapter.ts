import Connection from './Connection';
import { Database } from 'sqlite3';

export default class SQLITE implements Connection {
  db: any;
  constructor() {
    this.db = new Database('projectdb.sqlite');
  }

  query(statement: any, params: any): Promise<any> {
    const that = this.db;
    return new Promise(function (resolve, reject) {
      that.all(statement, params, function (error: any, rows: any) {
        if (error) reject(error);
        else resolve({ rows: rows });
      });
    });
  }

  close(): Promise<void> {
    const that = this.db;
    return new Promise(function (resolve, reject) {
      that.close();
      resolve();
    });
  }

  insertdb(statement: any, params: any): Promise<any> {
    const that = this.db;
    return new Promise(function (resolve, reject) {
      that.serialize(function () {
        that.run(statement, params, function (this: any, error: any) {
          if (error) reject(error);
          else resolve(this);
        });
      });
    });
  }
}
