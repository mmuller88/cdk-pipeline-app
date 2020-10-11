"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomStack = void 0;
const core_1 = require("@aws-cdk/core");
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
class CustomStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.cfnOutputs = {};
    }
    ;
}
exports.CustomStack = CustomStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3VzdG9tLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdDQUE2RDtBQUU3RCx5REFBeUQ7QUFDekQsMkJBQTJCO0FBQzNCLG1CQUFtQjtBQUNuQix3QkFBd0I7QUFDeEIsd0JBQXdCO0FBQ3hCLHVCQUF1QjtBQUN2QiwwQkFBMEI7QUFDMUIsc0JBQXNCO0FBQ3RCLDJCQUEyQjtBQUMzQiwyQkFBMkI7QUFDM0IsSUFBSTtBQUVKLGdDQUFnQztBQUNoQyxhQUFhO0FBQ2IsSUFBSTtBQUVKLE1BQWEsV0FBWSxTQUFRLFlBQUs7SUFHcEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUh6QixlQUFVLEdBQTJCLEVBQUUsQ0FBQztJQUl4QyxDQUFDO0lBQUEsQ0FBQztDQUNIO0FBTkQsa0NBTUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdGFja1Byb3BzLCBDb25zdHJ1Y3QsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5cbi8vIGV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tU3RhY2tQcm9wcyBleHRlbmRzIFN0YWNrUHJvcHMge1xuLy8gICB0eXBlOiBDdXN0b21TdGFja1R5cGU7XG4vLyAgIHN0YWdlOiBzdHJpbmc7XG4vLyAgIGFjbUNlcnRSZWY6IHN0cmluZztcbi8vICAgZG9tYWluTmFtZTogc3RyaW5nO1xuLy8gICBzdWJEb21haW46IHN0cmluZztcbi8vICAgaG9zdGVkWm9uZUlkOiBzdHJpbmc7XG4vLyAgIHpvbmVOYW1lOiBzdHJpbmc7XG4vLyAgIC8vIGRlcGxveWVkQXQ6IHN0cmluZztcbi8vICAgLy8gYXBwVmVyc2lvbjogc3RyaW5nO1xuLy8gfVxuXG4vLyBleHBvcnQgZW51bSBDdXN0b21TdGFja1R5cGUge1xuLy8gICB1aVN0YWNrLFxuLy8gfVxuXG5leHBvcnQgY2xhc3MgQ3VzdG9tU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNmbk91dHB1dHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpe1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpXG4gIH07XG59XG4iXX0=