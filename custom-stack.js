"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomStack = void 0;
const core_1 = require("@aws-cdk/core");
class CustomStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.cfnOutputs = {};
    }
    ;
}
exports.CustomStack = CustomStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3VzdG9tLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdDQUF3RTtBQUV4RSxNQUFhLFdBQVksU0FBUSxZQUFLO0lBR3BDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFIekIsZUFBVSxHQUE4QixFQUFFLENBQUM7SUFJM0MsQ0FBQztJQUFBLENBQUM7Q0FDSDtBQU5ELGtDQU1DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2tQcm9wcywgQ29uc3RydWN0LCBDZm5PdXRwdXQsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5cbmV4cG9ydCBjbGFzcyBDdXN0b21TdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY2ZuT3V0cHV0czogUmVjb3JkPHN0cmluZywgQ2ZuT3V0cHV0PiA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcyl7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcylcbiAgfTtcbn1cbiJdfQ==