
# AWS Cognito with classic auth demo project

The project demonstrates how to
use [amazon-cognito-identity-js](https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js)
implement a classic user management without a backend.

## Prerequisite

* Create a Cognito User Pool
  * Set the only `email` to `required attributes` for SignUp
* Create an App client for frontend 
  * **DON'T** generate the client secret
  * Add `ALLOW_USER_PASSWORD_AUTH` to authentication flows

## Configure it before using

create a `.env` with the content in the root of project

```
REACT_APP_COGNITO_USER_POOL_ID=<user-pool-id>
REACT_APP_COGNITO_CLIENT_ID=<client-id>
```


## Caution

My frontend skill is not good enough. The project just shows up how to intergrate with [amazon-cognito-identity-js](https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js). Be friendly please.
