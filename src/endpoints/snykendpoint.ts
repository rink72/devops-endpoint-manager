import { ICredential } from "../credentials/icredential";
import { ILogger } from "../logger/ilogger";
import { ISnykEndpointConfiguration } from "../readers/endpointconfigurationreader/models/iendpointconfiguration";
import { EndpointCredentialType } from "../readers/endpointconfigurationreader/models/iendpointcredentialconfiguration";
import { IAzDevServiceEndpoint } from "../clients/azdevclient/models/iazdevserviceendpoint";
import { IAzDevClient } from "../clients/azdevclient/iazdevclient";
import { EndpointBase } from "./endpointbase";

export interface ISnykEndpointProps
{
    logger: ILogger
    azdevClient: IAzDevClient
    endpointConfiguration: ISnykEndpointConfiguration
    credential: ICredential
}

export class SnykEndpoint extends EndpointBase
{
    private readonly _credential: ICredential

    constructor(props: ISnykEndpointProps)
    {
        super({
            azdevClient: props.azdevClient,
            endpointConfiguration: props.endpointConfiguration,
            logger: props.logger,
            validCredentialTypes: [EndpointCredentialType.EnvironmentVariable, EndpointCredentialType.KeyVault]
        });

        this._credential = props.credential;

        this.validateCredentialType(props.endpointConfiguration.credential);
    }

    protected async createEndpointObject(projectId: string, existingEndpoint?: IAzDevServiceEndpoint): Promise<IAzDevServiceEndpoint>
    {
        this._logger.debug(`Creating endpoint <${this._endpointConfiguration.name}> (${this._endpointConfiguration.type}) configuration object`);

        const credential = await this._credential.getCredential();
        const projectReferences = this.createProjectReferences(projectId, existingEndpoint);

        const serviceEndpoint: IAzDevServiceEndpoint = {
            id: existingEndpoint?.id,
            name: this._endpointConfiguration.name,
            type: "SnykAuth",
            url: (this._endpointConfiguration as ISnykEndpointConfiguration).serverUrl,
            authorization: {
                parameters: {
                    apitoken: credential
                },
                scheme: "Token"
            },
            serviceEndpointProjectReferences: projectReferences
        }

        return serviceEndpoint;
    }
}