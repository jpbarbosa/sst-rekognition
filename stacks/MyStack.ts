import {
  StackContext,
  Api,
  Bucket,
  EventBus,
  Queue,
} from "@serverless-stack/resources";
import * as events from "aws-cdk-lib/aws-events";

export function MyStack({ stack }: StackContext) {
  const bucket = new Bucket(stack, "bucket", {
    cdk: {
      bucket: {
        eventBridgeEnabled: true,
      },
    },
  });

  const queue = new Queue(stack, "queue", {
    consumer: "functions/process.handler",
  });

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
