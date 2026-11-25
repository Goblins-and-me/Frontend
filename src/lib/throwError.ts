export default function throwRequestError(action: string, response: Response): never {
  throw new Error(`${action} (HTTP ${response.status})`);
}
