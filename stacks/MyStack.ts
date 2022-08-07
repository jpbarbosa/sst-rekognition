import {
  StackContext,
  Api,
  Bucket,
  EventBus,
  Queue,
} from "@serverless-stack/resources";
import * as events from "aws-cdk-lib/aws-events";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export function MyStack({ stack }: StackContext) {
  const bucket = new Bucket(stack, "bucket", {
    cdk: {
      bucket: {
        eventBridgeEnabled: true,
      },
    },
  });

  const queuePolicy = new PolicyStatement({
    actions: ["rekognition:*"],
    resources: ["*"],
  });

  const queue = new Queue(stack, "queue", {
    consumer: {
      function: {
        handler: "functions/process.handler",
        initialPolicy: [queuePolicy],
      },
    },
  });

  queue.attachPermissions([bucket]);

  const bus = new EventBus(stack, "bus", {
    cdk: {
      eventBus: events.EventBus.fromEventBusName(
        this,
        "ImportedBus",
        "default"
      ),
    },
    rules: {
      rule1: {
        pattern: {
          source: ["aws.s3"],
          detailType: ["Object Created"],
          detail: {
            bucket: {
              name: [bucket.bucketName],
            },
          },
        },
        targets: {
          process: queue,
        },
      },
    },
  });

  const api = new Api(stack, "api", {
    routes: {
      "GET /": "functions/lambda.handler",
    },
  });
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
