export interface IKeyVaultClient
{
    getSecret(secretName: string): Promise<string | null>
}