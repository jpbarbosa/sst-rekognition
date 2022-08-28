import { StackContext } from "@serverless-stack/resources";
import {
  createBucket,
  createTable,
  createQueue,
  createBus,
  createApi,
  createAuth,
  createSite,
} from "./resources";

export function MyStack({ stack }: StackContext) {
  const bucket = createBucket(stack);
  const table = createTable(stack);
  const queue = createQueue(stack, { bucket, table });
  const bus = createBus(stack, { bucket, queue });
  const api = createApi(stack, { table });
  const auth = createAuth(stack, { bucket });
  const site = createSite(stack, { api, bucket, auth });

  stack.addOutputs({
    ApiEndpoint: api.url,
    SiteUrl: site.url,
  });
}
