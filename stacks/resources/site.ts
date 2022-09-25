import {
  Api,
  Bucket,
  Stack,
  ViteStaticSite,
  Cognito,
} from "@serverless-stack/resources";

type CreateSiteOptions = {
  api: Api;
  bucket: Bucket;
  auth: Cognito;
};

type CreateSite = (stack: Stack, options: CreateSiteOptions) => ViteStaticSite;

export const createSite: CreateSite = (stack, { api, bucket, auth }) =>
  new ViteStaticSite(stack, "site", {
    path: "frontend",
    environment: {
      VITE_API_URL: api.url,
      VITE_API_REGION: stack.region,
      VITE_API_BUCKET_NAME: bucket.bucketName,
      VITE_API_IDENTITY_POOL_ID: String(auth.cdk.cfnIdentityPool?.ref),
    },
  });
