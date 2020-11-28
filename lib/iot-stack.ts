import * as cdk from '@aws-cdk/core'
import * as iot from '@aws-cdk/aws-iot'
import * as ssm from '@aws-cdk/aws-ssm'

export class IotStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const projectName = 'nigiyakashi'
    const policyName = `${projectName}_iot_policy`
    const iotPolicy = new iot.CfnPolicy(this, 'IotPolicy', {
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: 'iot:*',
            Resource: '*',
          },
        ],
      },
      policyName,
    })

    const thingName = `${projectName}_iot_thing`
    const iotThing = new iot.CfnThing(this, 'IotThing', { thingName })
    const ioTCertificateArn = ssm.StringParameter.fromStringParameterAttributes(this, 'IotCertArn', {
      parameterName: 'nigiyakashi-cert-arn',
    }).stringValue

    const iotPolicyPrincipalAttachment = new iot.CfnPolicyPrincipalAttachment(
      this,
      'IotPolicyPrincipalAttachment',
      {
        policyName,
        principal: ioTCertificateArn,
      }
    )
    iotPolicyPrincipalAttachment.addDependsOn(iotPolicy)

    const iotThingPrincipalAttachment = new iot.CfnThingPrincipalAttachment(
      this,
      'IotThingPrincipalAttachment',
      {
        thingName,
        principal: ioTCertificateArn,
      }
    )
    iotThingPrincipalAttachment.addDependsOn(iotThing)
  }
}
