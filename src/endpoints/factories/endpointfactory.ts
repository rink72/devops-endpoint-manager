/* eslint-disable indent */
import { IAzDevClient } from "../../clients/azdevclient/iazdevclient";
import { IAzureClient } from "../../clients/azureclient/iazureclient";
import { ICredentialFactory } from "../../credentials/factories/icredentialfactory";
import { ILogger } from "../../logger/ilogger";
import { EndpointType, IAzureEndpointConfiguration, IEndpointConfiguration, ISharedEndpointConfiguration, ISnykEndpointConfiguration, ISonarCloudEndpointConfiguration } from "../../readers/endpointconfigurationreader/models/iendpointconfiguration";
import { AzureEndpoint } from "../azureendpoint";
import { IEndpoint } from "../iendpoint";
import { SharedEndpoint } from "../sharedendpoint";
import { SnykEndpoint } from "../snykendpoint";
import { SonarCloudEndpoint } from "../sonarcloudendpoint";
import { IEndpointFactory } from "./iendpointfactory";

export interface IEndpointFactoryProps
{
    logger: ILogger
    credentialFactory: ICredentialFactory
    azDevClient: IAzDevClient
    azureClient?: IAzureClient
}

export class EndpointFactory implements IEndpointFactory
{
    private readonly _logger: ILogger
    private readonly _credentialFactory: ICredentialFactory
    private readonly _azDevClient: IAzDevClient

    constructor(props: IEndpointFactoryProps)
    {
        this._logger = props.logger;
        this._credentialFactory = props.credentialFactory;
        this._azDevClient = props.azDevClient;
    }

    public async createEndpoint(endpointConfiguration: IEndpointConfiguration): Promise<IEndpoint>
    {
        switch (endpointConfiguration.type)
        {
            case EndpointType.SonarCloud:
                {
                    const sonarCloudEndpoint = endpointConfiguration as ISonarCloudEndpointConfiguration;
                    const credential = await this._credentialFactory.createCredential(sonarCloudEndpoint.credential);

                    return new SonarCloudEndpoint({
                        logger: this._logger,
                        azdevClient: this._azDevClient,
                        endpointConfiguration: sonarCloudEndpoint,
                        credential: credential
                    });
                }

            case EndpointType.Snyk:
                {
                    const snykEndpoint = endpointConfiguration as ISnykEndpointConfiguration;
                    const credential = await this._credentialFactory.createCredential(snykEndpoint.credential);

                    return new SnykEndpoint({
                        logger: this._logger,
                        azdevClient: this._azDevClient,
                        endpointConfiguration: snykEndpoint,
                        credential: credential
                    });
                }

            case EndpointType.Azure:
                {
                    const azureEndpoint = endpointConfiguration as IAzureEndpointConfiguration;
                    const credential = await this._credentialFactory.createCredential(azureEndpoint.credential);

                    return new AzureEndpoint({
                        logger: this._logger,
                        azdevClient: this._azDevClient,
                        endpointConfiguration: azureEndpoint,
                        credential: credential
                    });
                }

            case EndpointType.Shared:
                {
                    const sharedEndpoint = endpointConfiguration as ISharedEndpointConfiguration;

                    return new SharedEndpoint({
                        logger: this._logger,
                        azdevClient: this._azDevClient,
                        endpointConfiguration: sharedEndpoint,
                        azDevClient: this._azDevClient
                    });
                }

            default:
                throw new Error(`Unknown endpoint type <${endpointConfiguration.type}>`);
        }
    }
}