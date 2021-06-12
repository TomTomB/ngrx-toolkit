export interface PostSandboxArgs {
  queryParams: {
    sandboxId: string;
  };
}

export interface GetFooArgs {
  queryParams: {
    sandboxSlug: string;
  };
}

export interface GetBarArgs {
  queryParams: {
    barSlug: string;
  };
  params: {
    page: number;
  };
}

export interface TestArgs {
  queryParams: {
    testThing: string;
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
