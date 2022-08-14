import React from "react";
import AWS from "aws-sdk";

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
  const [uploading, setUploading] = React.useState(false);
  const [uploadedFile, setUploadedFile] = React.useState<string>();
  const [uploadError, setUploadError] = React.useState<AWS.AWSError>();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploading(true);
      setUploadedFile(undefined);
      setUploadError(undefined);
      try {
        await s3
          .putObject({
            Bucket: VITE_API_BUCKET_NAME,
            Key: e.target.files[0].name,
            Body: e.target.files[0],
          })
          .promise();
        setUploadedFile(e.target.files[0].name);
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
        {uploadedFile && <p>{JSON.stringify(uploadedFile)}</p>}
        {uploadError && <p>{JSON.stringify(uploadError)}</p>}
      </form>
    </div>
  );
};
