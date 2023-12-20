import fs from 'fs/promises';

import { EndpointConfigurationReader } from '../../../readers/endpointconfigurationreader/endpointconfigurationreader';
import { IReaderProps } from '../../../readers/factories/readerfactory';
import { appConfigMock, loggerMock } from '../../_mocks/mocks';
import { endpointsFileDataMock } from '../../_mocks/data';

jest.mock('fs/promises');

describe('EndpointConfigurationReader', () =>
{
    const mockProps: IReaderProps = {
        appConfig: appConfigMock,
        logger: loggerMock
    };

    beforeEach(() =>
    {
        (fs.readFile as jest.Mock).mockImplementation(() => Promise.resolve(endpointsFileDataMock));
    });

    it('reads and validates endpoint configuration successfully', async () =>
    {
        const reader = new EndpointConfigurationReader(mockProps);
        const config = await reader.readConfiguration();

        expect(config).toHaveLength(5);

        expect(config[0]).toEqual({
            name: 'my-mock-azure-oidc-sve',
            type: 'Azure',
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
                type: 'OIDC'
            }
        });
    });

    it('handles file read errors', async () =>
    {
        (fs.readFile as jest.Mock).mockRejectedValue(new Error('File read error'));

        const reader = new EndpointConfigurationReader(mockProps);

        await expect(reader.readConfiguration()).rejects.toThrow('File read error');
    });
});
