import React, { useEffect } from "react";
import AWS from "aws-sdk";
import * as uuid from "uuid";
import { useAppContext } from "../contexts/AppContext";
import { useUpload } from "../hooks/useUpload";

const { VITE_API_BUCKET_NAME, VITE_API_IDENTITY_POOL_ID } = import.meta.env;

const credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: VITE_API_IDENTITY_POOL_ID,
});

export const Upload: React.FC = () => {
  const { uploadId, setUploadId, setSelectedItem } = useAppContext();

  useEffect(() => {
    if (!uploadId) {
      resetState();
    }
  }, [uploadId]);

  const { uploading, uploadFile, uploadError, upload, resetState } = useUpload({
    region: "us-east-2",
    credentials,
    bucket: VITE_API_BUCKET_NAME,
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    const [file] = e.target.files;
    const id = uuid.v1();
    setSelectedItem(undefined);
    setUploadId(undefined);

    await upload({
      file,
      id,
      callback: () => {
        setUploadId(id);
      },
    });
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
        <div className="box error">
          <pre>{JSON.stringify(uploadError, null, 4)}</pre>
        </div>
      )}
      <div className="box info">
        Only the last uploaded image will be displayed. Files are automatically
        removed from S3 after processing.
      </div>
    </div>
  );
};
