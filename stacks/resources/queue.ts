import { Queue, Stack, Table, Bucket } from "@serverless-stack/resources";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

type CreateQueueOptions = { bucket: Bucket; table: Table };

type CreateQueue = (stack: Stack, options: CreateQueueOptions) => Queue;

export const createQueue: CreateQueue = (stack, { bucket, table }) => {
  const queuePolicy = new PolicyStatement({
    actions: ["rekognition:*"],
    resources: ["*"],
  });

  const queue = new Queue(stack, "queue", {
    consumer: {
      function: {
        handler: "functions/process.handler",
        initialPolicy: [queuePolicy],
        environment: {
          table: table.tableName,
        },
      },
    },
  });

  queue.attachPermissions([table, bucket]);

  return queue;
};
