/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAzDevClient } from "../../clients/azdevclient/iazdevclient";

export const azdevClientMock: jest.Mocked<IAzDevClient> = new Proxy({}, {
    get: (target: any, prop: string) =>
    {
        if (!target[prop])
        {
            target[prop] = jest.fn();
        }
        return target[prop];
    },
}) as jest.Mocked<IAzDevClient>;