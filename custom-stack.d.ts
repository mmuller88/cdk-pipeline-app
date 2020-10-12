import { StackProps, Construct, CfnOutput, Stack } from '@aws-cdk/core';
export declare class CustomStack extends Stack {
    cfnOutputs: Record<string, CfnOutput>;
    constructor(scope: Construct, id: string, props?: StackProps);
}
