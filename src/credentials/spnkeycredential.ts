import { IAzureClient } from "../clients/azureclient/iazureclient"
import { IAzureApplicationPasswordCredential, IAzureServicePrincipal } from "../clients/azureclient/models/graph"
import { ILogger } from "../logger/ilogger"
import { IEndpointSpnKeyCredentialConfiguration } from "../readers/endpointconfigurationreader/models/iendpointcredentialconfiguration"
import { ICredential } from "./icredential"

export interface ISpnKeyCredentialProps
{
    logger: ILogger
    azureClient: IAzureClient
    credentialConfiguration: IEndpointSpnKeyCredentialConfiguration
}

export interface ICreateSpnCredentialProps
{
    projectName: string
    servicePrincipalClientId: string
}

export interface IRemoveSpnCredentialProps
{
    projectName: string
    servicePrincipalClientId: string
}

export class SpnKeyCredential implements ICredential
{
    private readonly _logger: ILogger
    private readonly _azureClient: IAzureClient
    private readonly _credentialConfiguration: IEndpointSpnKeyCredentialConfiguration

    constructor(props: ISpnKeyCredentialProps)
    {
        this._logger = props.logger
        this._azureClient = props.azureClient
        this._credentialConfiguration = props.credentialConfiguration
    }

    public async getCredential(): Promise<string>
    {
        this._logger.debug(`Method not implemented for credential type: ${this._credentialConfiguration.type}`)

        throw new Error("Method not implemented.")
    }

    public async createSpnCredential(props: ICreateSpnCredentialProps): Promise<IAzureApplicationPasswordCredential>
    {
        this._logger.verbose(`Creating new secret for <${props.servicePrincipalClientId}> Service Principal`);

        const passwordNamePrefix = `devend-${props.projectName}-`
        const passwordName = `${passwordNamePrefix}${new Date().toISOString()}`
        const passwordEndDate = this.createExpirationDateString()

        const servicePrincipal = await this.getServicePrincipal(props.servicePrincipalClientId)

        const passwordCredential = await this._azureClient.createServicePrincipalSecret(servicePrincipal.id, passwordName, passwordEndDate);

        return passwordCredential
    }

    public async removeObsoleteCredentials(props: IRemoveSpnCredentialProps): Promise<void>
    {
        this._logger.verbose(`Removing obsolete secrets for <${props.servicePrincipalClientId}> Service Principal`);

        const passwordNamePrefix = `devend-${props.projectName}-`

        const servicePrincipal = await this.getServicePrincipal(props.servicePrincipalClientId)

        const obsoleteCredentialsList = (await this._azureClient.listServicePrincipalSecrets(servicePrincipal.id))
            .filter(credential => credential.displayName.startsWith(passwordNamePrefix))
            .filter(credential => credential.endDateTime && new Date(credential.endDateTime) < new Date())

        for (const obsoleteCredential of obsoleteCredentialsList)
        {
            this._logger.debug(`Removing existing <${obsoleteCredential.displayName}> secret for ${props.servicePrincipalClientId} Service Principal`);

            await this._azureClient.removeServicePrincipalSecret(servicePrincipal.id, obsoleteCredential.keyId)
        }
    }

    private async getServicePrincipal(servicePrincipalClientId: string): Promise<IAzureServicePrincipal>
    {
        const servicePrincipal = await this._azureClient.getServicePrincipalByAppId(servicePrincipalClientId);

        if (!servicePrincipal)
        {
            throw new Error(`Service principal with app id ${servicePrincipalClientId} does not exist`)
        }

        return servicePrincipal
    }

    private createExpirationDateString(): string
    {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + this._credentialConfiguration.daysValid);

        return expirationDate.toISOString();
    }
}