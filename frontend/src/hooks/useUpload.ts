import { useState } from "react";
import AWS from "aws-sdk";

type UseUploadParams = {
  region: string;
  credentials: AWS.Credentials;
  bucket: string;
};

type UploadParams = {
  id: string;
  file: File;
  callback?: Function;
};

export const useUpload = ({ region, credentials, bucket }: UseUploadParams) => {
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File>();
  const [uploadError, setUploadError] = useState<AWS.AWSError>();

  AWS.config.update({
    region,
    credentials,
  });

  const s3 = new AWS.S3({
    params: {
      Bucket: bucket,
    },
  });

  const resetState = () => {
    setUploading(false);
    setUploadFile(undefined);
    setUploadError(undefined);
  };

  const upload = async ({ file, id, callback }: UploadParams) => {
    resetState();
    try {
      setUploading(true);
      await s3
        .upload({
          Bucket: bucket,
          Key: id,
          Body: file,
        })
        .promise();
      setUploadFile(file);
      if (callback) callback();
    } catch (error) {
      const awsError = error as AWS.AWSError;
      setUploadError(awsError);
    } finally {
      setUploading(false);
    }
  };

  return {
    resetState,
    upload,
    uploading,
    uploadFile,
    uploadError,
  };
};
