export interface PostSandboxArgs {
  queryParams: {
    sandboxId: string;
    sandboxTest: number;
  };
  sideUpdates: {
    getFoo: GetFooArgs;
    getBar: GetBarArgs;
  };
}

export interface GetFooArgs {
  queryParams: {
    sandboxSlug: string;
  };
}

export interface GetBarArgs {
  params: {
    someFilter: string;
    barIds: string[];
  };
}

export interface BenchmarkArgs {
  queryParams: {
    benchmark: string;
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
