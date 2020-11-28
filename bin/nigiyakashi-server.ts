#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { NigiyakashiServerStack } from '../lib/nigiyakashi-server-stack';

const app = new cdk.App();
new NigiyakashiServerStack(app, 'NigiyakashiServerStack');
