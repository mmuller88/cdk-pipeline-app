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
            testCommands: props.testCommands,
        };
        console.info(`pipelineStackProps: ${JSON.stringify(pipelineStackProps, null, 2)}`);
        // tslint:disable-next-line: no-unused-expression
        new pipeline_stack_1.PipelineStack(this, `${props.repositoryName}-pipeline-stack-build`, pipelineStackProps);
        this.synth();
    }
}
exports.PipelineApp = PipelineApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGlwZWxpbmUtYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSx3Q0FBeUQ7QUFDekQscURBQXFFO0FBR3JFLG1EQUFtRTtBQVVuRSxNQUFhLFdBQVksU0FBUSxVQUFHO0lBQ2xDLFlBQVksS0FBdUI7UUFDakMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2Isc0RBQXNEO1FBRXRELEtBQUksTUFBTSxPQUFPLElBQUksQ0FBQywwQkFBVSxFQUFFLDJCQUFXLENBQUMsRUFBRTtZQUM5QyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzdDO1FBRUQsTUFBTSxrQkFBa0IsR0FBdUI7WUFDN0MsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLHNDQUFzQztZQUN0Qyw2Q0FBNkM7WUFDN0MsS0FBSztZQUNMLEdBQUcsRUFBRTtnQkFDSCxPQUFPLEVBQUUsMEJBQVUsQ0FBQyxFQUFFO2dCQUN0QixNQUFNLEVBQUUsMEJBQVUsQ0FBQyxNQUFNO2FBQzFCO1lBQ0QsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO1lBQ3BCLGNBQWMsRUFBRSxLQUFLLENBQUMsY0FBYztZQUNwQyxZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVk7U0FDakMsQ0FBQztRQUNGLE9BQU8sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVuRixpREFBaUQ7UUFDakQsSUFBSSw4QkFBYSxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxjQUFjLHVCQUF1QixFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDNUYsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2YsQ0FBQztDQUNGO0FBNUJELGtDQTRCQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCB7IEFwcCwgQXBwUHJvcHMsIENvbnN0cnVjdCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGFja1Byb3BzLCBQaXBlbGluZVN0YWNrIH0gZnJvbSAnLi9waXBlbGluZS1zdGFjayc7XG5pbXBvcnQgeyBDdXN0b21TdGFjayB9IGZyb20gJy4vY3VzdG9tLXN0YWNrJztcblxuaW1wb3J0IHsgQWNjb3VudCwgZGV2QWNjb3VudCwgcHJvZEFjY291bnQgfSBmcm9tICcuL2FjY291bnRDb25maWcnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBpcGVsaW5lQXBwUHJvcHMgZXh0ZW5kcyBBcHBQcm9wcyB7XG4gIC8vIGN1c3RvbVN0YWdlOiBTdGFnZTtcbiAgY3VzdG9tU3RhY2s6IChzY29wZTogQ29uc3RydWN0LCBhY2NvdW50OiBBY2NvdW50KSA9PiBDdXN0b21TdGFjaztcbiAgYnJhbmNoOiBzdHJpbmc7XG4gIHJlcG9zaXRvcnlOYW1lOiBzdHJpbmc7XG4gIHRlc3RDb21tYW5kczogKGFjY291bnQ6IEFjY291bnQpID0+IHN0cmluZ1tdO1xufVxuXG5leHBvcnQgY2xhc3MgUGlwZWxpbmVBcHAgZXh0ZW5kcyBBcHAge1xuICBjb25zdHJ1Y3Rvcihwcm9wczogUGlwZWxpbmVBcHBQcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICAvLyBUYWdzLm9mKHRoaXMpLmFkZCgnUHJvamVjdCcsIHByb3BzLnJlcG9zaXRvcnlOYW1lKTtcblxuICAgIGZvcihjb25zdCBhY2NvdW50IG9mIFtkZXZBY2NvdW50LCBwcm9kQWNjb3VudF0pIHtcbiAgICAgIHByb3BzLmN1c3RvbVN0YWNrLmNhbGwodGhpcywgdGhpcywgYWNjb3VudCk7XG4gICAgfVxuXG4gICAgY29uc3QgcGlwZWxpbmVTdGFja1Byb3BzOiBQaXBlbGluZVN0YWNrUHJvcHMgPSB7XG4gICAgICBjdXN0b21TdGFjazogcHJvcHMuY3VzdG9tU3RhY2ssXG4gICAgICAvLyBjdXN0b21TdGFjazogKF9zY29wZSwgYWNjb3VudCkgPT4ge1xuICAgICAgLy8gICByZXR1cm4gcHJvcHMuY3VzdG9tU3RhY2sodGhpcywgYWNjb3VudCk7XG4gICAgICAvLyB9LFxuICAgICAgZW52OiB7XG4gICAgICAgIGFjY291bnQ6IGRldkFjY291bnQuaWQsXG4gICAgICAgIHJlZ2lvbjogZGV2QWNjb3VudC5yZWdpb24sXG4gICAgICB9LFxuICAgICAgYnJhbmNoOiBwcm9wcy5icmFuY2gsXG4gICAgICByZXBvc2l0b3J5TmFtZTogcHJvcHMucmVwb3NpdG9yeU5hbWUsXG4gICAgICB0ZXN0Q29tbWFuZHM6IHByb3BzLnRlc3RDb21tYW5kcyxcbiAgICB9O1xuICAgIGNvbnNvbGUuaW5mbyhgcGlwZWxpbmVTdGFja1Byb3BzOiAke0pTT04uc3RyaW5naWZ5KHBpcGVsaW5lU3RhY2tQcm9wcywgbnVsbCwgMil9YCk7XG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXVudXNlZC1leHByZXNzaW9uXG4gICAgbmV3IFBpcGVsaW5lU3RhY2sodGhpcywgYCR7cHJvcHMucmVwb3NpdG9yeU5hbWV9LXBpcGVsaW5lLXN0YWNrLWJ1aWxkYCwgcGlwZWxpbmVTdGFja1Byb3BzKTtcbiAgICB0aGlzLnN5bnRoKCk7XG4gIH1cbn1cbiJdfQ==