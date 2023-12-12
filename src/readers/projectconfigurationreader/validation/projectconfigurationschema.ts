import * as yup from 'yup';

export const endpointSchema = yup.object({
    name: yup.string().required("Endpoint name is required")
});

export const projectConfigurationSchema = yup.object({
    name: yup.string().required("Project name is required"),
    removeObsoleteEndpoints: yup.boolean().default(false).nonNullable("removeObsoleteEndpoints is required"),
    endpoints: yup.array().of(endpointSchema).default([]).required("Endpoints are required")
}).noUnknown().strict();