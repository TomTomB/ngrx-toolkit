export interface PostSandboxArgs {
  queryParams: {
    sandboxId: string;
  };
  sideUpdateArgs: {
    success: [GetFooArgs, TestArgs];
    failure: [GetFooArgs];
  };
}

export interface GetFooArgs {
  queryParams: {
    sandboxSlug: string;
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
