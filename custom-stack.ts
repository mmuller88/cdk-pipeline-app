import { StackProps, Construct, Stack } from '@aws-cdk/core';

// export interface CustomStackProps extends StackProps {
//   type: CustomStackType;
//   stage: string;
//   acmCertRef: string;
//   domainName: string;
//   subDomain: string;
//   hostedZoneId: string;
//   zoneName: string;
//   // deployedAt: string;
//   // appVersion: string;
// }

// export enum CustomStackType {
//   uiStack,
// }

export class CustomStack extends Stack {
  cfnOutputs: Record<string, string> = {};

  constructor(scope: Construct, id: string, props?: StackProps){
    super(scope, id, props)
  };
}
