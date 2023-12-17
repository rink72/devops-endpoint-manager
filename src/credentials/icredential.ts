export interface ICredential
{
    getCredential(): Promise<string>
}