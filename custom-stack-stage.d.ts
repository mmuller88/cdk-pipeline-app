import { CfnOutput, Construct, StackProps, Stage, StageProps } from '@aws-cdk/core';
export interface CustomStackStageProps extends StageProps {
    stackProps: StackProps;
}
/**
 * Deployable unit of web service app
 */
export declare class CustomStackStage extends Stage {
    readonly cfnOutputs: {
        [key: string]: CfnOutput;
    };
    constructor(scope: Construct, id: string, props: CustomStackStageProps);
}
