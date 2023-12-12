import { ServiceEndpoint } from "azure-devops-node-api/interfaces/TaskAgentInterfaces";

export interface IEndpoint
{
    // createEndpointObject(rotate: boolean, projectId: string, existingEndpoint?: IAzDevServiceEndpoint): Promise<IAzDevServiceEndpoint>
    createEndpoint(rotateCredential: boolean, projectId: string): Promise<ServiceEndpoint>
}