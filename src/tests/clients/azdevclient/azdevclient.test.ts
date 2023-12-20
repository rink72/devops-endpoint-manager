import { AzDevClient } from '../../../clients/azdevclient/azdevclient';
import { IAzDevServiceEndpointProjectReferences } from '../../../clients/azdevclient/models/iazdevserviceendpoint';
import { loggerMock, WebApiMock, getProjectsMock, updateServiceEndpointtMock, deleteServiceEndpointMock } from '../../_mocks/mocks';

jest.mock('azure-devops-node-api');

describe('AzDevClient', () =>
{
    let azDevClient: AzDevClient;

    beforeEach(() =>
    {
        getProjectsMock.mockClear();
        updateServiceEndpointtMock.mockClear();
        deleteServiceEndpointMock.mockClear();
        azDevClient = new AzDevClient({ logger: loggerMock, azdevConnection: new WebApiMock() });
    });

    it('should retrieve projects', async () =>
    {
        const projects = await azDevClient.getProjects();

        expect(getProjectsMock).toHaveBeenCalled();
        expect(projects).toHaveLength(3);
        expect(projects[0].id).toBe('1');
        expect(projects[0].name).toBe('Project1');
        expect(projects[2].id).toBe('3');
        expect(projects[2].name).toBe('Project3');
    });

    it('should retrieve project by name', async () =>
    {
        const project = await azDevClient.getProjectByName('Project2');

        expect(getProjectsMock).toHaveBeenCalled();
        expect(project.id).toBe('2');
        expect(project.name).toBe('Project2');
    });

    it('should throw an error if project is not found', async () =>
    {
        await expect(azDevClient.getProjectByName('Project4')).rejects.toThrow('Project <Project4> not found');
    });

    it('should retrieve service endpoints', async () =>
    {
        const serviceEndpoints = await azDevClient.getServiceEndpoints('project-id');

        expect(serviceEndpoints).toHaveLength(3);
        expect(serviceEndpoints[0].id).toBe('1');
        expect(serviceEndpoints[0].name).toBe('Endpoint1');
        expect(serviceEndpoints[2].id).toBe('3');
        expect(serviceEndpoints[2].name).toBe('Endpoint3');
    });

    it('should retrieve service endpoint by name', async () =>
    {
        const serviceEndpoint = await azDevClient.getServiceEndpointByName('project-id', 'Endpoint2');

        expect(serviceEndpoint?.id).toBe('2');
        expect(serviceEndpoint?.name).toBe('Endpoint2');
    });

    it('should create service endpoint', async () =>
    {
        const serviceEndpoint = await azDevClient.createServiceEndpoint({
            name: 'Endpoint1',
            type: 'AzureRM',
            url: 'https://management.azure.com/',
            authorization: {
                parameters: {
                    tenantid: 'tenant-id',
                    serviceprincipalid: 'client-id',
                    authenticationType: 'spnKey',
                    serviceprincipalkey: 'client-secret'
                },
                scheme: 'ServicePrincipal'
            },
            isShared: false,
            data: {},
            owner: 'library'
        });

        expect(serviceEndpoint.id).toBe('1');
        expect(serviceEndpoint.name).toBe('Endpoint1');
    });

    it('should update service endpoint', async () =>
    {
        const serviceEndpoint = await azDevClient.updateServiceEndpoint({
            id: '3',
            name: 'Endpoint3',
            type: 'AzureRM',
            url: 'https://management.azure.com/',
            authorization: {
                parameters: {
                    tenantid: 'tenant-id',
                    serviceprincipalid: 'client-id',
                    authenticationType: 'spnKey',
                    serviceprincipalkey: 'client-secret'
                },
                scheme: 'ServicePrincipal'
            },
            isShared: false,
            data: {},
            owner: 'library'
        });

        expect(serviceEndpoint.id).toBe('3');
        expect(serviceEndpoint.name).toBe('Endpoint3');
    });

    it('should share service endpoint', async () =>
    {
        const projectReferencesMock: IAzDevServiceEndpointProjectReferences[] = [
            {
                name: 'my-endpoint',
                projectReference: {
                    id: '1',
                    name: 'Project1'
                },
                description: 'my-endpoint-description'
            },
            {
                name: 'my-endpoint',
                projectReference: {
                    id: '2',
                    name: 'Project2'
                },
                description: 'my-endpoint-description'
            }
        ];

        await azDevClient.shareServiceEndpoint('project-id', projectReferencesMock);

        expect(updateServiceEndpointtMock).toHaveBeenCalled();
    });

    it('should delete service endpoint', async () =>
    {
        await azDevClient.deleteServiceEndpoint('endpoint-id', 'project-id');

        expect(deleteServiceEndpointMock).toHaveBeenCalled();
    });

});

