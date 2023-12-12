import * as azdev from "azure-devops-node-api"

import { ILogger } from "../../logger/ilogger"
import { IAzDevClient } from "./iazdevclient"
import { TeamProjectReference } from "azure-devops-node-api/interfaces/CoreInterfaces"
import { ServiceEndpoint } from "azure-devops-node-api/interfaces/TaskAgentInterfaces"
import { IAzDevServiceEndpoint, IAzDevServiceEndpointProjectReferences } from "./models/iazdevserviceendpoint"

export interface IAzDevClientProps
{
    logger: ILogger
    azdevConnection: azdev.WebApi
}

export class AzDevClient implements IAzDevClient
{
    private readonly _logger: ILogger
    private readonly _azdevConnection: azdev.WebApi
    private readonly _apiVersion: string = '7.2-preview.4'

    public constructor(props: IAzDevClientProps)
    {
        this._logger = props.logger
        this._azdevConnection = props.azdevConnection
    }

    public async getProjects(): Promise<TeamProjectReference[]>
    {
        try
        {
            this._logger.debug(`Retrieving projects from <${this._azdevConnection.serverUrl}> organization`);

            const coreApi = await this._azdevConnection.getCoreApi();

            return await coreApi.getProjects()
        }
        catch (error)
        {
            this._logger.error(`Error retrieving projects: ${error}`);
            throw error;
        }
    }

    public async getProjectByName(projectName: string): Promise<TeamProjectReference>
    {
        try
        {
            this._logger.debug(`Retrieving project <${projectName}>`);

            const projects = await this.getProjects();

            const project = projects.find(p => p.name === projectName);

            if (!project)
            {
                throw new Error(`Project <${projectName}> not found`);
            }

            return project;
        }
        catch (error)
        {
            this._logger.error(`Error retrieving project: ${error}`);
            throw error;
        }
    }

    public async getServiceEndpoints(projectId: string): Promise<IAzDevServiceEndpoint[]>
    {
        this._logger.debug(`Retrieving service endpoints for <${projectId}> project`);

        const client = this._azdevConnection.rest;
        const url = `${this._azdevConnection.serverUrl}/${projectId}/_apis/serviceendpoint/endpoints?api-version=${this._apiVersion}`;

        const response = await client.get(url);

        return (response.result as { value: IAzDevServiceEndpoint[] }).value;
    }

    public async getServiceEndpointByName(projectId: string, endpointName: string): Promise<IAzDevServiceEndpoint | undefined>
    {
        this._logger.debug(`Retrieving <${endpointName}> service endpoint for <${projectId}> project`);

        const client = this._azdevConnection.rest;
        const url = `${this._azdevConnection.serverUrl}/${projectId}/_apis/serviceendpoint/endpoints?endpointNames=${endpointName}&api-version=${this._apiVersion}`;

        const response = await client.get(url);

        const endpoint = (response.result as { value: IAzDevServiceEndpoint[] }).value;

        if (!endpoint || endpoint.length === 0)
        {
            return
        }

        return endpoint[0];
    }

    public async createServiceEndpoint(serviceEndpoint: ServiceEndpoint): Promise<IAzDevServiceEndpoint>
    {
        this._logger.debug(`Making <${serviceEndpoint.name}> service endpoint creation request`);

        const client = this._azdevConnection.rest;
        const url = `${this._azdevConnection.serverUrl}/_apis/serviceendpoint/endpoints?api-version=${this._apiVersion}`;

        return (await client.create(url, serviceEndpoint)).result as IAzDevServiceEndpoint;
    }

    public async updateServiceEndpoint(serviceEndpoint: ServiceEndpoint): Promise<IAzDevServiceEndpoint>
    {
        this._logger.debug(`Making <${serviceEndpoint.name}> service endpoint update request`);

        const client = this._azdevConnection.rest;
        const url = `${this._azdevConnection.serverUrl}/_apis/serviceendpoint/endpoints/${serviceEndpoint.id}?api-version=${this._apiVersion}`;

        return (await client.replace(url, serviceEndpoint)).result as IAzDevServiceEndpoint;
    }

    public async deleteServiceEndpoint(endpointId: string, projectId: string): Promise<void>
    {
        this._logger.debug(`Making <${endpointId}> service endpoint deletion request`);

        const client = this._azdevConnection.rest;
        const url = `${this._azdevConnection.serverUrl}/_apis/serviceendpoint/endpoints/${endpointId}?projectIds=${projectId}&deep=true&api-version=${this._apiVersion}`;

        await client.del(url);
    }

    public async shareServiceEndpoint(endpointId: string, projectReferences: IAzDevServiceEndpointProjectReferences[]): Promise<void>
    {
        this._logger.debug(`Making <${endpointId}> service endpoint sharing request`);

        const client = this._azdevConnection.rest;
        const url = `${this._azdevConnection.serverUrl}/_apis/serviceendpoint/endpoints/${endpointId}?api-version=${this._apiVersion}`;

        await client.update(url, projectReferences);
    }
}