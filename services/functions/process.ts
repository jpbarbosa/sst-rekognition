import {
  S3ObjectCreatedNotificationEvent,
  S3ObjectCreatedNotificationEventDetail,
  SQSHandler,
} from "aws-lambda";
import { AWSError, DynamoDB, Rekognition } from "aws-sdk";

const rekognition = new Rekognition();

const dynamoDb = new DynamoDB.DocumentClient();

const getLabels = async ({
  bucket,
  object,
}: S3ObjectCreatedNotificationEventDetail) => {
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
};

const saveLabels = async (
  key: string,
  labels?: Rekognition.Types.DetectLabelsResponse,
  error?: AWSError
) => {
  try {
    const params = {
      TableName: String(process.env.table),
      Item: {
        id: key,
        createdAt: Date.now(),
        labels,
        error,
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
    const { detail }: S3ObjectCreatedNotificationEvent = JSON.parse(
      record.body
    );
    const { key } = detail.object;
    try {
      const labels = await getLabels(detail);
      await saveLabels(key, labels);
    } catch (error) {
      const awsError = error as AWSError;
      await saveLabels(key, undefined, awsError);
    }
  });
};
