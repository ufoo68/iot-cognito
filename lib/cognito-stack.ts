import * as cdk from '@aws-cdk/core'
import * as cognito from '@aws-cdk/aws-cognito'
import * as iam from '@aws-cdk/aws-iam'

export class CognitoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const userPool = new cognito.UserPool(this, 'UserPool', {
      signInAliases: {
        email: true,
      },
      selfSignUpEnabled: true,
    })

    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool,
      authFlows: {
        userPassword: true,
        adminUserPassword: true,
        userSrp: true,
      }
    })

    const identityPool = new cognito.CfnIdentityPool(this, 'IdentityPool', {
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [{
        clientId: userPoolClient.userPoolClientId,
        serverSideTokenCheck: false,
        providerName: userPool.userPoolProviderName,
      }]
    })

    const unAuthRole = new iam.Role(this, 'UnAuthRole', {
      assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com', {
        StringEquals: {
          ['cognito-identity.amazonaws.com:aud']: identityPool.ref,
        },
        ['ForAnyValue:StringLike']: {
          ['cognito-identity.amazonaws.com:amr']: 'unauthenticated'
        },
      }, 'sts:AssumeRoleWithWebIdentity'),
    })

    const authRole = new iam.Role(this, 'AuthRole', {
      assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com', {
        StringEquals: {
          ['cognito-identity.amazonaws.com:aud']: identityPool.ref,
        },
        ['ForAnyValue:StringLike']: {
          ['cognito-identity.amazonaws.com:amr']: 'authenticated'
        },
      }, 'sts:AssumeRoleWithWebIdentity'),
      managedPolicies: [iam.ManagedPolicy.fromManagedPolicyArn(this, 'AWSIoTFullAccess', 'arn:aws:iam::aws:policy/AWSIoTFullAccess')]
    })
    new cognito.CfnIdentityPoolRoleAttachment(this, 'IdentitiyRole', {
      identityPoolId: identityPool.ref,
      roles: {
        authenticated: authRole.roleArn,
        unauthenticated: unAuthRole.roleArn,
      },
    })
  }
}
