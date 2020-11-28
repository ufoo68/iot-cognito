#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { IotStack } from '../lib/iot-stack'
import { CognitoStack } from '../lib/cognito-stack'

const app = new cdk.App()
new IotStack(app, 'IotStack')
new CognitoStack(app, 'CognitoStack')
