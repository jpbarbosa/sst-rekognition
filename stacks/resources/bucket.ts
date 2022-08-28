import { Bucket, Stack } from "@serverless-stack/resources";

export const createBucket = (stack: Stack) =>
  new Bucket(stack, "bucket", {
    cors: true,
    cdk: {
      bucket: {
        eventBridgeEnabled: true,
      },
    },
  });
