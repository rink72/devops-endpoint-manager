import { endpointSchema, projectConfigurationSchema } from "../../../../readers/projectconfigurationreader/validation/projectconfigurationschema";

describe('endpointSchema', () =>
{
    it('validates a correct endpoint', async () =>
    {
        const validEndpoint = { name: 'TestEndpoint' };
        await expect(endpointSchema.validate(validEndpoint)).resolves.toEqual(validEndpoint);
    });

    it('rejects an endpoint with missing name', async () =>
    {
        const invalidEndpoint = {};
        await expect(endpointSchema.validate(invalidEndpoint)).rejects.toThrow();
    });
});

describe('projectConfigurationSchema', () =>
{
    it('validates a correct project configuration', async () =>
    {
        const validConfig = {
            name: 'TestProject',
            removeObsoleteEndpoints: true,
            endpoints: [{ name: 'TestEndpoint' }]
        };

        await expect(projectConfigurationSchema.validate(validConfig)).resolves.toEqual(validConfig);
    });

    it('rejects a project configuration with missing name', async () =>
    {
        const invalidConfig = {
            removeObsoleteEndpoints: true,
            endpoints: [{ name: 'TestEndpoint' }]
        };

        await expect(projectConfigurationSchema.validate(invalidConfig)).rejects.toThrow();
    });

    it('rejects a project configuration with invalid endpoint structure', async () =>
    {
        const invalidConfig = {
            name: 'TestProject',
            removeObsoleteEndpoints: true,
            endpoints: [{}]
        };

        await expect(projectConfigurationSchema.validate(invalidConfig)).rejects.toThrow();
    });
});
