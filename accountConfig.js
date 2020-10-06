"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devAccount = exports.prodAccount = void 0;
exports.prodAccount = {
    id: '981237193288',
    region: 'us-east-1',
    stage: 'prod',
    domainName: 'alfpro.net',
    subDomain: 'app',
    acmCertRef: 'arn:aws:acm:us-east-1:981237193288:certificate/62010fca-125e-4780-8d71-7d745ff91789',
    hostedZoneId: 'Z05027561FL1C7WWU4SX4',
    zoneName: 'alfpro.net.',
    vpc: {
        vpcId: 'vpc-615bf91b',
        availabilityZones: ['us-east-1a', 'us-east-1b', 'us-east-1c'],
    },
};
exports.devAccount = {
    id: '981237193288',
    region: 'eu-central-1',
    stage: 'dev',
    domainName: 'dev.alfpro.net',
    subDomain: 'app',
    acmCertRef: 'arn:aws:acm:us-east-1:981237193288:certificate/f605dd8c-4ae3-4c1b-9471-4b152e0f8846',
    hostedZoneId: 'Z036396421QYOR6PI3CPX',
    zoneName: 'dev.alfpro.net.',
    vpc: {
        vpcId: 'vpc-568dbd3d',
        availabilityZones: ['eu-central-1a', 'eu-central-1b', 'eu-central-1c'],
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudENvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFjY291bnRDb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ2EsUUFBQSxXQUFXLEdBQVk7SUFDbEMsRUFBRSxFQUFFLGNBQWM7SUFDbEIsTUFBTSxFQUFFLFdBQVc7SUFDbkIsS0FBSyxFQUFFLE1BQU07SUFDYixVQUFVLEVBQUUsWUFBWTtJQUN4QixTQUFTLEVBQUUsS0FBSztJQUNoQixVQUFVLEVBQUUscUZBQXFGO0lBQ2pHLFlBQVksRUFBRSx1QkFBdUI7SUFDckMsUUFBUSxFQUFFLGFBQWE7SUFDdkIsR0FBRyxFQUFFO1FBQ0gsS0FBSyxFQUFFLGNBQWM7UUFDckIsaUJBQWlCLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQztLQUM5RDtDQUNGLENBQUE7QUFFWSxRQUFBLFVBQVUsR0FBWTtJQUNqQyxFQUFFLEVBQUUsY0FBYztJQUNsQixNQUFNLEVBQUUsY0FBYztJQUN0QixLQUFLLEVBQUUsS0FBSztJQUNaLFVBQVUsRUFBRSxnQkFBZ0I7SUFDNUIsU0FBUyxFQUFFLEtBQUs7SUFDaEIsVUFBVSxFQUFFLHFGQUFxRjtJQUNqRyxZQUFZLEVBQUUsdUJBQXVCO0lBQ3JDLFFBQVEsRUFBRSxpQkFBaUI7SUFDM0IsR0FBRyxFQUFFO1FBQ0gsS0FBSyxFQUFFLGNBQWM7UUFDckIsaUJBQWlCLEVBQUUsQ0FBQyxlQUFlLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQztLQUN2RTtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJcbmV4cG9ydCBjb25zdCBwcm9kQWNjb3VudDogQWNjb3VudCA9IHtcbiAgaWQ6ICc5ODEyMzcxOTMyODgnLFxuICByZWdpb246ICd1cy1lYXN0LTEnLFxuICBzdGFnZTogJ3Byb2QnLFxuICBkb21haW5OYW1lOiAnYWxmcHJvLm5ldCcsXG4gIHN1YkRvbWFpbjogJ2FwcCcsXG4gIGFjbUNlcnRSZWY6ICdhcm46YXdzOmFjbTp1cy1lYXN0LTE6OTgxMjM3MTkzMjg4OmNlcnRpZmljYXRlLzYyMDEwZmNhLTEyNWUtNDc4MC04ZDcxLTdkNzQ1ZmY5MTc4OScsXG4gIGhvc3RlZFpvbmVJZDogJ1owNTAyNzU2MUZMMUM3V1dVNFNYNCcsXG4gIHpvbmVOYW1lOiAnYWxmcHJvLm5ldC4nLFxuICB2cGM6IHtcbiAgICB2cGNJZDogJ3ZwYy02MTViZjkxYicsXG4gICAgYXZhaWxhYmlsaXR5Wm9uZXM6IFsndXMtZWFzdC0xYScsICd1cy1lYXN0LTFiJywgJ3VzLWVhc3QtMWMnXSxcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IGRldkFjY291bnQ6IEFjY291bnQgPSB7XG4gIGlkOiAnOTgxMjM3MTkzMjg4JyxcbiAgcmVnaW9uOiAnZXUtY2VudHJhbC0xJyxcbiAgc3RhZ2U6ICdkZXYnLFxuICBkb21haW5OYW1lOiAnZGV2LmFsZnByby5uZXQnLFxuICBzdWJEb21haW46ICdhcHAnLFxuICBhY21DZXJ0UmVmOiAnYXJuOmF3czphY206dXMtZWFzdC0xOjk4MTIzNzE5MzI4ODpjZXJ0aWZpY2F0ZS9mNjA1ZGQ4Yy00YWUzLTRjMWItOTQ3MS00YjE1MmUwZjg4NDYnLFxuICBob3N0ZWRab25lSWQ6ICdaMDM2Mzk2NDIxUVlPUjZQSTNDUFgnLFxuICB6b25lTmFtZTogJ2Rldi5hbGZwcm8ubmV0LicsXG4gIHZwYzoge1xuICAgIHZwY0lkOiAndnBjLTU2OGRiZDNkJyxcbiAgICBhdmFpbGFiaWxpdHlab25lczogWydldS1jZW50cmFsLTFhJywgJ2V1LWNlbnRyYWwtMWInLCAnZXUtY2VudHJhbC0xYyddLFxuICB9LFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFjY291bnQge1xuICBpZDogc3RyaW5nO1xuICByZWdpb246IHN0cmluZztcbiAgc3RhZ2U6IHN0cmluZztcbiAgZG9tYWluTmFtZTogc3RyaW5nO1xuICBzdWJEb21haW46IHN0cmluZztcbiAgYWNtQ2VydFJlZjogc3RyaW5nO1xuICBob3N0ZWRab25lSWQ6IHN0cmluZztcbiAgem9uZU5hbWU6IHN0cmluZztcbiAgdnBjOiB7XG4gICAgdnBjSWQ6IHN0cmluZztcbiAgICBhdmFpbGFiaWxpdHlab25lczogc3RyaW5nW107XG4gIH1cbn0iXX0=