const logger = require("../logger");

const log = (msg) => {
    logger.error(msg);
    logger.end();
    logger.on('finish', () => {
            process.exit(1);
        }
    );
}
module.exports = () => {
    process.on('uncaughtException', (err) => {
      log(err.message);
    });

    process.on('unhandledRejection', (err) => {
        log(err.message);
    });
};

