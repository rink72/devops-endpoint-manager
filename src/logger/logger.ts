import winston from "winston";
import { ILogger } from "./ilogger";

export class WinstonLogger implements ILogger
{
    private readonly loggerInstance: winston.Logger;

    constructor(level = "info")
    {
        this.loggerInstance = winston.createLogger({
            transports: [new winston.transports.Console({ level })],
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message }) =>
                {
                    return `[${timestamp}] ${level}: ${message}`;
                })
            ),
        });
    }

    public verbose(message: string): void
    {
        this.loggerInstance.verbose(message);
    }

    public warn(message: string): void
    {
        this.loggerInstance.warn(message);
    }

    public info(message: string): void
    {
        this.loggerInstance.info(message);
    }

    public error(message: string): void
    {
        this.loggerInstance.error(message);
    }

    public debug(message: string): void
    {
        this.loggerInstance.debug(message);
    }

    public close(): void
    {
        this.loggerInstance.debug("Closing logger instance");

        this.loggerInstance.close();
    }
}