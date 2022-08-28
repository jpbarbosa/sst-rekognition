import { Bucket, EventBus, Queue, Stack } from "@serverless-stack/resources";
import * as events from "aws-cdk-lib/aws-events";

type CreateBusOptions = { bucket: Bucket; queue: Queue };

type CreateBus = (stack: Stack, options: CreateBusOptions) => EventBus;

export const createBus: CreateBus = (stack: Stack, { bucket, queue }) =>
  new EventBus(stack, "bus", {
    cdk: {
      eventBus: events.EventBus.fromEventBusName(
        stack,
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
