export default interface HttpServer {
  // eslint-disable-next-line @typescript-eslint/ban-types
  on(method: string, url: string, callback: Function): void;
  list(port: number): void;
}
