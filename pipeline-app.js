#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineApp = void 0;
const core_1 = require("@aws-cdk/core");
const pipeline_stack_1 = require("./pipeline-stack");
class PipelineApp extends core_1.App {
    constructor(props) {
        super(props);
        // Tags.of(this).add('Project', props.repositoryName);
        // tslint:disable-next-line: forin
        for (const account of props.accounts) {
            props.customStack.call(this, this, account);
        }
        const pipelineStackProps = {
            customStack: props.customStack,
            // customStack: (_scope, account) => {
            //   return props.customStack(this, account);
            // },
            env: {
                account: props.buildAccount.id,
                region: props.buildAccount.region,
            },
            branch: props.branch,
            repositoryName: props.repositoryName,
            accounts: props.accounts,
            destroyStack: props.destroyStack,
            manualApprovals: props.manualApprovals,
            testCommands: props.testCommands,
        };
        console.info(`pipelineStackProps: ${JSON.stringify(pipelineStackProps, null, 2)}`);
        // tslint:disable-next-line: no-unused-expression
        new pipeline_stack_1.PipelineStack(this, `${props.repositoryName}-pipeline-stack-build`, pipelineStackProps);
        this.synth();
    }
}
exports.PipelineApp = PipelineApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGlwZWxpbmUtYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSx3Q0FBb0U7QUFDcEUscURBQXFFO0FBaUJyRSxNQUFhLFdBQVksU0FBUSxVQUFHO0lBQ2xDLFlBQVksS0FBdUI7UUFDakMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2Isc0RBQXNEO1FBRXRELGtDQUFrQztRQUNsQyxLQUFJLE1BQU0sT0FBTyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDbkMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM3QztRQUVELE1BQU0sa0JBQWtCLEdBQXVCO1lBQzdDLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM5QixzQ0FBc0M7WUFDdEMsNkNBQTZDO1lBQzdDLEtBQUs7WUFDTCxHQUFHLEVBQUU7Z0JBQ0gsT0FBTyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDOUIsTUFBTSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTTthQUNsQztZQUNELE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtZQUNwQixjQUFjLEVBQUUsS0FBSyxDQUFDLGNBQWM7WUFDcEMsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3hCLFlBQVksRUFBRSxLQUFLLENBQUMsWUFBWTtZQUNoQyxlQUFlLEVBQUUsS0FBSyxDQUFDLGVBQWU7WUFDdEMsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO1NBQ2pDLENBQUM7UUFDRixPQUFPLENBQUMsSUFBSSxDQUFDLHVCQUF1QixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFbkYsaURBQWlEO1FBQ2pELElBQUksOEJBQWEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsY0FBYyx1QkFBdUIsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQzVGLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNmLENBQUM7Q0FDRjtBQWhDRCxrQ0FnQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgeyBBcHAsIEFwcFByb3BzLCBDZm5PdXRwdXQsIENvbnN0cnVjdCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGFja1Byb3BzLCBQaXBlbGluZVN0YWNrIH0gZnJvbSAnLi9waXBlbGluZS1zdGFjayc7XG5pbXBvcnQgeyBDdXN0b21TdGFjayB9IGZyb20gJy4vY3VzdG9tLXN0YWNrJztcblxuaW1wb3J0IHsgQWNjb3VudCB9IGZyb20gJy4vYWNjb3VudENvbmZpZyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGlwZWxpbmVBcHBQcm9wcyBleHRlbmRzIEFwcFByb3BzIHtcbiAgLy8gY3VzdG9tU3RhZ2U6IFN0YWdlO1xuICBhY2NvdW50czogQWNjb3VudFtdO1xuICBidWlsZEFjY291bnQ6IEFjY291bnQ7XG4gIGN1c3RvbVN0YWNrOiAoc2NvcGU6IENvbnN0cnVjdCwgYWNjb3VudDogQWNjb3VudCkgPT4gQ3VzdG9tU3RhY2s7XG4gIGJyYW5jaDogc3RyaW5nO1xuICByZXBvc2l0b3J5TmFtZTogc3RyaW5nO1xuICBkZXN0cm95U3RhY2s/OiAoYWNjb3VudDogQWNjb3VudCkgPT4gYm9vbGVhbjtcbiAgbWFudWFsQXBwcm92YWxzPzogKGFjY291bnQ6IEFjY291bnQpID0+IGJvb2xlYW47XG4gIHRlc3RDb21tYW5kczogKGFjY291bnQ6IEFjY291bnQsIGNmbk91dHB1dHM6IFJlY29yZDxzdHJpbmcsIENmbk91dHB1dD4pID0+IHN0cmluZ1tdO1xufVxuXG5leHBvcnQgY2xhc3MgUGlwZWxpbmVBcHAgZXh0ZW5kcyBBcHAge1xuICBjb25zdHJ1Y3Rvcihwcm9wczogUGlwZWxpbmVBcHBQcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICAvLyBUYWdzLm9mKHRoaXMpLmFkZCgnUHJvamVjdCcsIHByb3BzLnJlcG9zaXRvcnlOYW1lKTtcblxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogZm9yaW5cbiAgICBmb3IoY29uc3QgYWNjb3VudCBvZiBwcm9wcy5hY2NvdW50cykge1xuICAgICAgcHJvcHMuY3VzdG9tU3RhY2suY2FsbCh0aGlzLCB0aGlzLCBhY2NvdW50KTtcbiAgICB9XG5cbiAgICBjb25zdCBwaXBlbGluZVN0YWNrUHJvcHM6IFBpcGVsaW5lU3RhY2tQcm9wcyA9IHtcbiAgICAgIGN1c3RvbVN0YWNrOiBwcm9wcy5jdXN0b21TdGFjayxcbiAgICAgIC8vIGN1c3RvbVN0YWNrOiAoX3Njb3BlLCBhY2NvdW50KSA9PiB7XG4gICAgICAvLyAgIHJldHVybiBwcm9wcy5jdXN0b21TdGFjayh0aGlzLCBhY2NvdW50KTtcbiAgICAgIC8vIH0sXG4gICAgICBlbnY6IHtcbiAgICAgICAgYWNjb3VudDogcHJvcHMuYnVpbGRBY2NvdW50LmlkLFxuICAgICAgICByZWdpb246IHByb3BzLmJ1aWxkQWNjb3VudC5yZWdpb24sXG4gICAgICB9LFxuICAgICAgYnJhbmNoOiBwcm9wcy5icmFuY2gsXG4gICAgICByZXBvc2l0b3J5TmFtZTogcHJvcHMucmVwb3NpdG9yeU5hbWUsXG4gICAgICBhY2NvdW50czogcHJvcHMuYWNjb3VudHMsXG4gICAgICBkZXN0cm95U3RhY2s6IHByb3BzLmRlc3Ryb3lTdGFjayxcbiAgICAgIG1hbnVhbEFwcHJvdmFsczogcHJvcHMubWFudWFsQXBwcm92YWxzLFxuICAgICAgdGVzdENvbW1hbmRzOiBwcm9wcy50ZXN0Q29tbWFuZHMsXG4gICAgfTtcbiAgICBjb25zb2xlLmluZm8oYHBpcGVsaW5lU3RhY2tQcm9wczogJHtKU09OLnN0cmluZ2lmeShwaXBlbGluZVN0YWNrUHJvcHMsIG51bGwsIDIpfWApO1xuXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby11bnVzZWQtZXhwcmVzc2lvblxuICAgIG5ldyBQaXBlbGluZVN0YWNrKHRoaXMsIGAke3Byb3BzLnJlcG9zaXRvcnlOYW1lfS1waXBlbGluZS1zdGFjay1idWlsZGAsIHBpcGVsaW5lU3RhY2tQcm9wcyk7XG4gICAgdGhpcy5zeW50aCgpO1xuICB9XG59XG4iXX0=