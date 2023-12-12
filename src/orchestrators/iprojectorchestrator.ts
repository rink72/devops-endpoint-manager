export interface IProjectOrchestrator
{
    run(rotateCredentials: boolean): Promise<void>
}