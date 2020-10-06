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
            testCommands: props.testCommands,
        };
        console.info(`pipelineStackProps: ${JSON.stringify(pipelineStackProps, null, 2)}`);
        // tslint:disable-next-line: no-unused-expression
        new pipeline_stack_1.PipelineStack(this, `${props.repositoryName}-pipeline-stack-build`, pipelineStackProps);
        this.synth();
    }
}
exports.PipelineApp = PipelineApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGlwZWxpbmUtYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSx3Q0FBeUQ7QUFDekQscURBQXFFO0FBR3JFLG1EQUFtRTtBQVduRSxNQUFhLFdBQVksU0FBUSxVQUFHO0lBQ2xDLFlBQVksS0FBdUI7UUFDakMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2Isc0RBQXNEO1FBRXRELEtBQUksTUFBTSxPQUFPLElBQUksQ0FBQywwQkFBVSxFQUFFLDJCQUFXLENBQUMsRUFBRTtZQUM5QyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzdDO1FBRUQsTUFBTSxrQkFBa0IsR0FBdUI7WUFDN0MsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLHNDQUFzQztZQUN0Qyw2Q0FBNkM7WUFDN0MsS0FBSztZQUNMLEdBQUcsRUFBRTtnQkFDSCxPQUFPLEVBQUUsMEJBQVUsQ0FBQyxFQUFFO2dCQUN0QixNQUFNLEVBQUUsMEJBQVUsQ0FBQyxNQUFNO2FBQzFCO1lBQ0QsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO1lBQ3BCLGNBQWMsRUFBRSxLQUFLLENBQUMsY0FBYztZQUNwQyxZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVk7WUFDaEMsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO1NBQ2pDLENBQUM7UUFDRixPQUFPLENBQUMsSUFBSSxDQUFDLHVCQUF1QixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFbkYsaURBQWlEO1FBQ2pELElBQUksOEJBQWEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsY0FBYyx1QkFBdUIsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQzVGLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNmLENBQUM7Q0FDRjtBQTdCRCxrQ0E2QkMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgeyBBcHAsIEFwcFByb3BzLCBDb25zdHJ1Y3QgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFBpcGVsaW5lU3RhY2tQcm9wcywgUGlwZWxpbmVTdGFjayB9IGZyb20gJy4vcGlwZWxpbmUtc3RhY2snO1xuaW1wb3J0IHsgQ3VzdG9tU3RhY2sgfSBmcm9tICcuL2N1c3RvbS1zdGFjayc7XG5cbmltcG9ydCB7IEFjY291bnQsIGRldkFjY291bnQsIHByb2RBY2NvdW50IH0gZnJvbSAnLi9hY2NvdW50Q29uZmlnJztcblxuZXhwb3J0IGludGVyZmFjZSBQaXBlbGluZUFwcFByb3BzIGV4dGVuZHMgQXBwUHJvcHMge1xuICAvLyBjdXN0b21TdGFnZTogU3RhZ2U7XG4gIGN1c3RvbVN0YWNrOiAoc2NvcGU6IENvbnN0cnVjdCwgYWNjb3VudDogQWNjb3VudCkgPT4gQ3VzdG9tU3RhY2s7XG4gIGJyYW5jaDogc3RyaW5nO1xuICByZXBvc2l0b3J5TmFtZTogc3RyaW5nO1xuICBkZXN0cm95U3RhY2s/OiBib29sZWFuO1xuICB0ZXN0Q29tbWFuZHM6IChhY2NvdW50OiBBY2NvdW50KSA9PiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFBpcGVsaW5lQXBwIGV4dGVuZHMgQXBwIHtcbiAgY29uc3RydWN0b3IocHJvcHM6IFBpcGVsaW5lQXBwUHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgLy8gVGFncy5vZih0aGlzKS5hZGQoJ1Byb2plY3QnLCBwcm9wcy5yZXBvc2l0b3J5TmFtZSk7XG5cbiAgICBmb3IoY29uc3QgYWNjb3VudCBvZiBbZGV2QWNjb3VudCwgcHJvZEFjY291bnRdKSB7XG4gICAgICBwcm9wcy5jdXN0b21TdGFjay5jYWxsKHRoaXMsIHRoaXMsIGFjY291bnQpO1xuICAgIH1cblxuICAgIGNvbnN0IHBpcGVsaW5lU3RhY2tQcm9wczogUGlwZWxpbmVTdGFja1Byb3BzID0ge1xuICAgICAgY3VzdG9tU3RhY2s6IHByb3BzLmN1c3RvbVN0YWNrLFxuICAgICAgLy8gY3VzdG9tU3RhY2s6IChfc2NvcGUsIGFjY291bnQpID0+IHtcbiAgICAgIC8vICAgcmV0dXJuIHByb3BzLmN1c3RvbVN0YWNrKHRoaXMsIGFjY291bnQpO1xuICAgICAgLy8gfSxcbiAgICAgIGVudjoge1xuICAgICAgICBhY2NvdW50OiBkZXZBY2NvdW50LmlkLFxuICAgICAgICByZWdpb246IGRldkFjY291bnQucmVnaW9uLFxuICAgICAgfSxcbiAgICAgIGJyYW5jaDogcHJvcHMuYnJhbmNoLFxuICAgICAgcmVwb3NpdG9yeU5hbWU6IHByb3BzLnJlcG9zaXRvcnlOYW1lLFxuICAgICAgZGVzdHJveVN0YWNrOiBwcm9wcy5kZXN0cm95U3RhY2ssXG4gICAgICB0ZXN0Q29tbWFuZHM6IHByb3BzLnRlc3RDb21tYW5kcyxcbiAgICB9O1xuICAgIGNvbnNvbGUuaW5mbyhgcGlwZWxpbmVTdGFja1Byb3BzOiAke0pTT04uc3RyaW5naWZ5KHBpcGVsaW5lU3RhY2tQcm9wcywgbnVsbCwgMil9YCk7XG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXVudXNlZC1leHByZXNzaW9uXG4gICAgbmV3IFBpcGVsaW5lU3RhY2sodGhpcywgYCR7cHJvcHMucmVwb3NpdG9yeU5hbWV9LXBpcGVsaW5lLXN0YWNrLWJ1aWxkYCwgcGlwZWxpbmVTdGFja1Byb3BzKTtcbiAgICB0aGlzLnN5bnRoKCk7XG4gIH1cbn1cbiJdfQ==