export interface IProjectOrchestrator
{
    run(): Promise<void>
}