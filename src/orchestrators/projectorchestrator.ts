import { IAzDevClient } from "../clients/azdevclient/iazdevclient";
import { IEndpointFactory } from "../endpoints/factories/iendpointfactory";
import { ILogger } from "../logger/ilogger";
import { IEndpointConfiguration } from "../readers/endpointconfigurationreader/models/iendpointconfiguration";
import { IProjectConfiguration } from "../readers/projectconfigurationreader/models/iprojectconfiguration";
import { IProjectOrchestrator } from "./iprojectorchestrator";

export interface IProjectOrchestratorProps
{
    logger: ILogger,
    projectConfiguration: IProjectConfiguration
    endpointsConfiguration: IEndpointConfiguration[]
    endpointFactory: IEndpointFactory
    azDevClient: IAzDevClient
}

export class ProjectOrchestrator implements IProjectOrchestrator
{
    private readonly _logger: ILogger;
    private readonly _projectConfiguration: IProjectConfiguration
    private readonly _endpointsConfiguration: IEndpointConfiguration[]
    private readonly _endpointFactory: IEndpointFactory
    private readonly _azDevClient: IAzDevClient

    constructor(props: IProjectOrchestratorProps)
    {
        this._logger = props.logger;
        this._projectConfiguration = props.projectConfiguration;
        this._endpointsConfiguration = props.endpointsConfiguration;
        this._endpointFactory = props.endpointFactory;
        this._azDevClient = props.azDevClient;
    }

    public async run(rotateCredentials: boolean): Promise<void>
    {
        this._logger.info(`Configuring service endpoints for <${this._projectConfiguration.name}> project`);

        const projectDetails = await this._azDevClient.getProjectByName(this._projectConfiguration.name);

        if (!projectDetails?.id)
        {
            throw new Error(`Project <${this._projectConfiguration.name}> not found`);
        }

        const targetStateEndpoints = this.getTargetStateEndpoints();

        await this.createServiceEndpoints(rotateCredentials, projectDetails.id, targetStateEndpoints);

        await this.removeObsoleteEndpoints(targetStateEndpoints, projectDetails.id);
    }

    private async createServiceEndpoints(rotateCredentials: boolean, projectId: string, targetStateEndpoints: IEndpointConfiguration[])
    {
        this._logger.verbose(`Creating service endpoints for the <${this._projectConfiguration.name}> project`);

        for (const endpointConfiguration of targetStateEndpoints)
        {
            this._logger.verbose(`Configuring <${endpointConfiguration.name}> (${endpointConfiguration.type}) endpoint`);

            const endpoint = await this._endpointFactory.createEndpoint(endpointConfiguration);

            await endpoint.createEndpoint(rotateCredentials, projectId);
        }
    }

    private async removeObsoleteEndpoints(targetStateEndpoints: IEndpointConfiguration[], projectId: string)
    {
        if (!this._projectConfiguration.removeObsoleteEndpoints)
        {
            this._logger.debug(`Not removing obsolete service endpoints for the <${this._projectConfiguration.name}> project`);

            return;
        }

        this._logger.verbose(`Removing obsolete service endpoints for the <${this._projectConfiguration.name}> project`);

        const existingEndpoints = await this._azDevClient.getServiceEndpoints(projectId);

        const endpointsToRemove = existingEndpoints.filter(e => !targetStateEndpoints.some(ec => ec.name === e.name));

        for (const endpoint of endpointsToRemove)
        {
            this._logger.verbose(`Removing obsolete <${endpoint.name}> (${endpoint.type}) endpoint`);

            if (!endpoint.id)
            {
                throw new Error(`Endpoint <${endpoint.name}> has no id and cannot be removed`);
            }

            await this._azDevClient.deleteServiceEndpoint(endpoint.id, projectId);
        }
    }

    private getTargetStateEndpoints(): IEndpointConfiguration[]
    {
        const requiredEndpointNames = this._projectConfiguration.endpoints.map(e => e.name);

        return this._endpointsConfiguration.filter(e => requiredEndpointNames.includes(e.name));
    }
}