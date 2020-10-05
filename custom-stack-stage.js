"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomStackStage = void 0;
const core_1 = require("@aws-cdk/core");
const custom_stack_1 = require("./custom-stack");
/**
 * Deployable unit of web service app
 */
class CustomStackStage extends core_1.Stage {
    constructor(scope, id, props) {
        super(scope, id, props);
        // tslint:disable-next-line: no-unused-expression
        const stack = new custom_stack_1.CustomStack(this, `Stack`, props === null || props === void 0 ? void 0 : props.stackProps);
        stack;
        // Expose CdkpipelinesDemoStack's output one level higher
        // this.domainName = Stack.domainName;
    }
}
exports.CustomStackStage = CustomStackStage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLXN0YWNrLXN0YWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3VzdG9tLXN0YWNrLXN0YWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdDQUFvRjtBQUNwRixpREFBNkM7QUFLN0M7O0dBRUc7QUFDSCxNQUFhLGdCQUFpQixTQUFRLFlBQUs7SUFHekMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE0QjtRQUNwRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixpREFBaUQ7UUFDakQsTUFBTSxLQUFLLEdBQUcsSUFBSSwwQkFBVyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRWhFLEtBQUssQ0FBQTtRQUVMLHlEQUF5RDtRQUN6RCxzQ0FBc0M7SUFDeEMsQ0FBQztDQUNGO0FBZEQsNENBY0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDZm5PdXRwdXQsIENvbnN0cnVjdCwgU3RhY2tQcm9wcywgU3RhZ2UsIFN0YWdlUHJvcHMgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEN1c3RvbVN0YWNrIH0gZnJvbSAnLi9jdXN0b20tc3RhY2snO1xuXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbVN0YWNrU3RhZ2VQcm9wcyBleHRlbmRzIFN0YWdlUHJvcHMge1xuICBzdGFja1Byb3BzOiBTdGFja1Byb3BzO1xufVxuLyoqXG4gKiBEZXBsb3lhYmxlIHVuaXQgb2Ygd2ViIHNlcnZpY2UgYXBwXG4gKi9cbmV4cG9ydCBjbGFzcyBDdXN0b21TdGFja1N0YWdlIGV4dGVuZHMgU3RhZ2Uge1xuICBwdWJsaWMgcmVhZG9ubHkgY2ZuT3V0cHV0czoge1trZXk6IHN0cmluZ10gOiBDZm5PdXRwdXR9O1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDdXN0b21TdGFja1N0YWdlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tdW51c2VkLWV4cHJlc3Npb25cbiAgICBjb25zdCBzdGFjayA9IG5ldyBDdXN0b21TdGFjayh0aGlzLCBgU3RhY2tgLCBwcm9wcz8uc3RhY2tQcm9wcyk7XG5cbiAgICBzdGFja1xuXG4gICAgLy8gRXhwb3NlIENka3BpcGVsaW5lc0RlbW9TdGFjaydzIG91dHB1dCBvbmUgbGV2ZWwgaGlnaGVyXG4gICAgLy8gdGhpcy5kb21haW5OYW1lID0gU3RhY2suZG9tYWluTmFtZTtcbiAgfVxufVxuIl19