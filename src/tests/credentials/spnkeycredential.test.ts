import { IAzureApplicationPasswordCredential, IAzureServicePrincipal } from "../../clients/azureclient/models/graph";
import { ICreateSpnCredentialProps, IRemoveSpnCredentialProps, SpnKeyCredential } from "../../credentials/spnkeycredential";
import { azureClientMock } from "../_mocks/azureClientMock";
import { spnCredentialConfigurationMock } from "../_mocks/credentialConfigurationMock";
import { loggerMock } from "../_mocks/mocks";


describe('SpnKeyCredential', () =>
{
    let spnKeyCredential: SpnKeyCredential;

    const servicePrincipalMock: IAzureServicePrincipal = {
        appId: 'test-app-id',
        displayName: 'test-display-name',
        id: 'test-id',
        objectId: 'test-object-id',
        tenantId: 'test-tenant-id',
        type: 'test-type'
    }

    const credentialOneMock: IAzureApplicationPasswordCredential = {
        customKeyIdentifier: 'test-key-id',
        keyId: 'test-key-id',
        displayName: 'test-display-name',
        hint: 'test-hint',
        endDateTime: 'test-end-date',
        secretText: 'test-secret-text',
        startDateTime: 'test-start-date',
    }

    const crendentialTwoMock: IAzureApplicationPasswordCredential = {
        customKeyIdentifier: 'test-two-key-id',
        keyId: 'test-two-key-id',
        displayName: 'test-two-display-name',
        hint: 'test-two-hint',
        endDateTime: 'test-two-end-date',
        secretText: 'test-two-secret-text',
        startDateTime: 'test-two-start-date'
    }

    const credentialListMock: IAzureApplicationPasswordCredential[] = [
        credentialOneMock,
        crendentialTwoMock
    ];

    beforeEach(() =>
    {
        spnKeyCredential = new SpnKeyCredential({
            logger: loggerMock,
            azureClient: azureClientMock,
            credentialConfiguration: spnCredentialConfigurationMock,
        });
    });

    it('should throw an error on getCredential', async () =>
    {
        await expect(spnKeyCredential.getCredential()).rejects.toThrow("Method not implemented.");
    });

    it('should create a new SPN credential', async () =>
    {
        const credentialMock: IAzureApplicationPasswordCredential = {
            customKeyIdentifier: 'test-key-id',
            keyId: 'test-key-id',
            displayName: 'test-display-name',
            hint: 'test-hint',
            endDateTime: 'test-end-date',
            secretText: 'test-secret-text',
            startDateTime: 'test-start-date',
        }

        const createProps: ICreateSpnCredentialProps = {
            projectName: 'TestProject',
            servicePrincipalClientId: 'test-client-id',
        };

        azureClientMock.getServicePrincipalByAppId.mockResolvedValue(servicePrincipalMock);
        azureClientMock.createServicePrincipalSecret.mockResolvedValue(credentialMock);

        azureClientMock.createServicePrincipalSecret.mockResolvedValue(credentialMock);

        const result = await spnKeyCredential.createSpnCredential(createProps);

        expect(azureClientMock.getServicePrincipalByAppId).toHaveBeenCalled();
        expect(azureClientMock.createServicePrincipalSecret).toHaveBeenCalled();
        expect(result).toEqual(credentialMock);
    });

    it('should remove obsolete credentials', async () =>
    {
        const removeProps: IRemoveSpnCredentialProps = {
            projectName: 'TestProject',
            servicePrincipalClientId: 'test-client-id',
        };

        azureClientMock.getServicePrincipalByAppId.mockResolvedValue(servicePrincipalMock);
        azureClientMock.listServicePrincipalSecrets.mockResolvedValue(credentialListMock);
        azureClientMock.removeServicePrincipalSecret.mockResolvedValue();

        await spnKeyCredential.removeObsoleteCredentials(removeProps);

        expect(azureClientMock.listServicePrincipalSecrets).toHaveBeenCalled();
        expect(azureClientMock.removeServicePrincipalSecret).toHaveBeenCalled();
    });
});
