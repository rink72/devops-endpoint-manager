import { TeamProjectReference } from "azure-devops-node-api/interfaces/CoreInterfaces";
import { IAppConfig } from "../../appconfig/iappconfig";
import { ILogger } from "../../logger/ilogger";
import { IAzDevServiceEndpoint } from "../../clients/azdevclient/models/iazdevserviceendpoint";

export const loggerMock: ILogger = {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    verbose: jest.fn()
};

export const appConfigMock: IAppConfig = {
    getEndpointsConfigurationPath: () => 'my-endpoints-path.yml',
    getProjectsConfigurationPath: () => 'my-projects-path.yml',
    getLoggingLevel: () => 'my-logging-level',
    getAzDevToken: () => 'my-token',
    getAzDevUrl: () => 'my-azdev-url'
};

const projectsMock = [
    { id: '1', name: 'Project1' },
    { id: '2', name: 'Project2' },
    { id: '3', name: 'Project3' }
] as TeamProjectReference[];

const serviceEndpointsMock = [
    { id: '1', name: 'Endpoint1' },
    { id: '2', name: 'Endpoint2' },
    { id: '3', name: 'Endpoint3' }
] as IAzDevServiceEndpoint[];

export const getProjectsMock = jest.fn().mockResolvedValue(projectsMock);
export const updateServiceEndpointtMock = jest.fn();
export const deleteServiceEndpointMock = jest.fn();
export const getServiceEndpointsMock = { result: { value: serviceEndpointsMock } };
export const getServiceEndpointByNameMock = { result: { value: [serviceEndpointsMock[1]] } };
export const createServiceEndpointMock = { result: serviceEndpointsMock[0] };
export const updateServiceEndpointMock = { result: serviceEndpointsMock[2] };
export const shareServiceEndpointMock = { result: serviceEndpointsMock[1] };

export const WebApiMock = jest.fn().mockImplementation(() => ({
    getCoreApi: jest.fn().mockImplementation(() => ({
        getProjects: getProjectsMock,
        getServiceEndpoints: getServiceEndpointsMock
    })),

    rest: {
        update: updateServiceEndpointtMock,
        del: deleteServiceEndpointMock,

        get: jest.fn().mockImplementation((url: string) =>
        {
            if (url.includes('_apis/serviceendpoint/endpoints?'))
            {
                if (url.includes('endpointNames'))
                {
                    return Promise.resolve(getServiceEndpointByNameMock);
                }
                else
                {
                    return Promise.resolve(getServiceEndpointsMock);
                }
            }

            throw new Error(`Unexpected URL <${url}>`);
        }),

        create: jest.fn().mockImplementation((url: string) =>
        {
            if (url.includes('_apis/serviceendpoint/endpoints'))
            {
                return Promise.resolve(createServiceEndpointMock);
            }

            throw new Error(`Unexpected URL <${url}>`);
        }),

        replace: jest.fn().mockImplementation((url: string) =>
        {
            if (url.includes('_apis/serviceendpoint/endpoints'))
            {
                return Promise.resolve(updateServiceEndpointMock);
            }

            throw new Error(`Unexpected URL <${url}>`);
        })
    }
}));
