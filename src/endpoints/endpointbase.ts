import { IAzDevClient } from "../clients/azdevclient/iazdevclient";
import { IAzDevServiceEndpoint, IAzDevServiceEndpointProjectReferences } from "../clients/azdevclient/models/iazdevserviceendpoint";
import { ILogger } from "../logger/ilogger";
import { IEndpointConfiguration } from "../readers/endpointconfigurationreader/models/iendpointconfiguration";
import { EndpointCredentialType, IEndpointCredentialConfiguration } from "../readers/endpointconfigurationreader/models/iendpointcredentialconfiguration";
import { IEndpoint } from "./iendpoint";

export interface IEndpointBaseProps
{
    logger: ILogger
    endpointConfiguration: IEndpointConfiguration
    azdevClient: IAzDevClient,
    validCredentialTypes?: EndpointCredentialType[]
}

export abstract class EndpointBase implements IEndpoint
{
    protected readonly _logger: ILogger;
    protected readonly _endpointConfiguration: IEndpointConfiguration;
    protected readonly _azdevClient: IAzDevClient;
    protected readonly _validCredentialTypes: EndpointCredentialType[];

    constructor(props: IEndpointBaseProps)
    {
        this._logger = props.logger;
        this._endpointConfiguration = props.endpointConfiguration;
        this._azdevClient = props.azdevClient;
        this._validCredentialTypes = props.validCredentialTypes ?? [];
    }

    protected abstract createEndpointObject(rotateCredential: boolean, projectId: string, existingEndpoint?: IAzDevServiceEndpoint): Promise<IAzDevServiceEndpoint>;

    public async createEndpoint(rotateCredential: boolean, projectId: string): Promise<IAzDevServiceEndpoint>
    {
        this._logger.debug(`Creating endpoint <${this._endpointConfiguration.name}> (${this._endpointConfiguration.type})`);

        const existingEndpoint = await this.getExistingEndpoint(projectId);
        const endpointObject = await this.createEndpointObject(rotateCredential, projectId, existingEndpoint);

        if (existingEndpoint)
        {
            this._logger.verbose(`Updating <${this._endpointConfiguration.name}> (${this._endpointConfiguration.type}) endpoint`);

            return await this._azdevClient.updateServiceEndpoint(endpointObject);

        }

        this._logger.verbose(`Creating <${this._endpointConfiguration.name}> (${this._endpointConfiguration.type}) endpoint`);

        return await this._azdevClient.createServiceEndpoint(endpointObject);
    }

    protected async getExistingEndpoint(projectId: string): Promise<IAzDevServiceEndpoint | undefined>
    {
        const existingEndpoint = await this._azdevClient.getServiceEndpointByName(projectId, this._endpointConfiguration.name);

        return existingEndpoint;
    }

    protected createProjectReferences(projectId: string, existingEndpoint?: IAzDevServiceEndpoint): IAzDevServiceEndpointProjectReferences[]
    {
        const combinedReferences = [
            ...(existingEndpoint?.serviceEndpointProjectReferences ?? []),
            {
                projectReference: {
                    id: projectId
                },
                name: this._endpointConfiguration.name
            }
        ];

        const uniqueReferences = combinedReferences.filter((reference, index, self) =>
        {
            return index === self.findIndex((t) => (
                t.projectReference.id === reference.projectReference.id
            ))
        });

        return uniqueReferences;
    }

    protected validateCredentialType(credential: IEndpointCredentialConfiguration): void
    {
        if (!this._validCredentialTypes.includes(credential.type))
        {
            throw new Error(`Invalid credential type <$credential.type}> for <${this._endpointConfiguration.name}> endpoint`);
        }
    }
}