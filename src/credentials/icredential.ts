export interface ICredential
{
    getCredential(rotate: boolean): Promise<string>
}