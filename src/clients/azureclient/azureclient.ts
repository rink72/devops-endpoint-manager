import { Client } from "@microsoft/microsoft-graph-client";
import { IAzureClient } from "./iazureclient";
import { IAzureApplicationPasswordCredential, IAzureFederatedCredential, IAzureGraphRestResponse, IAzureServicePrincipal } from "./models/graph";
import { ILogger } from "../../logger/ilogger";

export interface IAzureClientProps
{
    logger: ILogger
    graphClient: Client
}

export class AzureClient implements IAzureClient
{
    private readonly _logger: ILogger
    private readonly _graphClient: Client

    constructor(props: IAzureClientProps)
    {
        this._logger = props.logger;
        this._graphClient = props.graphClient;
    }

    public async createFederatedCredential(servicePrincipalId: string, federatedCredential: IAzureFederatedCredential): Promise<IAzureFederatedCredential>
    {
        this._logger.verbose(`Creating federated credential ${federatedCredential.name} for ${servicePrincipalId} service principal`);

        const requestUrl = `/applications/${servicePrincipalId}/federatedIdentityCredentials`;

        const createdCredential: IAzureFederatedCredential = await this._graphClient.api(requestUrl)
            .version("beta")
            .post(federatedCredential)

        return createdCredential;
    }

    public async createServicePrincipalSecret(servicePrincipalId: string, secretName: string, endDateTime?: string): Promise<IAzureApplicationPasswordCredential>
    {
        this._logger.debug(`Creating new secret for ${servicePrincipalId} Service Principal`);

        const requestUrl = `/applications/${servicePrincipalId}/addPassword`;

        const passwordCredential: IAzureApplicationPasswordCredential = await this._graphClient.api(requestUrl)
            .version("beta")
            .post({
                passwordCredential: {
                    displayName: secretName,
                    endDateTime: endDateTime
                }
            })

        if (!passwordCredential?.secretText)
        {
            throw new Error(`Unable to create secret for ${servicePrincipalId} Service Principal`);
        }

        return passwordCredential;
    }

    public async getKeyVaultSecret(keyVaultName: string, secretName: string): Promise<string[]>
    {
        this._logger.debug(`Requesting secret <${secretName}> from <${keyVaultName}> KeyVault`);

        const requestUrl = `/security/keyVaultSecrets/${keyVaultName}/${secretName}`;

        const secret: IAzureGraphRestResponse<string> = await this._graphClient.api(requestUrl)
            .version("beta")
            .get()

        return secret.value;
    }

    public async getServicePrincipalByAppId(appId: string): Promise<IAzureServicePrincipal | null>
    {
        this._logger.debug(`Requesting service principal by app id: ${appId}`);

        const servicePrincipalData: IAzureGraphRestResponse<IAzureServicePrincipal> = await this._graphClient.api("/applications/")
            .version("beta")
            .filter(`appId eq '${appId}'`)
            .top(1)
            .get()

        if (!servicePrincipalData || servicePrincipalData.value.length === 0)
        {
            return null;
        }

        return servicePrincipalData.value[0];
    }

    public async getFederatedCredential(appId: string, credentialName: string): Promise<IAzureFederatedCredential | null>
    {
        this._logger.debug(`Requesting federated credential <${credentialName}> for <${appId}> service principal`);

        const servicePrincipal = await this.getServicePrincipalByAppId(appId);

        if (!servicePrincipal)
        {
            return null;
        }

        const federatedCredentials = await this.listServicePrincipalFederatedCredentials(servicePrincipal.id);

        const federatedCredential = federatedCredentials.find((credential) => credential.name === credentialName);

        if (!federatedCredential)
        {
            return null;
        }

        return federatedCredential;
    }

    public async listServicePrincipalFederatedCredentials(id: string): Promise<IAzureFederatedCredential[]>
    {
        this._logger.debug(`Requesting federated credentials for <${id}> service principal`);

        const requestUrl = `/applications/${id}/federatedIdentityCredentials`;

        const federatedCredentials: IAzureGraphRestResponse<IAzureFederatedCredential> = await this._graphClient.api(requestUrl)
            .version("beta")
            .get()

        return federatedCredentials.value;
    }

    public async listServicePrincipalSecrets(servicePrincipalId: string): Promise<IAzureApplicationPasswordCredential[]>
    {
        this._logger.debug(`Requesting secrets for <${servicePrincipalId}> service principal`);

        const requestUrl = `/applications/${servicePrincipalId}/passwordCredentials`;

        const passwordCredentials: IAzureGraphRestResponse<IAzureApplicationPasswordCredential> = await this._graphClient.api(requestUrl)
            .version("beta")
            .get()

        return passwordCredentials.value;
    }

    public async removeServicePrincipalSecret(servicePrincipalId: string, keyId: string): Promise<void>
    {
        this._logger.debug(`Removing secret <${keyId}> for <${servicePrincipalId}> service principal`);

        const requestUrl = `/applications/${servicePrincipalId}/removePassword`;

        await this._graphClient.api(requestUrl)
            .version("beta")
            .post({
                keyId: keyId
            })
    }

    public async updateFederatedCredential(servicePrincipalId: string, federatedCredential: IAzureFederatedCredential): Promise<IAzureFederatedCredential>
    {
        this._logger.debug(`Updating federated credential <${federatedCredential.name}> for <${servicePrincipalId}> service principal`);

        const requestUrl = `/applications/${servicePrincipalId}/federatedIdentityCredentials/${federatedCredential.id}`;

        const updatedCredential: IAzureFederatedCredential = await this._graphClient.api(requestUrl)
            .version("beta")
            .update(federatedCredential)

        return updatedCredential;
    }
}