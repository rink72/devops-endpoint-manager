/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { IKeyVaultClient } from '../../../clients/keyvaultclient/ikeyvaultclient';
import { loggerMock } from '../../_mocks/mocks';
import { KeyVaultClient } from '../../../clients/keyvaultclient/keyvaultclient';

jest.mock('@azure/keyvault-secrets');

describe('KeyVaultClient', () =>
{
    let keyVaultClient: IKeyVaultClient;
    let mockSecretClient: any;

    const getSecretMock = jest.fn();

    jest.mock('@azure/keyvault-secrets', () =>
    {
        return {
            SecretClient: jest.fn().mockImplementation(() =>
            {
                return {
                    getSecret: getSecretMock
                };
            })
        };
    });

    beforeEach(() =>
    {
        mockSecretClient = new (require('@azure/keyvault-secrets').SecretClient)();
        keyVaultClient = new KeyVaultClient({ logger: loggerMock, secretClient: mockSecretClient });
    });

    it('should retrieve a secret', async () =>
    {
        const secretName = 'testSecret';
        const secretValue = 'secretValue';
        mockSecretClient.getSecret.mockResolvedValue({ value: secretValue });

        const result = await keyVaultClient.getSecret(secretName);

        expect(result).toBe(secretValue);
        expect(mockSecretClient.getSecret).toHaveBeenCalledWith(secretName);
    });

    it('should return null for a non-existent secret', async () =>
    {
        const secretName = 'nonExistentSecret';
        mockSecretClient.getSecret.mockResolvedValue({ value: null });

        const result = await keyVaultClient.getSecret(secretName);

        expect(result).toBeNull();
        expect(mockSecretClient.getSecret).toHaveBeenCalledWith(secretName);
    });
});
