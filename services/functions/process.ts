import {
  S3ObjectCreatedNotificationEvent,
  S3ObjectCreatedNotificationEventDetail,
  SQSHandler,
} from "aws-lambda";
import { DynamoDB, Rekognition } from "aws-sdk";
import * as uuid from "uuid";

const rekognition = new Rekognition();

const dynamoDb = new DynamoDB.DocumentClient();

const getLabels = async ({
  bucket,
  object,
}: S3ObjectCreatedNotificationEventDetail) => {
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
    console.log("Image has been processed", object.key);
    return labels;
  } catch (error) {
    console.log(error);
  }
};

const saveLabels = async (labels: Rekognition.Types.DetectLabelsResponse) => {
  try {
    const params = {
      TableName: String(process.env.table),
      Item: {
        id: uuid.v1(),
        createdAt: Date.now(),
        labels,
      },
    };
    const result = await dynamoDb.put(params).promise();
    console.log("Labels have been saved");
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const handler: SQSHandler = async (sqsEvent) => {
  sqsEvent.Records.forEach(async (record) => {
    const event: S3ObjectCreatedNotificationEvent = JSON.parse(record.body);
    const labels = await getLabels(event.detail);
    if (labels) {
      await saveLabels(labels);
    }
  });
};
