/* eslint-disable @typescript-eslint/no-explicit-any */
import { EndpointAuthorization } from "azure-devops-node-api/interfaces/TaskAgentInterfaces";
import { IAzDevServiceEndpoint } from "../../clients/azdevclient/models/iazdevserviceendpoint";
import { AzureEndpoint } from "../../endpoints/azureendpoint";
import { EndpointType } from "../../readers/endpointconfigurationreader/models/iendpointconfiguration";
import { azdevClientMock } from "../_mocks/azdevClientMock";
import { azureClientMock } from "../_mocks/azureClientMock";
import { azureDefaultEndpointConfigurationMock, azureOidcEndpointConfigurationMock, azureSpnKeyEndpointConfigurationMock, credentialMock, oidcCredentialMock, spnKeyCredentialMock } from "../_mocks/configurationMocks";
import { loggerMock } from "../_mocks/mocks";

describe('AzureEndpoint', () =>
{
    let azureEndpoint: AzureEndpoint;
    let endpointMock: IAzDevServiceEndpoint;

    beforeEach(() =>
    {
        jest.clearAllMocks();

        endpointMock = {
            id: 'endpoint-id',
            name: 'endpoint-name',
            type: EndpointType.Azure,
            url: 'https://endpoint-url',
            createdBy: {
                id: 'created-by-id',
                displayName: 'created-by-name'
            },
            description: 'endpoint-description',
            authorization: {
                parameters: {
                    tenantid: 'tenant-id',
                    serviceprincipalid: 'service-principal-id',
                    authenticationType: 'spnKey',
                    serviceprincipalkey: 'service-principal-key'
                },
                scheme: 'ServicePrincipal'
            },
            isReady: true,
            owner: 'owner',
            serviceEndpointProjectReferences: [
                {
                    projectReference: {
                        id: 'project-id',
                        name: 'project-name'
                    },
                    name: 'project-reference-name'
                }
            ]
        }

        azureEndpoint = new AzureEndpoint({
            azdevClient: azdevClientMock,
            logger: loggerMock,
            azureClient: azureClientMock,
            credential: credentialMock,
            endpointConfiguration: azureDefaultEndpointConfigurationMock
        });
    });

    it('should create a new endpoint if one does not exist', async () =>
    {
        jest.spyOn(azureEndpoint as any, 'getExistingEndpoint').mockResolvedValue(undefined);
        jest.spyOn(azureEndpoint as any, 'createEndpointObject').mockReturnValue(endpointMock);
        azdevClientMock.createServiceEndpoint.mockResolvedValue(endpointMock);

        const result = await azureEndpoint.createEndpoint('project-id');

        expect(azdevClientMock.createServiceEndpoint).toHaveBeenCalledTimes(1);
        expect(azdevClientMock.createServiceEndpoint).toHaveBeenCalledWith(endpointMock);
        expect(result).toEqual(endpointMock);
    });

    it('should update an existing endpoint if one exists', async () =>
    {
        jest.spyOn(azureEndpoint as any, 'getExistingEndpoint').mockResolvedValue(endpointMock);
        jest.spyOn(azureEndpoint as any, 'createEndpointObject').mockReturnValue(endpointMock);
        azdevClientMock.updateServiceEndpoint.mockResolvedValue(endpointMock);

        const result = await azureEndpoint.createEndpoint('project-id');

        expect(azdevClientMock.updateServiceEndpoint).toHaveBeenCalledTimes(1);
        expect(azdevClientMock.updateServiceEndpoint).toHaveBeenCalledWith(endpointMock);
        expect(azdevClientMock.createServiceEndpoint).not.toHaveBeenCalled();
        expect(result).toEqual(endpointMock);
    });

    it('should throw if federated credential parameters are not returned from Azure DevOps', async () =>
    {
        azureEndpoint = new AzureEndpoint({
            azdevClient: azdevClientMock,
            logger: loggerMock,
            azureClient: azureClientMock,
            credential: credentialMock,
            endpointConfiguration: azureOidcEndpointConfigurationMock
        });

        jest.spyOn(azureEndpoint as any, 'getExistingEndpoint').mockResolvedValue(undefined);
        jest.spyOn(azureEndpoint as any, 'createEndpointObject').mockReturnValue(endpointMock);
        azdevClientMock.createServiceEndpoint.mockResolvedValue(endpointMock);

        await expect(azureEndpoint.createEndpoint('project-id')).rejects.toThrow();
    });

    it('should created federated credential endpoint', async () =>
    {
        const authorizationMock: EndpointAuthorization = {
            parameters: {
                tenantid: 'tenant-id',
                serviceprincipalid: 'service-principal-id',
                authenticationType: 'spnKey',
                serviceprincipalkey: 'service-principal-key',
                workloadIdentityFederationSubject: 'subject',
                workloadIdentityFederationIssuer: 'issuer'
            }
        }

        endpointMock.authorization = authorizationMock;

        azureEndpoint = new AzureEndpoint({
            azdevClient: azdevClientMock,
            logger: loggerMock,
            azureClient: azureClientMock,
            credential: oidcCredentialMock,
            endpointConfiguration: azureOidcEndpointConfigurationMock
        });

        jest.spyOn(azureEndpoint as any, 'getExistingEndpoint').mockResolvedValue(undefined);
        jest.spyOn(azureEndpoint as any, 'createEndpointObject').mockReturnValue(endpointMock);
        azdevClientMock.createServiceEndpoint.mockResolvedValue(endpointMock);

        const result = await azureEndpoint.createEndpoint('project-id');

        expect(azdevClientMock.createServiceEndpoint).toHaveBeenCalledTimes(1);
        expect(azdevClientMock.createServiceEndpoint).toHaveBeenCalledWith(endpointMock);
        expect(result).toEqual(endpointMock);

        expect(oidcCredentialMock.createFederatedCredential).toHaveBeenCalledTimes(1);
        expect(oidcCredentialMock.createFederatedCredential).toHaveBeenCalledWith({
            name: 'project-id',
            servicePrincipalClientId: 'client-id',
            subject: 'subject',
            issuer: 'issuer'
        });
    });

    it('should remove obsolete credentials when working with SpnKey credential', async () =>
    {
        azureEndpoint = new AzureEndpoint({
            azdevClient: azdevClientMock,
            logger: loggerMock,
            azureClient: azureClientMock,
            credential: spnKeyCredentialMock,
            endpointConfiguration: azureSpnKeyEndpointConfigurationMock
        });

        jest.spyOn(azureEndpoint as any, 'getExistingEndpoint').mockResolvedValue(endpointMock);
        jest.spyOn(azureEndpoint as any, 'createEndpointObject').mockReturnValue(endpointMock);
        azdevClientMock.updateServiceEndpoint.mockResolvedValue(endpointMock);

        const result = await azureEndpoint.createEndpoint('project-id');

        expect(azdevClientMock.updateServiceEndpoint).toHaveBeenCalledTimes(1);
        expect(azdevClientMock.updateServiceEndpoint).toHaveBeenCalledWith(endpointMock);
        expect(result).toEqual(endpointMock);

        expect(spnKeyCredentialMock.removeObsoleteCredentials).toHaveBeenCalledTimes(1);
        expect(spnKeyCredentialMock.removeObsoleteCredentials).toHaveBeenCalledWith({
            projectName: 'project-id',
            servicePrincipalClientId: 'client-id'
        });
    });
});
