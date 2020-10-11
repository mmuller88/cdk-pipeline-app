export declare const sharedProdAccountProps: SharedAccountProps;
export declare const sharedDevAccountProps: SharedAccountProps;
export interface Account {
    id: string;
    region: string;
    stage: string;
}
export interface SharedAccountProps {
    account: Account;
    domainName: string;
    subDomain: string;
    acmCertRef: string;
    hostedZoneId: string;
    zoneName: string;
    vpc: {
        vpcId: string;
        availabilityZones: string[];
    };
}
