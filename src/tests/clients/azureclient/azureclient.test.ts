import { AzureClient } from "../../../clients/azureclient/azureclient";
import { IAzureClient } from "../../../clients/azureclient/iazureclient";
import { IAzureApplicationPasswordCredential, IAzureFederatedCredential, IAzureServicePrincipal } from "../../../clients/azureclient/models/graph";
import { apiMock, graphClientMock } from "../../_mocks/graphClientMock";
import { loggerMock } from "../../_mocks/mocks";

jest.mock('@microsoft/microsoft-graph-client');

describe('AzureClient', () =>
{
    let azureClient: IAzureClient;

    const servicePrincipalMock: IAzureServicePrincipal = {
        appId: 'appId',
        id: 'id',
        displayName: 'displayName',
        objectId: 'objectId',
        tenantId: 'tenantId',
        type: 'type'
    };

    const federatedCredentialMock: IAzureFederatedCredential = {
        audiences: ['audience'],
        issuer: 'issuer',
        description: 'description',
        name: 'name',
        subject: 'subject'
    };

    const appPasswordCredentialMock: IAzureApplicationPasswordCredential = {
        customKeyIdentifier: 'customKeyIdentifier',
        displayName: 'displayName',
        endDateTime: 'endDateTime',
        hint: 'hint',
        keyId: 'keyId',
        secretText: 'secretText',
        startDateTime: 'startDateTime'
    };

    beforeEach(() =>
    {
        apiMock.post.mockClear();
        apiMock.get.mockClear();
        apiMock.top.mockClear();

        azureClient = new AzureClient({ logger: loggerMock, graphClient: graphClientMock });
    });

    it('should create federated credential', async () =>
    {
        apiMock.post.mockResolvedValue(federatedCredentialMock);

        const result = await azureClient.createFederatedCredential('servicePrincipalId', federatedCredentialMock);

        expect(apiMock.post).toHaveBeenCalledTimes(1);
        expect(apiMock.post).toHaveBeenCalledWith(federatedCredentialMock);
        expect(result).toEqual(federatedCredentialMock);
    });

    it('should create service principal secret', async () =>
    {
        const passworkCredentialMock = {
            passwordCredential: {
                displayName: 'secretName',
                endDateTime: undefined
            }
        }

        apiMock.post.mockResolvedValue(appPasswordCredentialMock);

        const result = await azureClient.createServicePrincipalSecret('servicePrincipalId', 'secretName');

        expect(apiMock.post).toHaveBeenCalledTimes(1);
        expect(apiMock.post).toHaveBeenCalledWith(passworkCredentialMock);

        expect(result).toEqual(appPasswordCredentialMock);
    });

    it('should get service principal by app ID', async () =>
    {
        apiMock.get.mockResolvedValue({ value: [servicePrincipalMock] });

        const sp = await azureClient.getServicePrincipalByAppId('targetAppId');

        expect(apiMock.get).toHaveBeenCalledTimes(1);
        expect(apiMock.top).toHaveBeenCalledWith(1);
        expect(apiMock.filter).toHaveBeenCalledWith(`appId eq 'targetAppId'`);
        expect(sp).toEqual(servicePrincipalMock);
    });

    it('should return null if service principal not found', async () =>
    {
        apiMock.get.mockResolvedValue({ value: [] });

        const sp = await azureClient.getServicePrincipalByAppId('targetAppId');

        expect(apiMock.get).toHaveBeenCalledTimes(1);
        expect(apiMock.top).toHaveBeenCalledWith(1);
        expect(apiMock.filter).toHaveBeenCalledWith(`appId eq 'targetAppId'`);
        expect(sp).toBeNull();
    });

    it('should get federated credential', async () =>
    {
        azureClient.getServicePrincipalByAppId = jest.fn().mockResolvedValue(servicePrincipalMock);
        azureClient.listServicePrincipalFederatedCredentials = jest.fn().mockResolvedValue([federatedCredentialMock]);

        apiMock.get.mockResolvedValue({ value: [federatedCredentialMock] });

        const result = await azureClient.getFederatedCredential(servicePrincipalMock.appId, federatedCredentialMock.name);

        expect(azureClient.getServicePrincipalByAppId).toHaveBeenCalledTimes(1);
        expect(azureClient.listServicePrincipalFederatedCredentials).toHaveBeenCalledTimes(1);
        expect(result).toEqual(federatedCredentialMock);
    });

    it('should return null if federated credential not found', async () =>
    {
        azureClient.getServicePrincipalByAppId = jest.fn().mockResolvedValue(servicePrincipalMock);
        azureClient.listServicePrincipalFederatedCredentials = jest.fn().mockResolvedValue([federatedCredentialMock]);

        const result = await azureClient.getFederatedCredential(servicePrincipalMock.appId, "invalid-name");

        expect(azureClient.getServicePrincipalByAppId).toHaveBeenCalledTimes(1);
        expect(azureClient.listServicePrincipalFederatedCredentials).toHaveBeenCalledTimes(1);
        expect(result).toBeNull();
    });

    it('should list service principal federated credentials', async () =>
    {
        apiMock.get.mockResolvedValue({ value: [federatedCredentialMock] });

        const result = await azureClient.listServicePrincipalFederatedCredentials('servicePrincipalId');

        expect(apiMock.get).toHaveBeenCalledTimes(1);
        expect(result).toEqual([federatedCredentialMock]);
    });

    it('should list service principal secrets', async () =>
    {
        apiMock.get.mockResolvedValue({ value: [appPasswordCredentialMock] });

        const result = await azureClient.listServicePrincipalSecrets('servicePrincipalId');

        expect(apiMock.get).toHaveBeenCalledTimes(1);
        expect(result).toEqual([appPasswordCredentialMock]);
    });

    it('should remove service principal secret', async () =>
    {
        await azureClient.removeServicePrincipalSecret('servicePrincipalId', 'keyId');

        expect(apiMock.post).toHaveBeenCalledTimes(1);
        expect(apiMock.post).toHaveBeenCalledWith({ keyId: 'keyId' });
    });

    it('should update federated credential', async () =>
    {
        apiMock.update.mockResolvedValue(federatedCredentialMock);

        const result = await azureClient.updateFederatedCredential('servicePrincipalId', federatedCredentialMock);

        expect(apiMock.update).toHaveBeenCalledTimes(1);
        expect(apiMock.update).toHaveBeenCalledWith(federatedCredentialMock);
        expect(result).toEqual(federatedCredentialMock);
    });
});
