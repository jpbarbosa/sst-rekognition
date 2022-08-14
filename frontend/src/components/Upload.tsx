import React from "react";
import AWS from "aws-sdk";
import * as uuid from "uuid";
import { useAppContext } from "../contexts/AppContext";

const { VITE_API_BUCKET_NAME, VITE_API_IDENTITY_POOL_ID } = import.meta.env;

const credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: VITE_API_IDENTITY_POOL_ID,
});

AWS.config.update({
  region: "us-east-2",
  credentials,
});

const s3 = new AWS.S3({
  params: {
    Bucket: VITE_API_BUCKET_NAME,
  },
});

export const Upload: React.FC = () => {
  const { setUploadId, setSelectedItem } = useAppContext();

  const [uploading, setUploading] = React.useState(false);
  const [uploadName, setUploadName] = React.useState<string>();
  const [uploadError, setUploadError] = React.useState<AWS.AWSError>();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadId = uuid.v1();
      setSelectedItem(undefined);
      setUploading(true);
      setUploadName(undefined);
      setUploadError(undefined);
      try {
        await s3
          .upload({
            Bucket: VITE_API_BUCKET_NAME,
            Key: uploadId,
            Body: e.target.files[0],
          })
          .promise();
        setUploadId(uploadId);
        setUploadName(e.target.files[0].name);
      } catch (error) {
        const awsError = error as AWS.AWSError;
        setUploadError(awsError);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div>
      <h2>Upload</h2>
      <form>
        <input type="file" onChange={handleUpload} />
        {uploading && <p>Uploading...</p>}
        {uploadName && <p>{JSON.stringify(uploadName)}</p>}
        {uploadError && <p>{JSON.stringify(uploadError)}</p>}
      </form>
    </div>
  );
};
