import winston from "winston";

// Create a custom logger
const logger = winston.createLogger({
    level: "info", // Default logging level
    format: winston.format.combine(
        winston.format.colorize(), // Add color to log levels
        winston.format.timestamp({
            format: "HH:mm:ss.sss", // Custom time format (only hours, minutes, and seconds)
        }),
        winston.format.printf(({ timestamp, level, message }) => {
            const spaces = ".".repeat(20 - level.length); // Calculate spaces to align log messages
            return `${timestamp} [${level}] ${spaces} ${message}`; // Format the log message
        })
    ),
    transports: [
        new winston.transports.Console(), // Log to the console
    ],
});

export default logger;
