/* eslint-disable @typescript-eslint/no-explicit-any */

import { Client, GraphRequest } from "@microsoft/microsoft-graph-client";

export const apiMock: jest.Mocked<GraphRequest> = new Proxy({}, {
    get: (target: any, prop: string) =>
    {
        if (!target[prop])
        {
            target[prop] = jest.fn().mockReturnThis(); // Ensures fluent API methods like .api().version()... work
        }
        return target[prop];
    },
}) as jest.Mocked<GraphRequest>;

export const graphClientMock = {
    api: jest.fn(() => apiMock)
} as unknown as Client