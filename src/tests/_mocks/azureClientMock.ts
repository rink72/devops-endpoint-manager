/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAzureClient } from "../../clients/azureclient/iazureclient";

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