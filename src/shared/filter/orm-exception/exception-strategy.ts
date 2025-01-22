export interface ExceptionStrategy {
  match(error: Error): boolean;
  getResponse(error: Error): { status: number; message: string };
}
