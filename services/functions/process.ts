import {
  S3ObjectCreatedNotificationEvent,
  S3ObjectCreatedNotificationEventDetail,
  SQSHandler,
} from "aws-lambda";
import { AWSError, DynamoDB, Rekognition, S3 } from "aws-sdk";

const rekognition = new Rekognition();

const dynamoDb = new DynamoDB.DocumentClient();

const s3 = new S3();

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

const deleteImage = async ({
  bucket,
  object,
}: S3ObjectCreatedNotificationEventDetail) => {
  try {
    await s3
      .deleteObject({
        Bucket: bucket.name,
        Key: object.key,
      })
      .promise();
    console.log("Image has been deleted");
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
    } finally {
      await deleteImage(detail);
    }
  });
};
