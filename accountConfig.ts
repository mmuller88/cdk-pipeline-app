
export const sharedProdAccountProps: SharedAccountProps = {
  stageAccount: {
    account: {
      id: '981237193288',
      region: 'us-east-1'
    },
    stage: 'prod',
  },
  domainName: 'alfpro.net',
  subDomain: 'app',
  acmCertRef: 'arn:aws:acm:us-east-1:981237193288:certificate/62010fca-125e-4780-8d71-7d745ff91789',
  hostedZoneId: 'Z05027561FL1C7WWU4SX4',
  zoneName: 'alfpro.net.',
  vpc: {
    vpcId: 'vpc-615bf91b',
    availabilityZones: ['us-east-1a', 'us-east-1b', 'us-east-1c'],
  },
}

export const sharedDevAccountProps: SharedAccountProps = {
  stageAccount: {
    account: {
      id: '981237193288',
      region: 'us-east-1'
    },
    stage: 'dev',
  },
  domainName: 'dev.alfpro.net',
  subDomain: 'app',
  acmCertRef: 'arn:aws:acm:us-east-1:981237193288:certificate/f605dd8c-4ae3-4c1b-9471-4b152e0f8846',
  hostedZoneId: 'Z036396421QYOR6PI3CPX',
  zoneName: 'dev.alfpro.net.',
  vpc: {
    vpcId: 'vpc-568dbd3d',
    availabilityZones: ['eu-central-1a', 'eu-central-1b', 'eu-central-1c'],
  },
}

export interface StageAccount {
  account: Account,
  stage: string;
}

export interface Account {
  id: string;
  region: string;
}

export interface SharedAccountProps {
  stageAccount: StageAccount;
  domainName: string;
  subDomain: string;
  acmCertRef: string;
  hostedZoneId: string;
  zoneName: string;
  vpc: {
    vpcId: string;
    availabilityZones: string[];
  }
}