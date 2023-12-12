export interface IAzureAuthProvider
{
    getManagementToken(): Promise<string>
    getGraphToken(): Promise<string>
}