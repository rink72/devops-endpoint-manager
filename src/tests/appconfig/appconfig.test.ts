import { AppConfig } from "../../appconfig/appconfig";

describe('AppConfig', () =>
{
    const originalEnv = process.env;

    beforeEach(() =>
    {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() =>
    {
        process.env = originalEnv;
    });

    it('should initialize with default values if no props are provided', () =>
    {
        process.env.DEVEND_AZDEV_TOKEN = 'testToken';
        process.env.DEVEND_AZDEV_URL = 'testUrl';
        process.env.DEVEND_LOGGING_LEVEL = 'debug';

        const appConfig = new AppConfig();

        expect(appConfig.getAzDevToken()).toBe('testToken');
        expect(appConfig.getAzDevUrl()).toBe('testUrl');
        expect(appConfig.getLoggingLevel()).toBe('debug');
        expect(appConfig.getProjectsConfigurationPath()).toContain('projects.json');
        expect(appConfig.getEndpointsConfigurationPath()).toContain('endpoints.json');
    });

    it('should throw an error if a required configuration is not provided', () =>
    {
        expect(() => new AppConfig()).toThrow('Configuration for \'DEVEND_AZDEV_TOKEN\' is required but was not provided.');
    });

    it('should initialize with provided props values', () =>
    {
        const props = {
            azDevToken: 'customToken',
            azDevUrl: 'customUrl',
            projectsConfigurationPath: 'customProjectsPath',
            endpointsConfigurationPath: 'customEndpointsPath',
            loggingLevel: 'warn'
        };

        const appConfig = new AppConfig(props);

        expect(appConfig.getAzDevToken()).toBe('customToken');
        expect(appConfig.getAzDevUrl()).toBe('customUrl');
        expect(appConfig.getLoggingLevel()).toBe('warn');
        expect(appConfig.getProjectsConfigurationPath()).toBe('customProjectsPath');
        expect(appConfig.getEndpointsConfigurationPath()).toBe('customEndpointsPath');
    });

    it('should throw an error if azDevToken is missing in props and env', () =>
    {
        delete process.env.DEVEND_AZDEV_TOKEN;
        const props = {
            azDevUrl: 'customUrl',
        };

        expect(() => new AppConfig(props)).toThrow('Configuration for \'DEVEND_AZDEV_TOKEN\' is required but was not provided.');
    });

    it('should throw an error if azDevUrl is missing in props and env', () =>
    {
        delete process.env.DEVEND_AZDEV_URL;
        const props = {
            azDevToken: 'customToken',
        };

        expect(() => new AppConfig(props)).toThrow('Configuration for \'DEVEND_AZDEV_URL\' is required but was not provided.');
    });
});
