import {
  Api,
  Auth,
  Bucket,
  Stack,
  ViteStaticSite,
} from "@serverless-stack/resources";

type CreateSiteOptions = {
  api: Api;
  auth: Auth;
  bucket: Bucket;
};

type CreateSite = (stack: Stack, options: CreateSiteOptions) => ViteStaticSite;

export const createSite: CreateSite = (stack: Stack, { api, bucket, auth }) =>
  new ViteStaticSite(stack, "site", {
    path: "frontend",
    environment: {
      VITE_API_URL: api.url,
      VITE_API_BUCKET_NAME: bucket.bucketName,
      VITE_API_IDENTITY_POOL_ID: String(auth.cdk.cfnIdentityPool?.ref),
    },
  });
