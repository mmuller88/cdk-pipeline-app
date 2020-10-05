import { CfnOutput, Construct, StackProps, Stage, StageProps } from '@aws-cdk/core';
import { CustomStack } from './custom-stack';

export interface CustomStackStageProps extends StageProps {
  stackProps: StackProps;
}
/**
 * Deployable unit of web service app
 */
export class CustomStackStage extends Stage {
  public readonly cfnOutputs: {[key: string] : CfnOutput};

  constructor(scope: Construct, id: string, props: CustomStackStageProps) {
    super(scope, id, props);

    // tslint:disable-next-line: no-unused-expression
    const stack = new CustomStack(this, `Stack`, props?.stackProps);

    stack

    // Expose CdkpipelinesDemoStack's output one level higher
    // this.domainName = Stack.domainName;
  }
}
