import React, { useEffect } from "react";
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
  const { uploadId, setUploadId, setSelectedItem } = useAppContext();

  const [uploading, setUploading] = React.useState(false);
  const [uploadFile, setUploadFile] = React.useState<File>();
  const [uploadError, setUploadError] = React.useState<AWS.AWSError>();

  useEffect(() => {
    if (!uploadId) {
      setUploadFile(undefined);
      setUploadError(undefined);
    }
  }, [uploadId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const [file] = e.target.files;
      const uploadId = uuid.v1();
      setSelectedItem(undefined);
      setUploading(true);
      setUploadId(undefined);
      setUploadFile(undefined);
      setUploadError(undefined);
      try {
        await s3
          .upload({
            Bucket: VITE_API_BUCKET_NAME,
            Key: uploadId,
            Body: file,
          })
          .promise();
        setUploadId(uploadId);
        setUploadFile(file);
      } catch (error) {
        const awsError = error as AWS.AWSError;
        setUploadError(awsError);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div id="upload">
      <div className="status">
        {uploading && <div className="uploading">Uploading...</div>}
      </div>
      <h2>Upload</h2>
      <form>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          multiple={false}
        />
      </form>
      {uploadFile && (
        <div className="file">
          <div className="box success">{uploadFile.name}</div>
          <img src={URL.createObjectURL(uploadFile)} />
        </div>
      )}
      {uploadError && (
        <div className="box error">{JSON.stringify(uploadError)}</div>
      )}
      <div className="box info">
        Only the last uploaded image will be displayed. Files are automatically
        removed from S3 after processing.
      </div>
    </div>
  );
};
