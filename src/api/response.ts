export interface RequestResponse<T> {
  data: T;
  code: number;
  message: string;
}
