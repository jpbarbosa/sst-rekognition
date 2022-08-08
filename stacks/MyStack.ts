import {
  StackContext,
  Api,
  Bucket,
  EventBus,
  Queue,
  Table,
  ViteStaticSite,
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

  const table = new Table(stack, "table", {
    fields: {
      id: "string",
    },
    primaryIndex: { partitionKey: "id" },
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
        environment: {
          table: table.tableName,
        },
      },
    },
  });

  queue.attachPermissions([table, bucket]);

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

  const site = new ViteStaticSite(stack, "site", {
    path: "frontend",
    environment: {
      VITE_API_URL: api.url,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    SiteUrl: site.url,
  });
}
