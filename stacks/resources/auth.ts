import { Auth, Bucket, Stack } from "@serverless-stack/resources";

type CreateAuthOptions = { bucket: Bucket };

type CreateAuth = (stack: Stack, options: CreateAuthOptions) => Auth;

export const createAuth: CreateAuth = (stack, { bucket }) => {
  const auth = new Auth(stack, "auth", {
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
