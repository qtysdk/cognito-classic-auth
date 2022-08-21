import {
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';

export const userPool = new CognitoUserPool({
  UserPoolId: process.env.COGNITO_USER_POOL_ID || '',
  ClientId: process.env.COGNITO_CLIENT_ID || '',
});

export const currentUser = (): CognitoUser | null => {
  const user = userPool.getCurrentUser();
  let currentUser = null;
  user?.getSession(
    (error: Error | null, session: CognitoUserSession | null) => {
      if (error) {
        currentUser = null;
        return;
      }
      currentUser = user;
      return;
    },
  );
  return currentUser;
};
