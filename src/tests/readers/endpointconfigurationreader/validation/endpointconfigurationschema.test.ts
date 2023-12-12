import { EndpointType } from "../../../../readers/endpointconfigurationreader/models/iendpointconfiguration";
import { EndpointCredentialType } from "../../../../readers/endpointconfigurationreader/models/iendpointcredentialconfiguration";
import { azureEndpointConfigurationSchema, sharedEndpointConfigurationSchema, sonarCloudEndpointConfigurationSchema, snykEndpointConfigurationSchema } from "../../../../readers/endpointconfigurationreader/validation/endpointconfigurationschema";

describe('General Endpoint Configuration Schema', () =>
{
    it('should throw an error on invalid credential type', async () =>
    {
        const invalidConfig = {
            name: 'TestEndpoint',
            type: EndpointType.Azure,
            tenantId: 'tenant-id',
            identity: {
                type: 'ServicePrincipal',
                clientId: 'client-id'
            },
            scope: {
                type: 'Subscription',
                id: 'subscription-id',
                name: 'subscription-name'
            },
            credential: {
                type: 'InvalidCredentialType',
                variableName: 'TEST_VAR'
            }
        };

        await expect(azureEndpointConfigurationSchema.validate(invalidConfig)).rejects.toThrow();
    });

    it('should throw an error on missing credential type', async () =>
    {
        const invalidConfig = {
            name: 'TestEndpoint',
            type: EndpointType.Azure,
            tenantId: 'tenant-id',
            identity: {
                type: 'ServicePrincipal',
                clientId: 'client-id'
            },
            scope: {
                type: 'Subscription',
                id: 'subscription-id',
                name: 'subscription-name'
            },
            credential: {
                variableName: 'TEST_VAR'
            }
        };

        await expect(azureEndpointConfigurationSchema.validate(invalidConfig)).rejects.toThrow();
    });

    it('should throw an error on invalid endpoint type', async () =>
    {
        const invalidConfig = {
            name: 'TestEndpoint',
            type: 'InvalidEndpointType',
            tenantId: 'tenant-id',
            identity: {
                type: 'ServicePrincipal',
                clientId: 'client-id'
            },
            scope: {
                type: 'Subscription',
                id: 'subscription-id',
                name: 'subscription-name'
            },
            credential: {
                type: EndpointCredentialType.EnvironmentVariable,
                variableName: 'TEST_VAR'
            }
        };

        await expect(azureEndpointConfigurationSchema.validate(invalidConfig)).rejects.toThrow();
    });
});

describe('Azure Endpoint Configuration Schema', () =>
{
    it('validates a correct Azure endpoint configuration', async () =>
    {
        const validConfig = {
            name: 'TestEndpoint',
            type: EndpointType.Azure,
            tenantId: 'tenant-id',
            identity: {
                type: 'ServicePrincipal',
                clientId: 'client-id'
            },
            scope: {
                type: 'Subscription',
                id: 'subscription-id',
                name: 'subscription-name'
            },
            credential: {
                type: EndpointCredentialType.EnvironmentVariable,
                variableName: 'TEST_VAR'
            }
        };

        await expect(azureEndpointConfigurationSchema.validate(validConfig)).resolves.toEqual(validConfig);
    });

    it('should invalidate an Azure endpoint configuration with missing parameters', async () =>
    {
        const invalidConfig = {
            type: EndpointType.Azure,
            tenantId: 'tenant-id',
        };

        await expect(azureEndpointConfigurationSchema.validate(invalidConfig)).rejects.toThrow();
    });
});


describe('Shared Endpoint Configuration Schema', () =>
{
    it('validates a correct Shared endpoint configuration', async () =>
    {
        const validConfig = {
            name: 'SharedEndpoint',
            type: EndpointType.Shared,
            sourceProject: 'ProjectX'
        };

        await expect(sharedEndpointConfigurationSchema.validate(validConfig)).resolves.toEqual(validConfig);
    });

    it('invalidates a Shared endpoint configuration with missing parameters', async () =>
    {
        const invalidConfig = {
            name: 'SharedEndpoint',
            type: EndpointType.Shared
        };

        await expect(sharedEndpointConfigurationSchema.validate(invalidConfig)).rejects.toThrow();
    });
});

describe('SonarCloud Endpoint Configuration Schema', () =>
{
    it('validates a correct SonarCloud endpoint configuration', async () =>
    {
        const validConfig = {
            name: 'SonarCloudEndpoint',
            type: EndpointType.SonarCloud,
            credential: {
                type: EndpointCredentialType.Key,
                clientId: 'client-id',
                daysValid: 30
            }
        };

        await expect(sonarCloudEndpointConfigurationSchema.validate(validConfig)).resolves.toEqual(validConfig);
    });

    it('invalidates a SonarCloud endpoint configuration with missing parameters', async () =>
    {
        const invalidConfig = {
            name: 'SonarCloudEndpoint',
            type: EndpointType.SonarCloud
        };

        await expect(sonarCloudEndpointConfigurationSchema.validate(invalidConfig)).rejects.toThrow();
    });
});

describe('Snyk Endpoint Configuration Schema', () =>
{
    it('validates a correct Snyk endpoint configuration', async () =>
    {
        const validConfig = {
            name: 'SnykEndpoint',
            serverUrl: "https://snyk.io/",
            type: EndpointType.Snyk,
            credential: {
                type: EndpointCredentialType.EnvironmentVariable,
                variableName: 'SNYK_TOKEN'
            }
        };

        await expect(snykEndpointConfigurationSchema.validate(validConfig)).resolves.toEqual(validConfig);
    });

    it('invalidates a Snyk endpoint configuration with missing parameters', async () =>
    {
        const invalidConfig = {
            name: 'SnykEndpoint',
            type: EndpointType.Snyk
        };

        await expect(snykEndpointConfigurationSchema.validate(invalidConfig)).rejects.toThrow();
    });
});
