/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAzDevServiceEndpoint } from "../../clients/azdevclient/models/iazdevserviceendpoint";
import { AzureEndpoint } from "../../endpoints/azureendpoint";
import { EndpointType } from "../../readers/endpointconfigurationreader/models/iendpointconfiguration";
import { azdevClientMock } from "../_mocks/azdevClientMock";
import { azureClientMock } from "../_mocks/azureClientMock";
import { azureDefaultEndpointConfigurationMock, credentialMock } from "../_mocks/configurationMocks";
import { loggerMock } from "../_mocks/mocks";

describe('AzureEndpoint', () =>
{
    let azureEndpoint: AzureEndpoint;

    const endpointMock: IAzDevServiceEndpoint = {
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

    beforeEach(() =>
    {
        jest.clearAllMocks();

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

    // it('should update an existing endpoint if one exists', async () =>
    // {
    //     // Setup
    //     azdevClientMock.getExistingEndpoint.mockResolvedValue(/* Existing endpoint data */);
    //     azdevClientMock.updateServiceEndpoint.mockResolvedValue(/* Updated endpoint data */);

    //     // Test
    //     const result = await azureEndpoint.createEndpoint('project-id');

    //     // Assertions
    //     expect(azdevClientMock.updateServiceEndpoint).toHaveBeenCalled();
    //     expect(result).toEqual(/* Expected updated endpoint data */);
    // });

    // Additional tests for OIDC and SpnKey credential types

    // Test other methods like createEndpointObject, createOidcEndpointObject, createSpnKeyEndpointObject, etc.
});
