import { CfnOutput, Construct, Stage, StageProps } from '@aws-cdk/core';
import { Account } from './accountConfig';
import { CustomStack } from './custom-stack';
export interface CustomStageProps extends StageProps {
    customStack: (scope: Construct, account: Account) => CustomStack;
    cfnOutputs: Record<string, CfnOutput>;
}
/**
 * Deployable unit of web service app
 */
export declare class CustomStage extends Stage {
    cfnOutputs: Record<string, CfnOutput>;
    constructor(scope: Construct, id: string, props: CustomStageProps, account: Account);
}
