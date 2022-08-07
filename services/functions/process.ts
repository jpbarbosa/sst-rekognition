import { S3ObjectCreatedNotificationEvent, SQSHandler } from "aws-lambda";

export const handler: SQSHandler = async (sqsEvent) => {
  sqsEvent.Records.forEach((record) => {
    const event: S3ObjectCreatedNotificationEvent = JSON.parse(record.body);
    console.log("record", event);
  });
};
