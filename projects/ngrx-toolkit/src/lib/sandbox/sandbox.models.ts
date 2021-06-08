export interface PostSandboxArgs {
  queryParams: {
    foo: string;
  };
  params: {
    foo: string;
  };
  body: {
    foo: string;
  };
}

export interface Sandbox {
  name: string;
  contents: string;
}

export interface PostSandboxError {
  message: string;
  extraData: string;
}
