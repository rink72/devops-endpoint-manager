import { ICredential } from "../credentials/icredential";
import { ILogger } from "../logger/ilogger";
import { ISonarCloudEndpointConfiguration } from "../readers/endpointconfigurationreader/models/iendpointconfiguration";
import { EndpointCredentialType } from "../readers/endpointconfigurationreader/models/iendpointcredentialconfiguration";
import { IAzDevServiceEndpoint } from "../clients/azdevclient/models/iazdevserviceendpoint";
import { EndpointBase } from "./endpointbase";
import { IAzDevClient } from "../clients/azdevclient/iazdevclient";

export interface ISonarCloudEndpointProps
{
    logger: ILogger
    azdevClient: IAzDevClient
    endpointConfiguration: ISonarCloudEndpointConfiguration
    credential: ICredential
}

export class SonarCloudEndpoint extends EndpointBase
{
    private readonly _credential: ICredential

    constructor(props: ISonarCloudEndpointProps)
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

    protected async createEndpointObject(rotateCredential: boolean, projectId: string, existingEndpoint?: IAzDevServiceEndpoint): Promise<IAzDevServiceEndpoint>
    {
        this._logger.debug(`Creating endpoint <${this._endpointConfiguration.name}> (${this._endpointConfiguration.type}) configuration object`);

        const credential = await this._credential.getCredential(rotateCredential);
        const projectReferences = this.createProjectReferences(projectId, existingEndpoint);

        const serviceEndpoint: IAzDevServiceEndpoint = {
            id: existingEndpoint?.id,
            name: this._endpointConfiguration.name,
            type: "sonarcloud",
            url: "https://sonarcloud.io",
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