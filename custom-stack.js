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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3VzdG9tLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdDQUF3RTtBQUV4RSx5REFBeUQ7QUFDekQsMkJBQTJCO0FBQzNCLG1CQUFtQjtBQUNuQix3QkFBd0I7QUFDeEIsd0JBQXdCO0FBQ3hCLHVCQUF1QjtBQUN2QiwwQkFBMEI7QUFDMUIsc0JBQXNCO0FBQ3RCLDJCQUEyQjtBQUMzQiwyQkFBMkI7QUFDM0IsSUFBSTtBQUVKLGdDQUFnQztBQUNoQyxhQUFhO0FBQ2IsSUFBSTtBQUVKLE1BQWEsV0FBWSxTQUFRLFlBQUs7SUFHcEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUh6QixlQUFVLEdBQThCLEVBQUUsQ0FBQztJQUkzQyxDQUFDO0lBQUEsQ0FBQztDQUNIO0FBTkQsa0NBTUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdGFja1Byb3BzLCBDb25zdHJ1Y3QsIENmbk91dHB1dCwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcblxuLy8gZXhwb3J0IGludGVyZmFjZSBDdXN0b21TdGFja1Byb3BzIGV4dGVuZHMgU3RhY2tQcm9wcyB7XG4vLyAgIHR5cGU6IEN1c3RvbVN0YWNrVHlwZTtcbi8vICAgc3RhZ2U6IHN0cmluZztcbi8vICAgYWNtQ2VydFJlZjogc3RyaW5nO1xuLy8gICBkb21haW5OYW1lOiBzdHJpbmc7XG4vLyAgIHN1YkRvbWFpbjogc3RyaW5nO1xuLy8gICBob3N0ZWRab25lSWQ6IHN0cmluZztcbi8vICAgem9uZU5hbWU6IHN0cmluZztcbi8vICAgLy8gZGVwbG95ZWRBdDogc3RyaW5nO1xuLy8gICAvLyBhcHBWZXJzaW9uOiBzdHJpbmc7XG4vLyB9XG5cbi8vIGV4cG9ydCBlbnVtIEN1c3RvbVN0YWNrVHlwZSB7XG4vLyAgIHVpU3RhY2ssXG4vLyB9XG5cbmV4cG9ydCBjbGFzcyBDdXN0b21TdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY2ZuT3V0cHV0czogUmVjb3JkPHN0cmluZywgQ2ZuT3V0cHV0PiA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcyl7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcylcbiAgfTtcbn1cbiJdfQ==