export declare const prodAccount: Account;
export declare const devAccount: Account;
export interface Account {
    id: string;
    region: string;
    stage: string;
    domainName: string;
    subDomain: string;
    acmCertRef: string;
    hostedZoneId: string;
    zoneName: string;
    vpcId: string;
}
