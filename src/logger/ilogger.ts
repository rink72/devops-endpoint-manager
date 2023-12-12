export interface ILogger
{
    debug(message: string, component?: string): void;
    info(message: string, component?: string): void;
    warn(message: string, component?: string): void;
    error(message: string, component?: string): void;
    verbose(message: string, component?: string): void;
}