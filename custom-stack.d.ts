import { StackProps, Construct, Stack } from '@aws-cdk/core';
export declare class CustomStack extends Stack {
    cfnOutputs: Record<string, string>;
    constructor(scope: Construct, id: string, props?: StackProps);
}
