import winston, { format } from "winston";

const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new winston.transports.File({ dirname: "logs", filename: "error.log", level: "error" }),
        new winston.transports.File({ dirname: "logs", filename: "warn.log", level: "warn" }),
        new winston.transports.File({ dirname: "logs", filename: "info.log", level: "info" }),
        new winston.transports.File({ dirname: "logs", filename: "debug.log", level: "debug" })
    ]
});

if (process.env.NODE_ENV !== "production")
    logger.add(new winston.transports.Console({format: format.combine(format.timestamp(), format.simple())}));

export default logger;