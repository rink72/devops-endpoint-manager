import { IAzureFederatedCredential, IAzureServicePrincipal } from "./models/graph";

export interface IAzureClient
{
    createFederatedCredential(servicePrincipalId: string, federatedCredential: IAzureFederatedCredential): Promise<IAzureFederatedCredential>
    updateFederatedCredential(servicePrincipalId: string, federatedCredential: IAzureFederatedCredential): Promise<IAzureFederatedCredential>
    getServicePrincipalByAppId(appId: string): Promise<IAzureServicePrincipal | null>
    getFederatedCredential(appId: string, credentialName: string): Promise<IAzureFederatedCredential | null>
    listServicePrincipalFederatedCredentials(id: string): Promise<IAzureFederatedCredential[]>
}