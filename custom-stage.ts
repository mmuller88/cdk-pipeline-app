import { CfnOutput, Construct, Stage, StageProps } from '@aws-cdk/core';
import { Account } from './accountConfig';
import { CustomStack } from './custom-stack';

// import { UIStack } from '../alf-cdk-ui/cdk/ui-stack';


export interface CustomStageProps extends StageProps {
  // stackProps: CustomStackProps;
  customStack: (scope: Construct, account: Account) => CustomStack;
}
/**
 * Deployable unit of web service app
 */
export class CustomStage extends Stage {
  cfnOutputs: Record<string, CfnOutput> = {};

  constructor(scope: Construct, id: string, props: CustomStageProps, account: Account) {
    super(scope, id, props);

    const customStack = props.customStack.call(this, this, account);

    // tslint:disable-next-line: forin
    for(const key in customStack.cfnOutputs){
      this.cfnOutputs[key] = customStack.cfnOutputs[key];
    }

    // this.cfnOutputs = customStack.cfnOutputs;
  }
}
