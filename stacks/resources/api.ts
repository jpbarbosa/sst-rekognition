import { Api, Stack, Table } from "@serverless-stack/resources";

type CreateApiOptions = { table: Table };

type CreateApi = (stack: Stack, options: CreateApiOptions) => Api;

export const createApi: CreateApi = (stack, { table }) => {
  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
          table: table.tableName,
        },
      },
    },
    routes: {
      "GET /": "functions/results.handler",
    },
  });

  api.attachPermissions([table]);

  return api;
};
