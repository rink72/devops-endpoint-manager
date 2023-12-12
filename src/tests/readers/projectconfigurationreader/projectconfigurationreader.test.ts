import fs from 'fs/promises';
import { appConfigMock, loggerMock } from '../../mocks';
import { projectsFileDataMock } from '../../data';
import { ProjectConfigurationReader } from '../../../readers/projectconfigurationreader/projectconfigurationreader';
import { IReaderProps } from '../../../readers/factories/readerfactory';

jest.mock('fs/promises');

describe('ProjectConfigurationReader', () =>
{
    const mockProps: IReaderProps = {
        appConfig: appConfigMock,
        logger: loggerMock
    };

    beforeEach(() =>
    {
        (fs.readFile as jest.Mock).mockImplementation(() => Promise.resolve(projectsFileDataMock));
    });

    it('reads and validates project configuration successfully', async () =>
    {
        const reader = new ProjectConfigurationReader(mockProps);
        const config = await reader.readConfiguration();

        expect(config).toHaveLength(2);
        expect(config[0].name).toEqual('my-project-one')
        expect(config[1].name).toEqual('my-project-two')
    });

    it('handles errors when unable to read configuration file', async () =>
    {
        (fs.readFile as jest.Mock).mockRejectedValue(new Error('File read error'));

        const reader = new ProjectConfigurationReader(mockProps);

        await expect(reader.readConfiguration()).rejects.toThrow('File read error');
    });

});
