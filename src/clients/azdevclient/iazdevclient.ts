import { TeamProjectReference } from "azure-devops-node-api/interfaces/CoreInterfaces"
import { IAzDevServiceEndpoint, IAzDevServiceEndpointProjectReferences } from "./models/iazdevserviceendpoint"

export interface IAzDevClient
{
    getProjectByName(projectName: string): Promise<TeamProjectReference>
    getProjects(): Promise<TeamProjectReference[]>
    getServiceEndpoints(projectId: string): Promise<IAzDevServiceEndpoint[]>
    getServiceEndpointByName(projectId: string, endpointName: string): Promise<IAzDevServiceEndpoint | undefined>
    createServiceEndpoint(endpoint: IAzDevServiceEndpoint): Promise<IAzDevServiceEndpoint>
    updateServiceEndpoint(endpoint: IAzDevServiceEndpoint): Promise<IAzDevServiceEndpoint>
    deleteServiceEndpoint(endpointId: string, projectId: string): Promise<void>
    shareServiceEndpoint(endpointId: string, projectReferences: IAzDevServiceEndpointProjectReferences[]): Promise<void>
}