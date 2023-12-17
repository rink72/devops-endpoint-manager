import { IAzureApplicationPasswordCredential, IAzureFederatedCredential, IAzureServicePrincipal } from "./models/graph";

export interface IAzureClient
{
    createFederatedCredential(servicePrincipalId: string, federatedCredential: IAzureFederatedCredential): Promise<IAzureFederatedCredential>
    createServicePrincipalSecret(servicePrincipalId: string, secretName: string, endDateTime?: string): Promise<IAzureApplicationPasswordCredential>
    getServicePrincipalByAppId(appId: string): Promise<IAzureServicePrincipal | null>
    getFederatedCredential(appId: string, credentialName: string): Promise<IAzureFederatedCredential | null>
    listServicePrincipalFederatedCredentials(id: string): Promise<IAzureFederatedCredential[]>
    listServicePrincipalSecrets(appId: string): Promise<IAzureApplicationPasswordCredential[]>
    removeServicePrincipalSecret(servicePrincipalId: string, keyId: string): Promise<void>
    updateFederatedCredential(servicePrincipalId: string, federatedCredential: IAzureFederatedCredential): Promise<IAzureFederatedCredential>
}