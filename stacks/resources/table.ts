import { Table, Stack } from "@serverless-stack/resources";

export const createTable = (stack: Stack) =>
  new Table(stack, "table", {
    fields: {
      id: "string",
    },
    primaryIndex: { partitionKey: "id" },
  });
