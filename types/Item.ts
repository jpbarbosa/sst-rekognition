import { Rekognition, AWSError } from "aws-sdk";

export type Item = {
  id: string;
  createdAt: string;
  labels?: Rekognition.DetectLabelsResponse;
  error?: AWSError;
};
