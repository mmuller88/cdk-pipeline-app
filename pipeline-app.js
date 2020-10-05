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
            commands: props.testCommands,
        };
        console.info(`pipelineStackProps: ${JSON.stringify(pipelineStackProps, null, 2)}`);
        // tslint:disable-next-line: no-unused-expression
        new pipeline_stack_1.PipelineStack(this, `${props.repositoryName}-pipeline-stack-build`, pipelineStackProps);
        this.synth();
    }
}
exports.PipelineApp = PipelineApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGlwZWxpbmUtYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSx3Q0FBeUQ7QUFDekQscURBQXFFO0FBSXJFLG1EQUEwRDtBQVUxRCxNQUFhLFdBQVksU0FBUSxVQUFHO0lBQ2xDLFlBQVksS0FBdUI7UUFDakMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2Isc0RBQXNEO1FBRXRELEtBQUksTUFBTSxPQUFPLElBQUksQ0FBQywwQkFBVSxFQUFFLDJCQUFXLENBQUMsRUFBRTtZQUM5QyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzdDO1FBRUQsTUFBTSxrQkFBa0IsR0FBdUI7WUFDN0MsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLHNDQUFzQztZQUN0Qyw2Q0FBNkM7WUFDN0MsS0FBSztZQUNMLEdBQUcsRUFBRTtnQkFDSCxPQUFPLEVBQUUsMEJBQVUsQ0FBQyxFQUFFO2dCQUN0QixNQUFNLEVBQUUsMEJBQVUsQ0FBQyxNQUFNO2FBQzFCO1lBQ0QsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO1lBQ3BCLGNBQWMsRUFBRSxLQUFLLENBQUMsY0FBYztZQUNwQyxRQUFRLEVBQUUsS0FBSyxDQUFDLFlBQVk7U0FDN0IsQ0FBQztRQUNGLE9BQU8sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVuRixpREFBaUQ7UUFDakQsSUFBSSw4QkFBYSxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxjQUFjLHVCQUF1QixFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDNUYsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2YsQ0FBQztDQUNGO0FBNUJELGtDQTRCQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCB7IEFwcCwgQXBwUHJvcHMsIENvbnN0cnVjdCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGFja1Byb3BzLCBQaXBlbGluZVN0YWNrIH0gZnJvbSAnLi9waXBlbGluZS1zdGFjayc7XG5pbXBvcnQgeyBBY2NvdW50IH0gZnJvbSAnLi9hY2NvdW50Q29uZmlnJztcbmltcG9ydCB7IEN1c3RvbVN0YWNrIH0gZnJvbSAnLi9jdXN0b20tc3RhY2snO1xuXG5pbXBvcnQgeyBkZXZBY2NvdW50LCBwcm9kQWNjb3VudCB9IGZyb20gJy4vYWNjb3VudENvbmZpZyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGlwZWxpbmVBcHBQcm9wcyBleHRlbmRzIEFwcFByb3BzIHtcbiAgLy8gY3VzdG9tU3RhZ2U6IFN0YWdlO1xuICBjdXN0b21TdGFjazogKHNjb3BlOiBDb25zdHJ1Y3QsIGFjY291bnQ6IEFjY291bnQpID0+IEN1c3RvbVN0YWNrO1xuICBicmFuY2g6IHN0cmluZztcbiAgcmVwb3NpdG9yeU5hbWU6IHN0cmluZztcbiAgdGVzdENvbW1hbmRzOiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFBpcGVsaW5lQXBwIGV4dGVuZHMgQXBwIHtcbiAgY29uc3RydWN0b3IocHJvcHM6IFBpcGVsaW5lQXBwUHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgLy8gVGFncy5vZih0aGlzKS5hZGQoJ1Byb2plY3QnLCBwcm9wcy5yZXBvc2l0b3J5TmFtZSk7XG5cbiAgICBmb3IoY29uc3QgYWNjb3VudCBvZiBbZGV2QWNjb3VudCwgcHJvZEFjY291bnRdKSB7XG4gICAgICBwcm9wcy5jdXN0b21TdGFjay5jYWxsKHRoaXMsIHRoaXMsIGFjY291bnQpO1xuICAgIH1cblxuICAgIGNvbnN0IHBpcGVsaW5lU3RhY2tQcm9wczogUGlwZWxpbmVTdGFja1Byb3BzID0ge1xuICAgICAgY3VzdG9tU3RhY2s6IHByb3BzLmN1c3RvbVN0YWNrLFxuICAgICAgLy8gY3VzdG9tU3RhY2s6IChfc2NvcGUsIGFjY291bnQpID0+IHtcbiAgICAgIC8vICAgcmV0dXJuIHByb3BzLmN1c3RvbVN0YWNrKHRoaXMsIGFjY291bnQpO1xuICAgICAgLy8gfSxcbiAgICAgIGVudjoge1xuICAgICAgICBhY2NvdW50OiBkZXZBY2NvdW50LmlkLFxuICAgICAgICByZWdpb246IGRldkFjY291bnQucmVnaW9uLFxuICAgICAgfSxcbiAgICAgIGJyYW5jaDogcHJvcHMuYnJhbmNoLFxuICAgICAgcmVwb3NpdG9yeU5hbWU6IHByb3BzLnJlcG9zaXRvcnlOYW1lLFxuICAgICAgY29tbWFuZHM6IHByb3BzLnRlc3RDb21tYW5kcyxcbiAgICB9O1xuICAgIGNvbnNvbGUuaW5mbyhgcGlwZWxpbmVTdGFja1Byb3BzOiAke0pTT04uc3RyaW5naWZ5KHBpcGVsaW5lU3RhY2tQcm9wcywgbnVsbCwgMil9YCk7XG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXVudXNlZC1leHByZXNzaW9uXG4gICAgbmV3IFBpcGVsaW5lU3RhY2sodGhpcywgYCR7cHJvcHMucmVwb3NpdG9yeU5hbWV9LXBpcGVsaW5lLXN0YWNrLWJ1aWxkYCwgcGlwZWxpbmVTdGFja1Byb3BzKTtcbiAgICB0aGlzLnN5bnRoKCk7XG4gIH1cbn1cbiJdfQ==