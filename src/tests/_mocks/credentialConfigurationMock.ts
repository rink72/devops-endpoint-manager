import { EndpointCredentialType, IEndpointSpnKeyCredentialConfiguration } from "../../readers/endpointconfigurationreader/models/iendpointcredentialconfiguration";

export const spnCredentialConfigurationMock: IEndpointSpnKeyCredentialConfiguration = {
    daysValid: 3,
    type: EndpointCredentialType.SpnKey
}