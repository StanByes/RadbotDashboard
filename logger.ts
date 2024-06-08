import winston, { format } from "winston";

const logger = winston.createLogger({
    levels: {
        auth: 0,
        error: 1,
        warn: 2,
        info: 3
    },
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new winston.transports.File({ dirname: "logs", filename: "error.log", level: "error" }),
        new winston.transports.File({ dirname: "logs", filename: "warn.log", level: "warn" }),
        new winston.transports.File({ dirname: "logs", filename: "auth.log", level: "auth" }),
        new winston.transports.File({ dirname: "logs", filename: "combined.log", level: "info" })
    ]
});

if (process.env.NODE_ENV !== "production")
    logger.add(new winston.transports.Console({format: format.combine(format.timestamp(), format.simple())}));

export default logger;