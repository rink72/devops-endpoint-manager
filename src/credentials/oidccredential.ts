import { IAzureClient } from "../clients/azureclient/iazureclient"
import { IAzureFederatedCredential } from "../clients/azureclient/models/graph"
import { ILogger } from "../logger/ilogger"
import { IEndpointOidcCredentialConfiguration } from "../readers/endpointconfigurationreader/models/iendpointcredentialconfiguration"
import { ICredential } from "./icredential"

export interface IOidcCredentialProps
{
    logger: ILogger
    azureClient: IAzureClient
    credentialConfiguration: IEndpointOidcCredentialConfiguration
}

export interface ICreateFedratedCredentialProps
{
    name: string
    servicePrincipalClientId: string
    subject: string
    issuer: string
}

export class OidcCredential implements ICredential
{
    private readonly _logger: ILogger
    private readonly _azureClient: IAzureClient
    private readonly _credentialConfiguration: IEndpointOidcCredentialConfiguration

    constructor(props: IOidcCredentialProps)
    {
        this._logger = props.logger
        this._azureClient = props.azureClient
        this._credentialConfiguration = props.credentialConfiguration
    }

    public async getCredential(): Promise<string>
    {
        this._logger.debug(`Method not implemented for <${this._credentialConfiguration.type}> credential type`)

        throw new Error("Method not implemented.")
    }

    public async createFederatedCredential(props: ICreateFedratedCredentialProps): Promise<IAzureFederatedCredential>
    {
        const servicePrincipal = await this._azureClient.getServicePrincipalByAppId(props.servicePrincipalClientId);

        if (!servicePrincipal)
        {
            throw new Error(`Service principal with app id ${props.servicePrincipalClientId} does not exist`)
        }

        const existingCredential = await this._azureClient.getFederatedCredential(props.servicePrincipalClientId, props.name)

        const federatedCredential: IAzureFederatedCredential = {
            audiences: ["api://AzureADTokenExchange"],
            description: props.name,
            issuer: props.issuer,
            name: props.name,
            subject: props.subject
        }

        if (existingCredential)
        {
            this._logger.debug(`Updating <${props.name}> federated credential for <${props.servicePrincipalClientId}> service principal`)

            if (!existingCredential.id)
            {
                throw new Error(`Existing <${props.name}> federated credential for <${props.servicePrincipalClientId}> service principal does not have an id`)
            }

            federatedCredential.id = existingCredential.id

            return this._azureClient.updateFederatedCredential(servicePrincipal.id, federatedCredential);
        }

        this._logger.debug(`Creating <${props.name}> federated credential for <${servicePrincipal.id}> service principal`)

        return this._azureClient.createFederatedCredential(servicePrincipal.id, federatedCredential);
    }

}