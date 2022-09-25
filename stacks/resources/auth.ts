import { Cognito, Bucket, Stack } from "@serverless-stack/resources";

type CreateAuthOptions = { bucket: Bucket };

type CreateAuth = (stack: Stack, options: CreateAuthOptions) => Cognito;

export const createAuth: CreateAuth = (stack, { bucket }) => {
  const auth = new Cognito(stack, "auth", {
    identityPoolFederation: {
      cdk: {
        cfnIdentityPool: {
          identityPoolName: "identityPool",
          allowUnauthenticatedIdentities: true,
        },
      },
    },
  });

  auth.attachPermissionsForUnauthUsers(auth, [bucket]);

  return auth;
};
