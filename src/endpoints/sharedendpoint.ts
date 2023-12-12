import { ILogger } from "../logger/ilogger";
import { ISharedEndpointConfiguration } from "../readers/endpointconfigurationreader/models/iendpointconfiguration";
import { IAzDevServiceEndpoint, IAzDevServiceEndpointProjectReferences } from "../clients/azdevclient/models/iazdevserviceendpoint";
import { IAzDevClient } from "../clients/azdevclient/iazdevclient";
import { EndpointBase } from "./endpointbase";

export interface ISharedEndpointProps
{
    logger: ILogger
    azdevClient: IAzDevClient
    endpointConfiguration: ISharedEndpointConfiguration
    azDevClient: IAzDevClient
}

export class SharedEndpoint extends EndpointBase
{
    constructor(props: ISharedEndpointProps)
    {
        super({
            azdevClient: props.azdevClient,
            endpointConfiguration: props.endpointConfiguration,
            logger: props.logger
        });
    }

    public async createEndpoint(rotateCredential: boolean, projectId: string): Promise<IAzDevServiceEndpoint>
    {
        if (rotateCredential) 
        {
            this._logger.verbose(`Rotating credentials for <${this._endpointConfiguration.name}> (${this._endpointConfiguration.type}) endpoint is not supported`);
        }

        const endpointConfiguration = this._endpointConfiguration as ISharedEndpointConfiguration;

        this._logger.debug(`Sharing <${endpointConfiguration.name}> endpoint from ${endpointConfiguration.sourceProject} project`);

        return await this.shareEndpoint(endpointConfiguration.sourceProject, projectId);
    }

    // @ts-expect-error Unused endpoint for this endpoint type
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async createEndpointObject(rotateCredential: boolean, projectId: string, existingEndpoint?: IAzDevServiceEndpoint): Promise<IAzDevServiceEndpoint>
    {
        throw new Error("Method not implemented.");
    }

    private async shareEndpoint(sourceProjectName: string, projectId: string): Promise<IAzDevServiceEndpoint>
    {
        this._logger.debug(`Creating endpoint <${this._endpointConfiguration.name}> (${this._endpointConfiguration.type}) configuration object`);

        const sourceEndpoint = await this.getSourceEndpoint(sourceProjectName, this._endpointConfiguration.name);

        if (!sourceEndpoint?.id)
        {
            throw new Error(`Unable to find <${this._endpointConfiguration.name}> endpoint in <${sourceProjectName}> project`);
        }

        const existingProjectReference = sourceEndpoint.serviceEndpointProjectReferences?.find(x => x.projectReference.id === projectId);

        if (existingProjectReference)
        {
            this._logger.verbose(`Endpoint <${this._endpointConfiguration.name}> (${this._endpointConfiguration.type}) is already shared with <${projectId}> project`);

            return sourceEndpoint;
        }

        const projectReferences = this.createProjectReference(projectId);

        await this._azdevClient.shareServiceEndpoint(sourceEndpoint.id, projectReferences);

        const updatedEndpoint = await this.getSourceEndpoint(sourceProjectName, this._endpointConfiguration.name);

        if (!updatedEndpoint?.id)
        {
            throw new Error(`Unable to find updated <${this._endpointConfiguration.name}> endpoint in <${sourceProjectName}> project`);
        }

        return updatedEndpoint;
    }

    private async getSourceEndpoint(sourceProjectName: string, endpointName: string): Promise<IAzDevServiceEndpoint>
    {
        const sourceProject = await this._azdevClient.getProjectByName(sourceProjectName);

        if (!sourceProject?.id)
        {
            throw new Error(`Unable to find source project <${sourceProjectName}>`);
        }

        const endpoint = await this._azdevClient.getServiceEndpointByName(sourceProject.id, endpointName);

        if (!endpoint)
        {
            throw new Error(`Unable to find <${endpointName}> endpoint in <${sourceProjectName}> project`);
        }

        return endpoint;
    }

    private createProjectReference(projectId: string): IAzDevServiceEndpointProjectReferences[]
    {
        const reference = [
            {
                projectReference: {
                    id: projectId
                },
                name: this._endpointConfiguration.name
            }
        ]

        return reference;
    }
}