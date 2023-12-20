/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAzureClient } from "../../clients/azureclient/iazureclient";

// export const azureClientMock: IAzureClient = {
//     createFederatedCredential: jest.fn(),
//     createServicePrincipalSecret: jest.fn(),
//     getServicePrincipalByAppId: jest.fn(),
//     getFederatedCredential: jest.fn(),
//     listServicePrincipalFederatedCredentials: jest.fn(),
//     listServicePrincipalSecrets: jest.fn(),
//     removeServicePrincipalSecret: jest.fn(),
//     updateFederatedCredential: jest.fn(),
// }

export const azureClientMock: jest.Mocked<IAzureClient> = new Proxy({}, {
    get: (target: any, prop: string) =>
    {
        if (!target[prop])
        {
            target[prop] = jest.fn();
        }
        return target[prop];
    },
}) as jest.Mocked<IAzureClient>;