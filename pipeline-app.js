#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineApp = void 0;
const core_1 = require("@aws-cdk/core");
const pipeline_stack_1 = require("./pipeline-stack");
const accountConfig_1 = require("./accountConfig");
class PipelineApp extends core_1.App {
    constructor(props) {
        super(props);
        // Tags.of(this).add('Project', props.repositoryName);
        for (const account of [accountConfig_1.devAccount, accountConfig_1.prodAccount]) {
            props.customStack.call(this, this, account);
        }
        const pipelineStackProps = {
            customStack: props.customStack,
            // customStack: (_scope, account) => {
            //   return props.customStack(this, account);
            // },
            env: {
                account: accountConfig_1.devAccount.id,
                region: accountConfig_1.devAccount.region,
            },
            branch: props.branch,
            repositoryName: props.repositoryName,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGlwZWxpbmUtYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSx3Q0FBeUQ7QUFDekQscURBQXFFO0FBR3JFLG1EQUFtRTtBQVluRSxNQUFhLFdBQVksU0FBUSxVQUFHO0lBQ2xDLFlBQVksS0FBdUI7UUFDakMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2Isc0RBQXNEO1FBRXRELEtBQUksTUFBTSxPQUFPLElBQUksQ0FBQywwQkFBVSxFQUFFLDJCQUFXLENBQUMsRUFBRTtZQUM5QyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzdDO1FBRUQsTUFBTSxrQkFBa0IsR0FBdUI7WUFDN0MsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLHNDQUFzQztZQUN0Qyw2Q0FBNkM7WUFDN0MsS0FBSztZQUNMLEdBQUcsRUFBRTtnQkFDSCxPQUFPLEVBQUUsMEJBQVUsQ0FBQyxFQUFFO2dCQUN0QixNQUFNLEVBQUUsMEJBQVUsQ0FBQyxNQUFNO2FBQzFCO1lBQ0QsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO1lBQ3BCLGNBQWMsRUFBRSxLQUFLLENBQUMsY0FBYztZQUNwQyxZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVk7WUFDaEMsZUFBZSxFQUFFLEtBQUssQ0FBQyxlQUFlO1lBQ3RDLFlBQVksRUFBRSxLQUFLLENBQUMsWUFBWTtTQUNqQyxDQUFDO1FBQ0YsT0FBTyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRW5GLGlEQUFpRDtRQUNqRCxJQUFJLDhCQUFhLENBQUMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLGNBQWMsdUJBQXVCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUM1RixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZixDQUFDO0NBQ0Y7QUE5QkQsa0NBOEJDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0IHsgQXBwLCBBcHBQcm9wcywgQ29uc3RydWN0IH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBQaXBlbGluZVN0YWNrUHJvcHMsIFBpcGVsaW5lU3RhY2sgfSBmcm9tICcuL3BpcGVsaW5lLXN0YWNrJztcbmltcG9ydCB7IEN1c3RvbVN0YWNrIH0gZnJvbSAnLi9jdXN0b20tc3RhY2snO1xuXG5pbXBvcnQgeyBBY2NvdW50LCBkZXZBY2NvdW50LCBwcm9kQWNjb3VudCB9IGZyb20gJy4vYWNjb3VudENvbmZpZyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGlwZWxpbmVBcHBQcm9wcyBleHRlbmRzIEFwcFByb3BzIHtcbiAgLy8gY3VzdG9tU3RhZ2U6IFN0YWdlO1xuICBjdXN0b21TdGFjazogKHNjb3BlOiBDb25zdHJ1Y3QsIGFjY291bnQ6IEFjY291bnQpID0+IEN1c3RvbVN0YWNrO1xuICBicmFuY2g6IHN0cmluZztcbiAgcmVwb3NpdG9yeU5hbWU6IHN0cmluZztcbiAgZGVzdHJveVN0YWNrPzogYm9vbGVhbjtcbiAgbWFudWFsQXBwcm92YWxzPzogYm9vbGVhbjtcbiAgdGVzdENvbW1hbmRzOiAoYWNjb3VudDogQWNjb3VudCkgPT4gc3RyaW5nW107XG59XG5cbmV4cG9ydCBjbGFzcyBQaXBlbGluZUFwcCBleHRlbmRzIEFwcCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzOiBQaXBlbGluZUFwcFByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIC8vIFRhZ3Mub2YodGhpcykuYWRkKCdQcm9qZWN0JywgcHJvcHMucmVwb3NpdG9yeU5hbWUpO1xuXG4gICAgZm9yKGNvbnN0IGFjY291bnQgb2YgW2RldkFjY291bnQsIHByb2RBY2NvdW50XSkge1xuICAgICAgcHJvcHMuY3VzdG9tU3RhY2suY2FsbCh0aGlzLCB0aGlzLCBhY2NvdW50KTtcbiAgICB9XG5cbiAgICBjb25zdCBwaXBlbGluZVN0YWNrUHJvcHM6IFBpcGVsaW5lU3RhY2tQcm9wcyA9IHtcbiAgICAgIGN1c3RvbVN0YWNrOiBwcm9wcy5jdXN0b21TdGFjayxcbiAgICAgIC8vIGN1c3RvbVN0YWNrOiAoX3Njb3BlLCBhY2NvdW50KSA9PiB7XG4gICAgICAvLyAgIHJldHVybiBwcm9wcy5jdXN0b21TdGFjayh0aGlzLCBhY2NvdW50KTtcbiAgICAgIC8vIH0sXG4gICAgICBlbnY6IHtcbiAgICAgICAgYWNjb3VudDogZGV2QWNjb3VudC5pZCxcbiAgICAgICAgcmVnaW9uOiBkZXZBY2NvdW50LnJlZ2lvbixcbiAgICAgIH0sXG4gICAgICBicmFuY2g6IHByb3BzLmJyYW5jaCxcbiAgICAgIHJlcG9zaXRvcnlOYW1lOiBwcm9wcy5yZXBvc2l0b3J5TmFtZSxcbiAgICAgIGRlc3Ryb3lTdGFjazogcHJvcHMuZGVzdHJveVN0YWNrLFxuICAgICAgbWFudWFsQXBwcm92YWxzOiBwcm9wcy5tYW51YWxBcHByb3ZhbHMsXG4gICAgICB0ZXN0Q29tbWFuZHM6IHByb3BzLnRlc3RDb21tYW5kcyxcbiAgICB9O1xuICAgIGNvbnNvbGUuaW5mbyhgcGlwZWxpbmVTdGFja1Byb3BzOiAke0pTT04uc3RyaW5naWZ5KHBpcGVsaW5lU3RhY2tQcm9wcywgbnVsbCwgMil9YCk7XG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXVudXNlZC1leHByZXNzaW9uXG4gICAgbmV3IFBpcGVsaW5lU3RhY2sodGhpcywgYCR7cHJvcHMucmVwb3NpdG9yeU5hbWV9LXBpcGVsaW5lLXN0YWNrLWJ1aWxkYCwgcGlwZWxpbmVTdGFja1Byb3BzKTtcbiAgICB0aGlzLnN5bnRoKCk7XG4gIH1cbn1cbiJdfQ==