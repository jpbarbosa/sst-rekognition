import { S3ObjectCreatedNotificationEvent, SQSHandler } from "aws-lambda";
import { Rekognition } from "aws-sdk";

const rekognition = new Rekognition();

export const handler: SQSHandler = async (sqsEvent) => {
  sqsEvent.Records.forEach(async (record) => {
    const event: S3ObjectCreatedNotificationEvent = JSON.parse(record.body);

    const { bucket, object } = event.detail;

    try {
      const labels = await rekognition
        .detectLabels({
          Image: {
            S3Object: {
              Bucket: bucket.name,
              Name: object.key,
            },
          },
        })
        .promise();
      console.log(labels);
    } catch (error) {
      console.log(error);
    }
  });
};
