'use strict';
const path = require('path');
const env =   require('dotenv').config({ path: path.resolve(__dirname, '../dbConfig.env') });
const app = require('../app');
const logger = require('../lib/logger');


console.log(env);
return app.connectMongoose()
    .then(() => {
        console.log("Server Ready")
        const application = app.initialize();
        application.listen(process.env.SERVER_PORT, () => {
            logger.info(`Your server is listening on port ${process.env.SERVER_PORT}`);
        });
    })
    .catch((error) => {
        logger.error('APP STOPPED');
        logger.error(error.stack);
        return process.exit(1);
    });