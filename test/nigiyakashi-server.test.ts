import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as NigiyakashiServer from '../lib/nigiyakashi-server-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new NigiyakashiServer.NigiyakashiServerStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
