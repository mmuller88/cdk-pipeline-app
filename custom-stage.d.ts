import { CfnOutput, Construct, Stage, StageProps } from '@aws-cdk/core';
import { StageAccount } from './accountConfig';
import { CustomStack } from './custom-stack';
export interface CustomStageProps extends StageProps {
    customStack: (scope: Construct, stageAccount: StageAccount) => CustomStack;
}
/**
 * Deployable unit of web service app
 */
export declare class CustomStage extends Stage {
    cfnOutputs: Record<string, CfnOutput>;
    constructor(scope: Construct, id: string, props: CustomStageProps, stageAccount: StageAccount);
}
