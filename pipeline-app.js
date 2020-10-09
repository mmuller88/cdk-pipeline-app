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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGlwZWxpbmUtYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSx3Q0FBeUQ7QUFDekQscURBQXFFO0FBR3JFLG1EQUFtRTtBQVluRSxNQUFhLFdBQVksU0FBUSxVQUFHO0lBQ2xDLFlBQVksS0FBdUI7UUFDakMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2Isc0RBQXNEO1FBRXRELEtBQUksTUFBTSxPQUFPLElBQUksQ0FBQywwQkFBVSxFQUFFLDJCQUFXLENBQUMsRUFBRTtZQUM5QyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzdDO1FBRUQsTUFBTSxrQkFBa0IsR0FBdUI7WUFDN0MsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLHNDQUFzQztZQUN0Qyw2Q0FBNkM7WUFDN0MsS0FBSztZQUNMLEdBQUcsRUFBRTtnQkFDSCxPQUFPLEVBQUUsMEJBQVUsQ0FBQyxFQUFFO2dCQUN0QixNQUFNLEVBQUUsMEJBQVUsQ0FBQyxNQUFNO2FBQzFCO1lBQ0QsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO1lBQ3BCLGNBQWMsRUFBRSxLQUFLLENBQUMsY0FBYztZQUNwQyxZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVk7WUFDaEMsZUFBZSxFQUFFLEtBQUssQ0FBQyxlQUFlO1lBQ3RDLFlBQVksRUFBRSxLQUFLLENBQUMsWUFBWTtTQUNqQyxDQUFDO1FBQ0YsT0FBTyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRW5GLGlEQUFpRDtRQUNqRCxJQUFJLDhCQUFhLENBQUMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLGNBQWMsdUJBQXVCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUM1RixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZixDQUFDO0NBQ0Y7QUE5QkQsa0NBOEJDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0IHsgQXBwLCBBcHBQcm9wcywgQ29uc3RydWN0IH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBQaXBlbGluZVN0YWNrUHJvcHMsIFBpcGVsaW5lU3RhY2sgfSBmcm9tICcuL3BpcGVsaW5lLXN0YWNrJztcbmltcG9ydCB7IEN1c3RvbVN0YWNrIH0gZnJvbSAnLi9jdXN0b20tc3RhY2snO1xuXG5pbXBvcnQgeyBBY2NvdW50LCBkZXZBY2NvdW50LCBwcm9kQWNjb3VudCB9IGZyb20gJy4vYWNjb3VudENvbmZpZyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGlwZWxpbmVBcHBQcm9wcyBleHRlbmRzIEFwcFByb3BzIHtcbiAgLy8gY3VzdG9tU3RhZ2U6IFN0YWdlO1xuICBjdXN0b21TdGFjazogKHNjb3BlOiBDb25zdHJ1Y3QsIGFjY291bnQ6IEFjY291bnQpID0+IEN1c3RvbVN0YWNrO1xuICBicmFuY2g6IHN0cmluZztcbiAgcmVwb3NpdG9yeU5hbWU6IHN0cmluZztcbiAgZGVzdHJveVN0YWNrPzogKGFjY291bnQ6IEFjY291bnQpID0+IGJvb2xlYW47XG4gIG1hbnVhbEFwcHJvdmFscz86IChhY2NvdW50OiBBY2NvdW50KSA9PiBib29sZWFuO1xuICB0ZXN0Q29tbWFuZHM6IChhY2NvdW50OiBBY2NvdW50KSA9PiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFBpcGVsaW5lQXBwIGV4dGVuZHMgQXBwIHtcbiAgY29uc3RydWN0b3IocHJvcHM6IFBpcGVsaW5lQXBwUHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgLy8gVGFncy5vZih0aGlzKS5hZGQoJ1Byb2plY3QnLCBwcm9wcy5yZXBvc2l0b3J5TmFtZSk7XG5cbiAgICBmb3IoY29uc3QgYWNjb3VudCBvZiBbZGV2QWNjb3VudCwgcHJvZEFjY291bnRdKSB7XG4gICAgICBwcm9wcy5jdXN0b21TdGFjay5jYWxsKHRoaXMsIHRoaXMsIGFjY291bnQpO1xuICAgIH1cblxuICAgIGNvbnN0IHBpcGVsaW5lU3RhY2tQcm9wczogUGlwZWxpbmVTdGFja1Byb3BzID0ge1xuICAgICAgY3VzdG9tU3RhY2s6IHByb3BzLmN1c3RvbVN0YWNrLFxuICAgICAgLy8gY3VzdG9tU3RhY2s6IChfc2NvcGUsIGFjY291bnQpID0+IHtcbiAgICAgIC8vICAgcmV0dXJuIHByb3BzLmN1c3RvbVN0YWNrKHRoaXMsIGFjY291bnQpO1xuICAgICAgLy8gfSxcbiAgICAgIGVudjoge1xuICAgICAgICBhY2NvdW50OiBkZXZBY2NvdW50LmlkLFxuICAgICAgICByZWdpb246IGRldkFjY291bnQucmVnaW9uLFxuICAgICAgfSxcbiAgICAgIGJyYW5jaDogcHJvcHMuYnJhbmNoLFxuICAgICAgcmVwb3NpdG9yeU5hbWU6IHByb3BzLnJlcG9zaXRvcnlOYW1lLFxuICAgICAgZGVzdHJveVN0YWNrOiBwcm9wcy5kZXN0cm95U3RhY2ssXG4gICAgICBtYW51YWxBcHByb3ZhbHM6IHByb3BzLm1hbnVhbEFwcHJvdmFscyxcbiAgICAgIHRlc3RDb21tYW5kczogcHJvcHMudGVzdENvbW1hbmRzLFxuICAgIH07XG4gICAgY29uc29sZS5pbmZvKGBwaXBlbGluZVN0YWNrUHJvcHM6ICR7SlNPTi5zdHJpbmdpZnkocGlwZWxpbmVTdGFja1Byb3BzLCBudWxsLCAyKX1gKTtcblxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tdW51c2VkLWV4cHJlc3Npb25cbiAgICBuZXcgUGlwZWxpbmVTdGFjayh0aGlzLCBgJHtwcm9wcy5yZXBvc2l0b3J5TmFtZX0tcGlwZWxpbmUtc3RhY2stYnVpbGRgLCBwaXBlbGluZVN0YWNrUHJvcHMpO1xuICAgIHRoaXMuc3ludGgoKTtcbiAgfVxufVxuIl19