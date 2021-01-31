export interface Response {
  success: boolean;
}

export interface GetDemoResponse extends Response {
  test: string;
}

export interface PostDemoResponse extends Response {
  data: string;
  someParameter: string;
}

export interface DeleteDemoResponse extends Response {
  id: string;
}
